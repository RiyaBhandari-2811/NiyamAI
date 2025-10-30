import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function CookiesPage() {
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
          <h1 className="text-4xl font-bold mb-6">Cookie & Consent Policy</h1>

          <div className="space-y-8 text-muted-foreground leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
              <p>
                Cookies are small text files stored on your device to improve usability and remember preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Types of Cookies We Use</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Essential Cookies – site functionality</li>
                <li>Performance Cookies – analytics and metrics</li>
                <li>Functional Cookies – personalization</li>
                <li>Analytics Cookies – insights on user behavior</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Local Storage</h2>
              <p>
                We use browser local storage for temporary session data. It remains local and is not shared with third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Consent</h2>
              <p>
                By using our service, you consent to essential cookies. You can manage or withdraw consent anytime.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Managing Cookies</h2>
              <p>You can manage cookies in your browser settings or clear them manually.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Third-Party Cookies</h2>
              <p>
                Some tools like Google Gemini AI may use their own cookies. Review their policies for details.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. GDPR Compliance</h2>
              <p>We comply with GDPR’s cookie consent requirements.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Updates</h2>
              <p>We may update this policy periodically. Check back for changes.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contact</h2>
              <p>
                For cookie-related questions, contact: <span className="text-primary">cookies@niyamai.com</span>
              </p>
            </section>

            <p className="text-sm italic pt-8 border-t">Last Updated: October 29, 2025</p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
