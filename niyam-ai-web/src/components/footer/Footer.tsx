import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-slate-600 bg-slate-950/40 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-200 text-sm">
            © {new Date().getFullYear()} Niyam AI. Powered by Google Gemini.
          </div>
          <nav className="flex flex-wrap gap-6 text-sm">
            <Link
              href="/privacy-policy"
              className="text-slate-200 hover:text-primary transition- hover:cursor-pointer"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-slate-200 hover:text-primary transition- hover:cursor-pointer"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="text-slate-200 hover:text-primary transition- hover:cursor-pointer"
            >
              Cookie Policy
            </Link>
            <Link
              href="/data-deletion"
              className="text-slate-200 hover:text-primary transition- hover:cursor-pointer"
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
