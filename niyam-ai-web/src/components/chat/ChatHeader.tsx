import { Bot } from "lucide-react";
import JiraAuth from "../jira-auth/JiraAuth";
import { useChatContext } from "@/components/chat/ChatProvider";
import { Badge } from "../ui/badge";

/**
 * ChatHeader - User and session management interface
 * Extracted from ChatMessagesView header section
 * Handles user ID input and session selection
 */
const ChatHeader = () => {
  const {
    userId,
    sessionId,
    handleUserIdChange,
    handleUserIdConfirm,
    handleSessionSwitch,
    handleCreateNewSession,
  } = useChatContext();

  return (
    <div className="relative z-10 flex-shrink-0 border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto w-full flex justify-between items-center p-4">
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

        <div className="flex justify-evenly items-center border-2 border-amber-200 gap-2">
          {userId && (
            <>
              <span className="text-lg font-bold text-slate-500">User:</span>
              <Badge
                variant="secondary"
                className="font-bold text-sm -tracking-tight bg-slate-700/50 text-slate-200 border-slate-600/50 hover:bg-slate-600/50"
              >
                {userId}
              </Badge>
            </>
          )}

          {/* Session Management */}
          {/* {userId && (
            <SessionSelector
              currentUserId={userId}
              currentSessionId={sessionId}
              onSessionSelect={handleSessionSwitch}
              onCreateSession={handleCreateNewSession}
              className="text-xs"
            />
          )} */}
          {/* </div> */}

          <JiraAuth />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
