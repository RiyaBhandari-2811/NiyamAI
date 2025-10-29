import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Niyam AI’s healthcare test case generator, you agree to these terms.
                If you do not agree, please discontinue use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p>
                Niyam AI provides an AI-powered platform for generating healthcare test cases based on PRDs,
                with document analysis, automated scenario generation, and Jira integration.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete registration details</li>
                <li>Maintain your account security</li>
                <li>Report any unauthorized access immediately</li>
                <li>You are responsible for activity under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>No illegal activities or misuse</li>
                <li>No unauthorized system access</li>
                <li>No malicious or harmful uploads</li>
                <li>No sharing credentials or reverse engineering</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
              <p>
                You retain ownership of your uploaded documents. The generated test cases are yours, but
                Niyam AI’s platform and AI models remain our intellectual property.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Data Usage and Privacy</h2>
              <p>
                Your data is processed in compliance with our Privacy Policy and relevant data protection
                laws such as GDPR and HIPAA.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Service Availability</h2>
              <p>
                We aim for consistent uptime but do not guarantee uninterrupted access. Service may be
                modified or discontinued with or without notice.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
              <p>
                Niyam AI shall not be liable for indirect, special, or consequential damages. Our liability
                is capped at the amount you paid in the past 12 months.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
              <p>
                Accounts may be terminated for violations or misuse. You may also close your account anytime.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Changes to Terms</h2>
              <p>
                We may update terms periodically. Continued usage implies acceptance of revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Governing Law</h2>
              <p>These terms are governed by applicable Indian laws.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
              <p>For legal queries, contact: <span className="text-primary">legal@niyamai.com</span></p>
            </section>

            <p className="text-sm italic pt-8 border-t">Last Updated: October 29, 2025</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
