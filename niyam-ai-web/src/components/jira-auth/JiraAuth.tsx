"use client";

import { Button } from "../ui/button";
import { useChatContext } from "../chat/ChatProvider";
import { useEffect } from "react";

const JiraAuth = () => {
  const { userId, connected, handleUserIdChange, handleUserIdConfirm } =
    useChatContext();

  const handleConnect = () => {
    if (!userId) return;

    const clientId = process.env.NEXT_PUBLIC_ATLASSIAN_CLIENT_ID;
    const redirectUri = "https://niyam-ai-web.vercel.app/api/auth/callback";
    const state = userId;

    const jiraAuthUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${clientId}&scope=offline_access%20read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20read%3Ajira-user%20write%3Ajira-work&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${state}&response_type=code&prompt=consent`;

    window.location.href = jiraAuthUrl;
  };

  // check for the status of connected
  useEffect(() => {
    if (userId && !connected) {
      console.log("Checking for connected status");
      handleUserIdConfirm(userId);
    }
  }, [userId]);

  return (
    <div>
      <Button
        variant={"secondary"}
        className="hover:bg-secondary-foreground hover:text-secondary cursor-pointer transition-all duration-300"
        onClick={
          connected ? () => handleUserIdChange(userId as string) : handleConnect
        }
      >
        {connected ? "Disconnect" : "Connect"} JIRA
      </Button>
    </div>
  );
};

export default JiraAuth;
