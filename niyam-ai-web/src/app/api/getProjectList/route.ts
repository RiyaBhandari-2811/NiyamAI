import { db } from "@/config/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    console.log("[JiraProjectsAPI] Incoming request for userId:", userId);

    if (!userId) {
      console.warn("[JiraProjectsAPI] Missing userId in request");
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // 1. Fetch user credentials from Firestore
    const userDoc = db.collection("users").doc(userId);
    console.log("[JiraProjectsAPI] Fetching Firestore document for userId:", userId);

    const snapshot = await userDoc.get();

    if (!snapshot.exists) {
      console.warn("[JiraProjectsAPI] User not found in Firestore for userId:", userId);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const data = snapshot.data();
    console.log("[JiraProjectsAPI] Firestore document data:", data);

    const accessToken = data?.jira?.accessToken;
    const cloudId = data?.jira?.cloudId;

    if (!accessToken || !cloudId) {
      console.warn(
        `[JiraProjectsAPI] Missing Jira credentials for userId ${userId}. accessToken: ${!!accessToken}, cloudId: ${!!cloudId}`
      );
      return NextResponse.json(
        { error: "Missing Jira credentials" },
        { status: 400 }
      );
    }

    // 2. Call Jira REST API to fetch project list
    console.log(`[JiraProjectsAPI] Calling Jira API for cloudId ${cloudId}`);
    const jiraResponse = await fetch(
      `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/project/search`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!jiraResponse.ok) {
      const errorText = await jiraResponse.text();
      console.error(`[JiraProjectsAPI] Jira API error: ${jiraResponse.status}`, errorText);
      return NextResponse.json(
        { error: errorText },
        { status: jiraResponse.status }
      );
    }

    const jiraData = await jiraResponse.json();
    console.log("[JiraProjectsAPI] Jira API response:", jiraData.values);

    return NextResponse.json(jiraData.values || []);
  } catch (error) {
    console.error("[JiraProjectsAPI] Internal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
