import { NextResponse } from "next/server";
import { db } from "@/config/firebaseAdmin";
import { getAesKey } from "@/config/getGoogleSecret";
import { decryptObject } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Missing userId" },
        { status: 400 }
      );
    }

    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const userData = userSnap.data();
    const jiraData = userData?.jira;

    if (!jiraData || !jiraData.data || !jiraData.iv) {
      return NextResponse.json(
        { success: false, message: "No encrypted Jira data found" },
        { status: 404 }
      );
    }

    // Await the secret retrieval
    const AES_KEY: any = await getAesKey(); // base64 encoded string

    if (!AES_KEY) {
      return NextResponse.json(
        { success: false, message: "Missing AES key in environment" },
        { status: 500 }
      );
    }

    // Convert resolved string to Buffer
    const decryptedJira = decryptObject(
      jiraData.data,
      jiraData.iv,
      Buffer.from(AES_KEY, "base64")
    );

    console.log("Decrypted Jira Object:", decryptedJira);

    // Example action: delete user after decryption
    await userRef.delete();

    return NextResponse.json(
      {
        success: true,
        message: "User disconnected successfully",
        decryptedJira,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during Jira disconnect:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
