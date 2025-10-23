import { useState, useCallback, useEffect } from "react";

export interface UseSessionReturn {
  // State
  sessionId: string;
  userId: string | null;
  connected: boolean;

  // User ID management
  handleUserIdChange: (userId: string) => Promise<void>;
  handleUserIdConfirm: (userId: string) => Promise<void>;

  // Session management
  handleSessionSwitch: (newSessionId: string) => void;
  handleCreateNewSession: (sessionUserId: string) => Promise<void>;
}

/**
 * Custom hook for managing chat sessions and user ID (no localStorage persistence)
 */
export function useSession(): UseSessionReturn {
  const [sessionId, setSessionId] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);

  // Handle session switching
  const handleSessionSwitch = useCallback(
    (newSessionId: string): void => {
      console.log(
        `🔄 handleSessionSwitch called: current=${sessionId}, new=${newSessionId}, userId=${userId}`
      );

      if (!userId || newSessionId === sessionId) {
        console.log(`⏭️ Skipping session switch: no userId or same session`);
        return;
      }

      // Switch to new session
      console.log(`🎯 Setting sessionId state to: ${newSessionId}`);
      setSessionId(newSessionId);

      console.log(`✅ Session switch completed to: ${newSessionId}`);
    },
    [userId, sessionId]
  );

  // Handle new session creation
  const handleCreateNewSession = useCallback(
    async (sessionUserId: string): Promise<void> => {
      // if (!sessionUserId) {
      //   throw new Error("User ID is required to create a session");
      // }
      // let actualSessionId = "";
      // try {
      //   // Import Server Action dynamically to avoid circular dependencies in hooks
      //   const { createSessionAction } = await import(
      //     "@/lib/actions/session-actions"
      //   );
      //   const sessionResult = await createSessionAction(sessionUserId);
      //   if (sessionResult.success) {
      //     // Use the session ID returned by the backend
      //     if (!sessionResult.sessionId) {
      //       throw new Error(
      //         "Session creation succeeded but no session ID was returned"
      //       );
      //     }
      //     actualSessionId = sessionResult.sessionId;
      //     console.log(
      //       `✅ Session created via Server Action: ${actualSessionId}`
      //     );
      //     console.log(`📝 Session result:`, sessionResult);
      //   } else {
      //     console.error(
      //       "❌ Session creation Server Action failed:",
      //       sessionResult.error
      //     );
      //     throw new Error(`Session creation failed: ${sessionResult.error}`);
      //   }
      // } catch (error) {
      //   console.error("❌ Session creation Server Action error:", error);
      //   throw error;
      // }
      // console.log(`🔄 Switching to new session: ${actualSessionId}`);
      // handleSessionSwitch(actualSessionId);
    },
    [handleSessionSwitch]
  );

  // Handle user ID changes
  const handleUserIdChange = useCallback(
    async (userId: string): Promise<void> => {
      try {
        if (!userId) return;

        // Step 1: Call the API to remove user data from Firestore
        const res = await fetch("/api/auth/jira-disconnect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!res.ok) {
          console.error("Failed to disconnect Jira:", res.statusText);
          return;
        }

        const data: { success: boolean; error?: string } = await res.json();

        if (data.success) {
          // Step 2: Remove from localStorage
          localStorage.removeItem("agent-engine-user-id");

          // Step 3: Update local state
          setConnected(false);
          setUserId(null);
        } else {
          console.error(
            "Jira disconnect failed:",
            data.error || "Unknown error"
          );
        }
      } catch (error) {
        console.error("Unexpected error during Jira disconnect:", error);
      }
    },
    [setConnected, setUserId]
  );

  // Handle user ID confirmation
  const handleUserIdConfirm = useCallback(
    async (userId: string): Promise<void> => {
      try {
        if (!userId) return;

        const res = await fetch(
          `/api/auth/jira-status?userId=${encodeURIComponent(userId)}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!res.ok) {
          console.error("Failed to fetch Jira status:", res.statusText);
          setConnected(false);
          return;
        }

        const data: { connected: boolean; error?: string } = await res.json();

        if (typeof data.connected === "boolean") {
          console.log("data.connected: ", data.connected);
          setConnected(data.connected);
        } else {
          console.error(
            "Invalid response format from /api/auth/jira-status:",
            data
          );
          setConnected(false);
        }
      } catch (error) {
        console.error("Error checking Jira connection status:", error);
        setConnected(false);
      }
    },
    [setConnected]
  );

  // Load user ID from localStorage on mount (but no session persistence)
  useEffect(() => {
    console.log("useSession: mounting - loading userId from localStorage");
    try {
      let id = localStorage.getItem("agent-engine-user-id");
      if (id) {
        console.log(`useSession: found existing userId: ${id}`);
      } else {
        // Fallback if crypto.randomUUID is not available
        id = crypto.randomUUID();

        console.log(`useSession: generated new userId: ${id}`);
      }

      localStorage.setItem("agent-engine-user-id", id);
      console.log("useSession: stored userId in localStorage");

      setUserId(id);
      console.log(`useSession: set userId state to: ${id}`);
    } catch (error) {
      console.error(
        "useSession: error accessing localStorage or generating UUID:",
        error
      );
    }
  }, []);

  return {
    // State
    sessionId,
    userId,
    connected,

    // User ID management
    handleUserIdChange,
    handleUserIdConfirm,

    // Session management
    handleSessionSwitch,
    handleCreateNewSession,
  };
}
