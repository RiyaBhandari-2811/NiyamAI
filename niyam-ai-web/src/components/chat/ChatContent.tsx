"use client";

import EmptyState from "@/components/chat/EmptyState";
import { MessageArea } from "@/components/chat/MessageArea";
import { useChatContext } from "@/components/chat/ChatProvider";

/**
 * ChatContent - Conditional rendering container
 * Shows EmptyState when no messages exist, MessageArea when messages are present
 */
export default function ChatContent(): React.JSX.Element {
  const { messages } = useChatContext();

  const isEmpty = messages.length === 0;

  return (
    <div
      className={`h-full w-full bg-slate-950/40 pt-10 ${
        isEmpty ? "flex items-center justify-center" : ""
      }`}
    >
      {isEmpty ? <EmptyState /> : <MessageArea />}
    </div>
  );
}
