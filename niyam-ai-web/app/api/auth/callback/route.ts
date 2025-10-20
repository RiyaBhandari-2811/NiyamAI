import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  // Step 1: Exchange code for access token
  const tokenResponse = await fetch("https://auth.atlassian.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "authorization_code",
      client_id: process.env.NEXT_PUBLIC_ATLASSIAN_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_ATLASSIAN_CLIENT_SECRET,
      code,
      redirect_uri: "https://niyam-ai-web.vercel.app/api/auth/callback",
    }),
  });

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  if (!accessToken) {
    return NextResponse.json({ error: "Token exchange failed", details: tokenData }, { status: 400 });
  }

  // Step 2: Fetch Cloud ID using the access token (this is where that code goes)
  const res = await fetch("https://api.atlassian.com/oauth/token/accessible-resources", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const resources = await res.json();
  const cloudId = resources[0]?.id;

  if (!cloudId) {
    return NextResponse.json({ error: "Cloud ID not found", resources }, { status: 400 });
  }

  // Step 3: (Optional) Store accessToken + cloudId in your DB/session
  console.log("Access Token:", accessToken);
  console.log("Cloud ID:", cloudId);

  // Step 4: Redirect user or show success
  return NextResponse.redirect("/");
}
