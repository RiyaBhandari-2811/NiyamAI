import { NextResponse } from "next/server";
import { db } from "@/config/firebaseAdmin";

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

    // Example action: delete user after decryption
    await userRef.delete();

    return NextResponse.json(
      {
        success: true,
        message: "User disconnected successfully",
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
