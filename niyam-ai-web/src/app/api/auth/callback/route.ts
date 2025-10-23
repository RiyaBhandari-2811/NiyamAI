import { db } from "@/config/firebaseAdmin";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      return NextResponse.json(
        { error: "Missing code or state" },
        { status: 400 }
      );
    }

    // Step 1: Exchange code for tokens
    const tokenResponse = await fetch(
      "https://auth.atlassian.com/oauth/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "authorization_code",
          client_id: process.env.NEXT_PUBLIC_ATLASSIAN_CLIENT_ID,
          client_secret: process.env.ATLASSIAN_CLIENT_SECRET,
          code,
          redirect_uri: "https://niyam-ai-web.vercel.app/api/auth/callback",
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (
      !tokenResponse.ok ||
      !tokenData.access_token ||
      !tokenData.refresh_token
    ) {
      console.error("Token exchange failed:", tokenData);
      return NextResponse.json(
        { success: false, error: "Token exchange failed", details: tokenData },
        { status: 400 }
      );
    }

    // Step 2: Fetch Cloud ID
    const resourceResponse = await fetch(
      "https://api.atlassian.com/oauth/token/accessible-resources",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    );

    const resources = await resourceResponse.json();
    const cloudId = resources[0]?.id;

    if (!resourceResponse.ok || !cloudId) {
      console.error("Cloud ID not found:", resources);
      return NextResponse.json(
        { success: false, error: "Cloud ID not found", details: resources },
        { status: 400 }
      );
    }

    // Step 3: Store in Firestore
    await db
      .collection("users")
      .doc(state)
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

    // Step 4: Redirect on success
    return NextResponse.redirect(
      "https://niyam-ai-web.vercel.app/integrations?status=success"
    );
  } catch (error) {
    console.error("OAuth callback error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
