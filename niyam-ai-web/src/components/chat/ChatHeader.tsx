import { Bot } from "lucide-react";
import JiraAuth from "../jira-auth/JiraAuth";
import { useChatContext } from "@/components/chat/ChatProvider";
import { Badge } from "../ui/badge";
import { SessionSelector } from "./SessionSelector";
import JiraProjectList from "./JiraProjectList";

/**
 * ChatHeader - User and session management interface
 * Extracted from ChatMessagesView header section
 * Handles user ID input and session selection
 */
const ChatHeader = () => {
  const {
    userId,
    sessionId,
    connected,
    handleSessionSwitch,
    handleCreateNewSession,
  } = useChatContext();

  return (
    <div className="relative z-10 shrink-0 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex justify-between items-center p-6">
        {/* Left side - App branding */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-linear-to-br from-[hsl(142_76%_45%)] to-[hsl(142_76%_35%)] rounded-full flex items-center justify-center shadow-md">
            <Bot className="h-4 w-4 text-[hsl(220_25%_10%)]" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Niyam AI</h1>
            <p className="text-xs text-muted-foreground">
              Powered by Google Gemini
            </p>
          </div>
        </div>

        {/* Right side - User + Session controls */}
        <div className="flex justify-evenly items-center gap-4">
          {userId && connected && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">User:</span>
                <Badge
                  variant="secondary"
                  className="px-3 py-1 font-semibold text-sm tracking-tight bg-muted text-foreground border border-border hover:bg-muted/80 transition-colors duration-200"
                >
                  {userId || "Unknown"}
                </Badge>
              </div>

              <SessionSelector
                currentUserId={userId}
                currentSessionId={sessionId}
                onSessionSelect={handleSessionSwitch}
                onCreateSession={handleCreateNewSession}
                className="text-xs text-foreground"
              />

              <JiraProjectList />
            </>
          )}

          <JiraAuth />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
