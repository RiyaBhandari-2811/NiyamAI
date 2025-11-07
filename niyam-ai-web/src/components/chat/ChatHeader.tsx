import { Bot } from "lucide-react";
import JiraAuth from "../jira-auth/JiraAuth";
import { useChatContext } from "@/components/chat/ChatProvider";
import { Badge } from "../ui/badge";
import { SessionSelector } from "./SessionSelector";
import JiraProjectList from "./JiraProjectList";

/**
 * ChatHeader - Clean, responsive header with no overlapping
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
    <header className="relative z-10 shrink-0 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="flex flex-wrap justify-between items-center gap-4 px-6 py-4">
        {/* Left side - Branding */}
        <div className="flex items-center gap-3 min-w-[180px]">
          <div className="w-8 h-8 bg-linear-to-br from-[hsl(142_76%_45%)] to-[hsl(142_76%_35%)] rounded-full flex items-center justify-center shadow-md">
            <Bot className="h-4 w-4 text-[hsl(220_25%_10%)]" />
          </div>
          <div className="truncate">
            <h1 className="text-lg font-semibold text-foreground truncate">
              Niyam AI
            </h1>
            <p className="text-xs text-muted-foreground">
              Powered by Google Gemini
            </p>
          </div>
        </div>

        {/* Right side - Controls */}
        <div className="flex flex-wrap items-center justify-end gap-3 sm:gap-4 flex-1 min-w-0">
          {userId && connected && (
            <>
              {/* User ID */}
              <div className="flex items-center gap-2 min-w-[200px] max-w-[350px]">
                <span className="text-sm text-muted-foreground shrink-0">
                  User:
                </span>
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent rounded-full max-w-[280px]">
                  <Badge
                    variant="secondary"
                    className="whitespace-nowrap px-3 py-1 font-medium bg-muted text-foreground border border-border w-max"
                    title={userId}
                  >
                    {userId}
                  </Badge>
                </div>
              </div>

              {/* Session Selector */}
              <div className="flex-shrink-0">
                <SessionSelector
                  currentUserId={userId}
                  currentSessionId={sessionId}
                  onSessionSelect={handleSessionSwitch}
                  onCreateSession={handleCreateNewSession}
                  className="text-xs text-foreground"
                />
              </div>

              {/* Project List */}
              <div className="flex-shrink-0">
                <JiraProjectList />
              </div>
            </>
          )}

          {/* Jira Auth Button */}
          <div className="flex-shrink-0">
            <JiraAuth />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;
