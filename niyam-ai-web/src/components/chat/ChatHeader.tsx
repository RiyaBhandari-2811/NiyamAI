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
    <div className="relative z-10 flex-shrink-0 border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
      <div className="flex justify-between items-center p-6">
        {/* Left side - App branding */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-100">Niyam AI</h1>
            <p className="text-xs text-slate-400">Powered by Google Gemini</p>
          </div>
        </div>

        <div className="flex justify-evenly items-center  gap-4">
          {userId && connected && (
            <>
              <span className="text-sm text-slate-400">User:</span>
              <Badge
                variant="secondary"
                className="p-2 font-bold text-sm -tracking-tight bg-slate-700/50 text-slate-200 border-slate-600/50 hover:bg-slate-600/50"
              >
                {userId}
              </Badge>
              <SessionSelector
                currentUserId={userId}
                currentSessionId={sessionId}
                onSessionSelect={handleSessionSwitch}
                onCreateSession={handleCreateNewSession}
                className="text-xs"
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
