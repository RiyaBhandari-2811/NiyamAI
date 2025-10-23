import { Bot } from "lucide-react";
import JiraAuth from "../jira-auth/JiraAuth";

const ChatHeader = () => {
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

        <JiraAuth />
                
        {/* Right side - User controls */}
        {/* <div className="flex items-center gap-4"> */}
          {/* User ID Management */}
          {/* <UserIdInput
            currentUserId={userId}
            onUserIdChange={handleUserIdChange}
            onUserIdConfirm={handleUserIdConfirm}
            className="text-xs"
          /> */}

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
      </div>
    </div>
  );
};

export default ChatHeader;
