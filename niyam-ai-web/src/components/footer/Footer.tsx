import Link from "next/link";

interface FooterProps {
  onPrivacyClick: () => void;
}

const Footer = ({ onPrivacyClick }: FooterProps) => {
  return (
    <footer className="border-t border-slate-600 bg-slate-950/40 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-200 text-sm">
            © {new Date().getFullYear()} Niyam AI. Powered by Google Gemini.
          </div>
          <nav className="flex flex-wrap gap-6 text-sm">
            <button
              onClick={onPrivacyClick}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy Policy
            </button>
            <Link
              href="/terms"
              className="text-slate-200 hover:text-primary transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-slate-200 hover:text-primary transition-colors"
            >
              Cookie Policy
            </Link>
            <Link
              href="/data-deletion"
              className="text-slate-200 hover:text-primary transition-colors"
            >
              Data Deletion
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
