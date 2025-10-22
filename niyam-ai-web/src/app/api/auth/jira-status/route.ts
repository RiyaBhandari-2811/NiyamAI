import { db } from "@/src/config/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId)
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const doc = await db.collection("users").doc(userId).get();
  const connected = doc.exists ? doc.data()?.jira?.connected ?? false : false;

  return NextResponse.json({ connected });
}
