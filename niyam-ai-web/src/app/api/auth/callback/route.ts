import { db } from "@/src/config/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  // Step 1: Exchange code for access & refresh token
  const tokenResponse = await fetch("https://auth.atlassian.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: process.env.NEXT_PUBLIC_ATLASSIAN_CLIENT_ID,
      client_secret: process.env.ATLASSIAN_CLIENT_SECRET,
      code,
      redirect_uri: "https://niyam-ai-web.vercel.app/api/auth/callback",
    }),
  });

  const tokenData = await tokenResponse.json();

  if (!tokenData.access_token || !tokenData.refresh_token) {
    return NextResponse.json(
      { error: "Token exchange failed", details: tokenData },
      { status: 400 }
    );
  }

  // Step 2: Fetch Cloud ID
  const res = await fetch(
    "https://api.atlassian.com/oauth/token/accessible-resources",
    {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    }
  );

  const resources = await res.json();
  const cloudId = resources[0]?.id;

  if (!cloudId) {
    return NextResponse.json(
      { error: "Cloud ID not found", resources },
      { status: 400 }
    );
  }

  // Step 3: Store in Firestore 
  await db
    .collection("users")
    .doc(state as string)
    .set(
      {
        jira: {
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          cloudId,
          expiresAt: Date.now() + tokenData.expires_in * 1000,
          scope: tokenData.scope,
          connected: true,
        },
      },
      { merge: true }
    );

  return NextResponse.redirect("https://niyam-ai-web.vercel.app/");
}
