import { db } from "@/config/firebaseAdmin";
import { NextResponse } from "next/server";
import { getAesKey } from "@/config/getGoogleSecret";
import { decryptObject } from "@/lib/utils";
import crypto from "crypto";

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
    const jiraData = data?.jira;

    if (!jiraData || !jiraData.data || !jiraData.iv) {
      console.warn(`[JiraProjectsAPI] Missing encrypted Jira data for userId ${userId}`);
      return NextResponse.json(
        { error: "Missing encrypted Jira data" },
        { status: 400 }
      );
    }

    // 2. Decrypt Jira credentials
    const aesKeyBuffer : any = await getAesKey();
    const key = Buffer.from(aesKeyBuffer, "base64");

    let decryptedJira;
    try {
      decryptedJira = decryptObject(jiraData.data, jiraData.iv, key);
    } catch (err) {
      console.error("[JiraProjectsAPI] Failed to decrypt Jira data:", err);
      return NextResponse.json(
        { error: "Failed to decrypt Jira credentials" },
        { status: 500 }
      );
    }

    const { accessToken, cloudId } = decryptedJira;
    if (!accessToken || !cloudId) {
      console.warn(
        `[JiraProjectsAPI] Missing Jira credentials after decryption for userId ${userId}`
      );
      return NextResponse.json(
        { error: "Missing Jira credentials" },
        { status: 400 }
      );
    }

    // 3. Call Jira REST API
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

    const jiraDataResponse = await jiraResponse.json();
    console.log("[JiraProjectsAPI] Jira API response:", jiraDataResponse.values);

    return NextResponse.json(jiraDataResponse.values || []);
  } catch (error) {
    console.error("[JiraProjectsAPI] Internal error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
