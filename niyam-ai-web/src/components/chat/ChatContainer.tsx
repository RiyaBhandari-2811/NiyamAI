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
    <div className="min-h-screen flex flex-col bg-background text-foreground relative">
      <BackendHealthChecker>
        {/* Background */}
        <div className="absolute bg-slate-950/40 pointer-events-none"></div>

        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-slate-950/40 border-b border-border">
          <ChatHeader />
        </div>

        {/* Center ChatContent vertically and horizontally */}
        <div className="relative z-10 flex flex-col grow  bg-slate-950/40">
          <div className="grow">
            <ChatContent />
          </div>

          {/* Chat Input at bottom */}
          <div className="shrink-0 bg-slate-950/40">
            <ChatInput />
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 bg-popover border-t border-border">
          <Footer />
        </div>
      </BackendHealthChecker>
    </div>
  );
}
