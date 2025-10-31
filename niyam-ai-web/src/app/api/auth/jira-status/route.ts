import { db } from "@/config/firebaseAdmin";
import { NextResponse } from "next/server";
import { getAesKey } from "@/config/getGoogleSecret";
import { decryptObject } from "@/lib/utils";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    console.log("jira-status userID: " + userId);

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const doc = await db.collection("users").doc(userId).get();

    if (!doc.exists) {
      console.log("Doc not present in DB")
      return NextResponse.json({ connected: false }, { status: 200 });
    }

    const jiraData = doc.data()?.jira;
    if (!jiraData || !jiraData.data || !jiraData.iv) {
      return NextResponse.json({ connected: false }, { status: 200 });
    }

    // Fetch and decode AES key from Google Secret Manager
    const aesKeyBuffer: any = await getAesKey();
    const key = Buffer.from(aesKeyBuffer, "base64");

    // Decrypt the stored Jira data
    const decryptedJira = decryptObject(jiraData.data, jiraData.iv, key);

    console.log("decryptedJira: ", decryptedJira);

    // If decryption succeeds, user is connected
    return NextResponse.json({
      connected: jiraData.connected ?? false,
      jira: decryptedJira,
    });
  } catch (error) {
    console.error("Error fetching Jira connection:", error);
    return NextResponse.json(
      { error: "Failed to fetch Jira connection" },
      { status: 500 }
    );
  }
}
