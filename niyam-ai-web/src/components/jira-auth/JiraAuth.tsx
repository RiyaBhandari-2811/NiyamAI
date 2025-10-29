"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useChatContext } from "../chat/ChatProvider";
import { Loader2 } from "lucide-react";

const JiraAuth = () => {
  const { userId, connected, handleUserIdChange, handleUserIdConfirm } =
    useChatContext();
  const [loading, setLoading] = useState(false);

  // Construct Jira Auth URL
  const getJiraAuthUrl = (userId: string) => {
    const clientId = process.env.NEXT_PUBLIC_ATLASSIAN_CLIENT_ID;
    if (!clientId) {
      console.error("Missing NEXT_PUBLIC_ATLASSIAN_CLIENT_ID");
      return "";
    }

    const redirectUri =
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/auth/callback"
        : "https://niyam-ai-web.vercel.app/api/auth/callback";

    const scope = [
      "offline_access",
      "read:jira-work",
      "manage:jira-project",
      "manage:jira-configuration",
      "read:jira-user",
      "write:jira-work",
    ].join(" ");

    const params = new URLSearchParams({
      audience: "api.atlassian.com",
      client_id: clientId,
      scope,
      redirect_uri: redirectUri,
      state: userId,
      response_type: "code",
      prompt: "consent",
    });

    return `https://auth.atlassian.com/authorize?${params.toString()}`;
  };

  // Handle Jira Connect
  const handleConnect = () => {
    if (!userId) {
      console.warn("User ID missing. Cannot start Jira auth.");
      return;
    }

    const authUrl = getJiraAuthUrl(userId);
    if (!authUrl) return;

    setLoading(true);
    window.location.href = authUrl;
  };

  // Check for connection status when userId changes
  useEffect(() => {
    if (userId && !connected) {
      console.log("Checking for connected status...");
      handleUserIdConfirm(userId);
    }
  }, [userId, connected]);

  return (
    <div className="flex justify-center items-center">
      <Button
        disabled={loading || !userId}
        onClick={
          connected ? () => handleUserIdChange(userId as string) : handleConnect
        }
        className={`relative flex items-center justify-center gap-2 w-fit min-w-[180px] h-11 rounded-xl font-medium transition-all duration-300
          ${
            connected
              ? "bg-gradient-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md shadow-red-900/20"
              : "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-md shadow-emerald-900/20"
          }
          ${loading || !userId ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Connecting...</span>
          </>
        ) : connected ? (
          "Disconnect JIRA"
        ) : (
          "Connect JIRA"
        )}
      </Button>
    </div>
  );
};

export default JiraAuth;
