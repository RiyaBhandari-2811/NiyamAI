import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Scrollable Content */}
      <ScrollArea className="h-[calc(100vh-73px)]">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <p>
                <strong>Effective Date:</strong>{" "}
                {new Date().toLocaleDateString("en-GB")}
              </p>
              <p>
                We respect your privacy and are committed to protecting your
                personal information. This Privacy Policy explains how we
                collect, use, and protect your data when you use our product
                (“Service”).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                1. Information We Collect
              </h2>
              <ul className="list-disc ml-5 space-y-1">
                <li>
                  <strong>OAuth Tokens:</strong> Required to access your Jira
                  workspace securely.
                </li>
                <li>
                  <strong>User Metadata:</strong> Jira account ID or email (if
                  provided by Atlassian during OAuth).
                </li>
                <li>
                  <strong>PRD Content:</strong> Uploaded PDFs, text, or links
                  are processed temporarily to generate Jira tickets. We do not
                  permanently store or retain this data.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                2. How We Use Your Information
              </h2>
              <ul className="list-disc ml-5 space-y-1">
                <li>Authenticate with Jira via OAuth 2.0.</li>
                <li>Generate AI-assisted Jira tickets from uploaded PRDs.</li>
                <li>Maintain session continuity and account connectivity.</li>
              </ul>
              <p>
                We do not sell, rent, or share your data with any third-party
                marketing or analytics providers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Data Security</h2>
              <ul className="list-disc ml-5 space-y-1">
                <li>
                  Your OAuth tokens are encrypted using AES-256 before being
                  stored in Google Cloud Firestore.
                </li>
                <li>Decrypted only in memory during active Jira operations.</li>
                <li>Permanently deleted upon disconnect.</li>
              </ul>
              <p>
                All services are hosted in Google Cloud (GCP) which is ISO/IEC
                27001, SOC 2, and GDPR compliant.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                4. Data Retention & Deletion
              </h2>
              <p>
                We only retain data as long as your Jira account is connected.
                When you disconnect your account, all stored tokens and user
                data are permanently deleted within 24 hours.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">
                5. Your Rights (under GDPR)
              </h2>
              <ul className="list-disc ml-5 space-y-1">
                <li>Request access to your stored data.</li>
                <li>Request correction or deletion.</li>
                <li>
                  Withdraw consent at any time by disconnecting your Jira
                  account.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Contact</h2>
              <p>
                For data or privacy inquiries, contact:
                <br />
                <strong>Email:</strong> privacy@niyamai.com
                <br />
                <strong>Address:</strong> Niyam AI, Pune, India
              </p>
            </section>

            <p className="text-sm italic pt-8 border-t">
              Last Updated: October 29, 2025
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
