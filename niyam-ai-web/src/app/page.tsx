// "use client";

// import { useEffect, useState } from "react";

// export default function Home() {
//   const [connected, setConnected] = useState(false);
//   const [userId, setUserId] = useState<string | null>(null);

//   // Get userId from localStorage on client
//   useEffect(() => {
//     let id = localStorage.getItem("userId");
//     if(id === null){
//       id = crypto.randomUUID();
//     }
//     localStorage.setItem("userId", id);
//     setUserId(id);
//   }, []);

//   // Check connection status once userId is loaded
//   useEffect(() => {
//     if (!userId) return;
//     fetch(`/api/auth/jira-status?userId=${userId}`)
//       .then(res => res.json())
//       .then(data => setConnected(data.connected))
//       .catch(console.error);
//   }, [userId]);

//   const handleConnect = () => {
//      console.log(userId);
//     if (!userId) return;

//     const clientId = process.env.NEXT_PUBLIC_ATLASSIAN_CLIENT_ID;
//     const redirectUri = "https://niyam-ai-web.vercel.app/api/auth/callback";
//     const state = userId; // reuse frontend UUID

//     const jiraAuthUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${clientId}&scope=offline_access%20read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20read%3Ajira-user%20write%3Ajira-work&redirect_uri=${encodeURIComponent(
//       redirectUri
//     )}&state=${state}&response_type=code&prompt=consent`;

//     window.location.href = jiraAuthUrl;
//   };

//   const handleDisconnect = async () => {
//     if (!userId) return;

//     const res = await fetch("/api/auth/jira-disconnect", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userId }),
//     });
//     const data = await res.json();
//     if (data.success) setConnected(false);
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen">
//       {connected ? (
//         <button
//           className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-red-600 text-white gap-2 hover:bg-red-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//           onClick={handleDisconnect}
//         >
//           Disconnect JIRA
//         </button>
//       ) : (
//         <button
//           className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//           onClick={handleConnect}
//         >
//           Connect to JIRA
//         </button>
//       )}
//     </div>
//   );
// }

import { Suspense } from "react";
import ChatProvider from "@/components/chat/ChatProvider";
import { ChatContainer } from "@/components/chat/ChatContainer";

export default function HomePage(): React.JSX.Element {
  return (
    <div className="flex flex-col h-screen">
      <Suspense fallback={<div>Loading chat...</div>}>
        <ChatProvider>
          <ChatContainer />
        </ChatProvider>
      </Suspense>
    </div>
  );
}
