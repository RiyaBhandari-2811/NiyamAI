"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Loader2, Plus, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { fetchActiveSessionsAction } from "@/lib/actions/session-list-actions";

interface Session {
  id: string;
  userId: string;
  lastActivity: Date;
  title?: string;
  messageCount?: number;
}

interface SessionSelectorProps {
  currentUserId: string;
  currentSessionId: string;
  onSessionSelect: (sessionId: string) => void;
  onCreateSession: (userId: string) => Promise<void>;
  className?: string;
}

export function SessionSelector({
  currentUserId,
  currentSessionId,
  onSessionSelect,
  onCreateSession,
  className = "",
}: SessionSelectorProps): React.JSX.Element {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isCreatingSession, setIsCreatingSession] = useState<boolean>(false);
  const [isLoadingSessions, setIsLoadingSessions] = useState<boolean>(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  // Fetch active sessions
  const fetchActiveSessions = useCallback(
    async (userId: string) => {
      try {
        setIsLoadingSessions(true);
        setSessionError(null);

        const result = await fetchActiveSessionsAction(userId);
        if (result.success) {
          const activeSessions: Session[] = result.sessions.map((session) => ({
            id: session.id,
            userId: session.userId,
            lastActivity: session.lastUpdateTime || new Date(),
            title: session.title || `Session ${session.id.substring(0, 8)}`,
            messageCount: session.messageCount,
          }));

          activeSessions.sort(
            (a, b) => b.lastActivity.getTime() - a.lastActivity.getTime()
          );

          setSessions(activeSessions);
        } else {
          const errorMessage = result.error || "Failed to fetch sessions";
          setSessionError(errorMessage);
          setSessions([]);
          toast.error("Failed to load sessions", {
            description: errorMessage,
          });
        }
      } catch (error) {
        setSessionError("Network error while fetching sessions");
        setSessions([]);
        toast.error("Network error", {
          description:
            "Could not connect to load your sessions. Please try again.",
        });
      } finally {
        setIsLoadingSessions(false);
      }
    },
    [currentSessionId]
  );

  useEffect(() => {
    if (currentUserId) {
      fetchActiveSessions(currentUserId);
    } else {
      setSessions([]);
      setSessionError(null);
    }
  }, [currentUserId, fetchActiveSessions]);

  // Add current session if missing
  useEffect(() => {
    if (currentSessionId && currentUserId) {
      const timeoutId = setTimeout(() => {
        setSessions((prevSessions) => {
          const sessionExists = prevSessions.some(
            (s) => s.id === currentSessionId
          );
          if (!sessionExists) {
            const newSession: Session = {
              id: currentSessionId,
              userId: currentUserId,
              lastActivity: new Date(),
              title: `Session ${currentSessionId.substring(0, 8)}`,
              messageCount: 0,
            };
            return [newSession, ...prevSessions];
          }
          return prevSessions;
        });
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [currentSessionId, currentUserId]);

  const handleSessionSelect = async (value: string): Promise<void> => {
    if (value === "create-new") {
      setIsCreatingSession(true);
      try {
        await onCreateSession(currentUserId);
        setTimeout(() => fetchActiveSessions(currentUserId), 500);
      } catch {
        toast.error("Failed to create session", {
          description: "Could not create a new session. Please try again.",
        });
      } finally {
        setIsCreatingSession(false);
      }
    } else {
      onSessionSelect(value);
    }
  };

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm text-slate-400 whitespace-nowrap">
        Session List:
      </span>

      <Select value={currentSessionId} onValueChange={handleSessionSelect}>
        <SelectTrigger
          className={`
            w-52 h-11 text-sm
            bg-slate-900/70 border border-slate-700
            text-slate-100 rounded-xl
            transition-all duration-300 ease-in-out
            hover:border-emerald-500 focus:border-emerald-500
            hover:shadow-[0_0_12px_rgba(16,185,129,0.3)]
            focus:shadow-[0_0_14px_rgba(16,185,129,0.4)]
            px-4
          `}
        >
          <SelectValue
            placeholder={
              isLoadingSessions
                ? "Loading sessions..."
                : sessionError
                ? "Error loading sessions"
                : sessions.length === 0
                ? "Create your first session"
                : "Select session"
            }
          />
        </SelectTrigger>

        <SelectContent
          className={`
            bg-slate-900 border border-slate-700 
            rounded-xl shadow-lg min-w-52 backdrop-blur-md
          `}
        >
          {isLoadingSessions && (
            <div className="flex items-center gap-2 p-3 text-slate-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Loading sessions...</span>
            </div>
          )}

          {sessionError && !isLoadingSessions && (
            <div className="flex items-center gap-2 p-3 text-red-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{sessionError}</span>
            </div>
          )}

          {!isLoadingSessions && !sessionError && (
            <>
              {sessions.length > 0 ? (
                sessions.map((session) => (
                  <SelectItem
                    key={session.id}
                    value={session.id}
                    className={`
                      text-slate-100 py-3 px-3 cursor-pointer rounded-lg
                      transition-all duration-200
                      focus:bg-slate-800 hover:bg-slate-800
                      focus:text-emerald-400 hover:text-emerald-400
                    `}
                  >
                    <div className="flex flex-col items-start w-full min-w-0">
                      <span className="font-medium text-sm truncate w-full">
                        {session.title}
                      </span>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span>{formatDate(session.lastActivity)}</span>
                        {session.messageCount !== undefined && (
                          <>
                            <span className="text-slate-600">•</span>
                            <span>{session.messageCount} msg</span>
                          </>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                ))
              ) : (
                <SelectItem
                  value=""
                  disabled
                  className="text-slate-500 cursor-not-allowed py-3 px-3"
                >
                  <span className="text-slate-400 text-sm">
                    No active sessions
                  </span>
                </SelectItem>
              )}

              <SelectItem
                value="create-new"
                disabled={isCreatingSession}
                className={`
                  py-3 px-3 mt-1 border-t border-slate-700/60
                  hover:bg-emerald-500/10 focus:bg-emerald-500/10
                  text-emerald-400 transition-all duration-200
                `}
              >
                <div className="flex items-center gap-2">
                  {isCreatingSession ? (
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                  ) : (
                    <Plus className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className="font-medium">
                    {isCreatingSession ? "Creating..." : "Create New Session"}
                  </span>
                </div>
              </SelectItem>
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
