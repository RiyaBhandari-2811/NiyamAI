"use client";

import BackendHealthChecker from "@/components/health-check/BackendHealthChecker";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatContent from "@/components/chat/ChatContent";
import ChatInput from "@/components/chat/ChatInput";
import Footer from "../footer/Footer";

/**
 * ChatLayout - Pure layout component for chat interface
 * Handles only UI structure and layout, no business logic
 * Uses context for all state management
 */
export function ChatContainer(): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground relative overflow-hidden">
      <BackendHealthChecker>
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-slate-950/40 pointer-events-none -z-10"></div>

        {/* Sticky Header */}
        <header className="sticky top-0 z-20 bg-slate-950/60 border-b border-border backdrop-blur-sm">
          <ChatHeader />
        </header>

        {/* Unified scroll area for content + input + footer */}
        <main className="flex-1 overflow-y-auto bg-slate-950/30 px-4 py-4 space-y-8">
          {/* Chat messages */}
          <section id="chat-section">
            <ChatContent />
          </section>

          {/* Chat input area */}
          <section id="input-section">
            <ChatInput />
          </section>

          {/* Footer (e.g. tips, metadata, status) */}
          <footer
            id="footer-section"
            className="border-t border-border bg-popover"
          >
            <Footer />
          </footer>
        </main>
      </BackendHealthChecker>
    </div>
  );
}
