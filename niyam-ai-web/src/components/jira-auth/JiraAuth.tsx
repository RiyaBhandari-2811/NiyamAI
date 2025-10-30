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
    if (consent === "granted") {
      setShowConsent(false);
    }
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

  // Handle Jira Connect with consent check
  const handleConnect = () => {
    if (!userId) {
      console.warn("User ID missing. Cannot start Jira auth.");
      return;
    }

    const consent = localStorage.getItem("jira_consent");
    if (consent === "granted") {
      startOAuth();
    } else {
      setShowConsent(true);
    }
  };

  const startOAuth = () => {
    const authUrl = getJiraAuthUrl(userId as string);
    if (!authUrl) return;

    setLoading(true);
    window.location.href = authUrl;
  };

  // Handle disconnect Jira
  const handleDisconnect = () => {
    handleUserIdChange(userId as string);
    localStorage.removeItem("jira_consent");
  };

  // Handle consent acceptance
  const handleAcceptConsent = () => {
    localStorage.setItem("jira_consent", "granted");
    setShowConsent(false);
    startOAuth();
  };

  useEffect(() => {
    if (userId && !connected) {
      handleUserIdConfirm(userId);
    }
  }, [userId, connected]);

  return (
    <>
      <div className="flex justify-center items-center">
        <Button
          disabled={loading || !userId}
          onClick={connected ? handleDisconnect : handleConnect}
          className={`relative flex items-center justify-center gap-2 w-fit min-w-[180px] h-11 rounded-xl font-medium transition-all duration-300 hover:cursor-pointer
            ${
              connected
                ? "bg-linear-to-br` from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-md shadow-red-900/20"
                : "bg-linear-to-br` from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 shadow-md shadow-emerald-900/20"
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

      {/* Privacy Policy Consent Modal */}
      <Dialog open={showConsent} onOpenChange={setShowConsent}>
        <DialogContent className="max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-3">
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                <strong>Effective Date:</strong> {new Date().toLocaleDateString('en-GB')}
              </p>

              <p>
                We respect your privacy and are committed to protecting your
                personal information. This Privacy Policy explains how we
                collect, use, and protect your data when you use our product
                (“Service”).
              </p>

              <h3 className="text-foreground font-semibold mt-4">
                1. Information We Collect
              </h3>
              <p>
                We collect and store only what is necessary to provide Jira
                integration and AI-based ticket automation:
              </p>
              <ul className="list-disc ml-5 space-y-1">
                <li>
                  OAuth Tokens: Required to access your Jira workspace securely.
                </li>
                <li>
                  User Metadata: Jira account ID or email (if provided by
                  Atlassian during OAuth).
                </li>
                <li>
                  PRD Content: Uploaded PDFs, text, or links are processed
                  temporarily to generate Jira tickets. We do not permanently
                  store or retain this data.
                </li>
              </ul>

              <h3 className="text-foreground font-semibold mt-4">
                2. How We Use Your Information
              </h3>
              <ul className="list-disc ml-5 space-y-1">
                <li>Authenticate with Jira via OAuth 2.0.</li>
                <li>Generate AI-assisted Jira tickets from uploaded PRDs.</li>
                <li>Maintain session continuity and account connectivity.</li>
              </ul>
              <p>
                We do not sell, rent, or share your data with any third-party
                marketing or analytics providers.
              </p>

              <h3 className="text-foreground font-semibold mt-4">
                3. Data Security
              </h3>
              <p>Your OAuth tokens are:</p>
              <ul className="list-disc ml-5 space-y-1">
                <li>
                  Encrypted using AES-256 encryption before being stored in
                  Google Cloud Firestore.
                </li>
                <li>Decrypted only in memory during active Jira operations.</li>
                <li>Permanently deleted upon disconnect.</li>
              </ul>
              <p>
                All services are hosted in Google Cloud (GCP) which is ISO/IEC
                27001, SOC 2, and GDPR compliant.
              </p>

              <h3 className="text-foreground font-semibold mt-4">
                4. Data Retention & Deletion
              </h3>
              <p>
                We only retain data as long as your Jira account is connected.
                When you disconnect your account, all stored tokens and user
                data are permanently deleted within 24 hours.
              </p>

              <h3 className="text-foreground font-semibold mt-4">
                5. Your Rights (under GDPR)
              </h3>
              <ul className="list-disc ml-5 space-y-1">
                <li>Request access to your stored data.</li>
                <li>Request correction or deletion.</li>
                <li>Withdraw consent at any time by disconnecting Jira.</li>
              </ul>

              <h3 className="text-foreground font-semibold mt-4">6. Contact</h3>
              <p>
                For data or privacy inquiries, contact:
                <br />
                <strong>Email:</strong> privacy@[niyamai].com
                <br />
                <strong>Address:</strong> [Niyam-ai, Pune, India]
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
