"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { useChatContext } from "../chat/ChatProvider";

const JiraAuth = () => {
  const { userId, connected, handleUserIdChange, handleUserIdConfirm } =
    useChatContext();

  const [loading, setLoading] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  // Check if consent already exists
  useEffect(() => {
    const consent = localStorage.getItem("jira_consent");
    if (consent === "granted") setShowConsent(false);
  }, []);

  // Construct Jira Auth URL
  const getJiraAuthUrl = (userId: string) => {
    const clientId = process.env.NEXT_PUBLIC_ATLASSIAN_CLIENT_ID;
    if (!clientId) {
      console.error("Missing NEXT_PUBLIC_ATLASSIAN_CLIENT_ID");
      return "";
    }

    const redirectUri = "https://niyam-ai-web.vercel.app/api/auth/callback";

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

  const handleConnect = () => {
    if (!userId) {
      console.warn("User ID missing. Cannot start Jira auth.");
      return;
    }

    const consent = localStorage.getItem("jira_consent");
    consent === "granted" ? startOAuth() : setShowConsent(true);
  };

  const startOAuth = () => {
    const authUrl = getJiraAuthUrl(userId as string);
    if (!authUrl) return;
    setLoading(true);
    window.location.href = authUrl;
  };

  const handleDisconnect = () => {
    handleUserIdChange(userId as string);
    localStorage.removeItem("jira_consent");
  };

  const handleAcceptConsent = () => {
    localStorage.setItem("jira_consent", "granted");
    setShowConsent(false);
    startOAuth();
  };

  useEffect(() => {
    if (userId && !connected) handleUserIdConfirm(userId);
  }, [userId, connected, handleUserIdConfirm]);

  return (
    <>
      <div className="flex justify-center items-center">
        <Button
          disabled={loading || !userId}
          onClick={connected ? handleDisconnect : handleConnect}
          className={`relative flex items-center justify-center gap-2 w-auto px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:cursor-pointer
            ${
              connected
                ? "bg-linear-to-br from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md shadow-red-900/20"
                : "bg-linear-to-br from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-md shadow-emerald-900/20"
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
            "Disconnect"
          ) : (
            "Connect JIRA"
          )}
        </Button>
      </div>

      {/* Privacy Policy Consent Modal */}
      <Dialog open={showConsent} onOpenChange={setShowConsent}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
          </DialogHeader>

          <ScrollArea className="h-[60vh] pr-3">
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                <strong>Effective Date:</strong>{" "}
                {new Date().toLocaleDateString("en-GB")}
              </p>

              <p>
                We respect your privacy and are committed to protecting your
                personal information. This Privacy Policy explains how we
                collect, use, and protect your data when you use our product.
              </p>

              <h3 className="text-foreground font-semibold mt-4">
                1. Information We Collect
              </h3>
              <ul className="list-disc ml-5 space-y-1">
                <li>OAuth Tokens: Required to access your Jira workspace.</li>
                <li>
                  User Metadata: Jira account ID or email provided during OAuth.
                </li>
                <li>
                  PRD Content: Processed temporarily to generate Jira tickets.
                </li>
              </ul>

              <h3 className="text-foreground font-semibold mt-4">
                2. How We Use Your Information
              </h3>
              <ul className="list-disc ml-5 space-y-1">
                <li>Authenticate via Jira OAuth 2.0.</li>
                <li>Generate AI-assisted Jira tickets.</li>
                <li>Maintain connection state securely.</li>
              </ul>

              <h3 className="text-foreground font-semibold mt-4">
                3. Data Security
              </h3>
              <p>Your tokens are AES-256 encrypted in Firestore and deleted on disconnect.</p>

              <h3 className="text-foreground font-semibold mt-4">
                4. Data Retention & Deletion
              </h3>
              <p>
                Tokens and data are deleted within 24 hours of disconnection.
              </p>

              <h3 className="text-foreground font-semibold mt-4">5. Contact</h3>
              <p>
                <strong>Email:</strong> privacy@[niyamai].com
                <br />
                <strong>Address:</strong> Niyam AI, Pune, India
              </p>
            </div>
          </ScrollArea>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowConsent(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAcceptConsent}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              I Agree
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default JiraAuth;
