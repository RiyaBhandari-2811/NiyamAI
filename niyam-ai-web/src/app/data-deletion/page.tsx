import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-background">
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

      <ScrollArea className="h-[calc(100vh-73px)]">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-bold mb-6">Data Deletion & Disconnect Policy</h1>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Your Right to Erasure</h2>
              <p>
                Under GDPR Article 17, you can request deletion of your personal data. We ensure a transparent process for this.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. What Data Can Be Deleted</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Account and profile data</li>
                <li>Uploaded documents and files</li>
                <li>Generated test cases</li>
                <li>Integration and activity logs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. How to Request Deletion</h2>
              <p>
                Delete via Account Settings, email <span className="text-primary">privacy@niyamai.com</span>, or raise a support ticket.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Third-Party Disconnection</h2>
              <p>
                Go to Settings → Integrations → “Disconnect” to revoke third-party access (e.g., Jira).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Data Retention After Deletion</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Removed from active systems within 7 days</li>
                <li>Backups purged within 30 days</li>
                <li>Some data retained for compliance (up to 6 years)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Exceptions</h2>
              <p>
                Data may be retained if required by law, investigation, or fraud prevention.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Verification</h2>
              <p>We may verify your identity before processing deletion requests.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Data Portability</h2>
              <p>
                Request your data export via <span className="text-primary">export@niyamai.com</span> before deletion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Reactivation</h2>
              <p>
                Deleted accounts cannot be restored. You may register again after deletion.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
              <ul className="list-none space-y-2 ml-4">
                <li>Email: <span className="text-primary">privacy@niyamai.com</span></li>
                <li>DPO: <span className="text-primary">dpo@niyamai.com</span></li>
              </ul>
            </section>

            <p className="text-sm italic pt-8 border-t">Last Updated: October 29, 2025</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
