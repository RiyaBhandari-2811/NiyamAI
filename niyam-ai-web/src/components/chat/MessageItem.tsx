"use client";

import { File, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownRenderer, mdComponents } from "./MarkdownRenderer";
import {
  ActivityTimeline,
  ProcessedEvent,
} from "@/components/ActivityTimeline";
import { Copy, CopyCheck, Loader2, Bot, User } from "lucide-react";
import { Message } from "@/types";
import { useChatContext } from "./ChatProvider";

interface MessageItemProps {
  message: Message;
  messageEvents?: Map<string, ProcessedEvent[]>;
  isLoading?: boolean;
  onCopy?: (text: string, messageId: string) => void;
  copiedMessageId?: string | null;
}

/**
 * Individual message component that handles both human and AI messages
 * with proper styling, copy functionality, and activity timeline
 */
export function MessageItem({
  message,
  messageEvents,
  isLoading = false,
  onCopy,
  copiedMessageId,
}: MessageItemProps) {
  const { originalUploadedFile } = useChatContext();
  const handleCopy = (text: string, messageId: string) => {
    if (onCopy) {
      onCopy(text, messageId);
    }
  };

  console.log("Message: ", message);
  let messageContent: any;

  try {
    messageContent = JSON.parse(message.content);
  } catch (e) {
    messageContent = message.content;
  }

  console.log("messageContent: ", messageContent);

  const getFileIcon = (fileName: string | null) => {
    const extension = fileName?.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return <File className="w-5 h-5 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="w-5 h-5 text-blue-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  // Human message rendering
  if (message.type === "human") {
    return (
      <div className="flex items-start justify-end gap-3 max-w-[85%] ml-auto">
        <div className=" to-slate-300 text-white p-4 rounded-2xl rounded-tr-sm shadow-lg border border-blue-500/20">
          {messageContent.type === "file" &&
          messageContent.mime === "application/pdf" ? (
            <div className="space-y-3">
              <h4 className="font-medium text-slate-400">Uploaded File:</h4>
              <div className="flex items-center justify-between p-3 bg-slate-500 rounded-lg">
                <div className="flex items-center gap-3">
                  {getFileIcon(originalUploadedFile?.name as string)}
                  <div>
                    <div className="font-medium text-inherit">
                      {originalUploadedFile?.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <ReactMarkdown
              components={{
                ...mdComponents,
                p: ({ children, ...props }) => (
                  <p
                    className="mb-2 leading-relaxed text-white last:mb-0"
                    {...props}
                  >
                    {children}
                  </p>
                ),
                h1: ({ children, ...props }) => (
                  <h1
                    className="text-xl font-bold mb-3 text-white leading-tight"
                    {...props}
                  >
                    {children}
                  </h1>
                ),
                h2: ({ children, ...props }) => (
                  <h2
                    className="text-lg font-semibold mb-2 text-white leading-tight"
                    {...props}
                  >
                    {children}
                  </h2>
                ),
                code: ({ children, ...props }) => (
                  <code
                    className="bg-blue-800/50 text-blue-100 px-1.5 py-0.5 rounded text-sm font-mono"
                    {...props}
                  >
                    {children}
                  </code>
                ),
              }}
              remarkPlugins={[remarkGfm]}
            >
              {messageContent.data}
            </ReactMarkdown>
          )}
        </div>

        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-md border border-blue-500/30">
          <User className="h-4 w-4 text-white" />
        </div>
      </div>
    );
  }

  // AI message rendering
  const hasTimelineEvents =
    messageEvents &&
    messageEvents.has(message.id) &&
    messageEvents.get(message.id)!.length > 0;

  // AI message loading with timeline events - show thinking indicator
  // Show this when loading AND we have timeline events (even if content started arriving)
  if (isLoading && hasTimelineEvents) {
    return (
      <div className="flex items-start gap-3 max-w-[90%]">
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md border border-emerald-400/30">
          <Bot className="h-4 w-4 text-white" />
        </div>

        <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl rounded-tl-sm p-4 shadow-lg">
          {/* Activity Timeline during thinking */}
          {hasTimelineEvents && (
            <ActivityTimeline
              processedEvents={messageEvents.get(message.id) || []}
              isLoading={isLoading}
            />
          )}

          {/* Show content if it exists while loading */}
          {message.content && (
            <div className="prose prose-invert max-w-none mb-3">
              <MarkdownRenderer content={message.content} />
            </div>
          )}

          {/* Loading indicator */}
          <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
            <span className="text-sm text-slate-400">
              {message.content
                ? "🚀 Still processing..."
                : "🤔 Thinking and planning..."}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // AI message with no content and not loading - show timeline if available
  if (!message.content) {
    // If we have timeline events, show them even without content
    if (hasTimelineEvents) {
      return (
        <div className="flex items-start gap-3 max-w-[90%]">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md border border-emerald-400/30">
            <Bot className="h-4 w-4 text-white" />
          </div>

          <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl rounded-tl-sm p-4 shadow-lg">
            <ActivityTimeline
              processedEvents={messageEvents.get(message.id) || []}
              isLoading={isLoading}
            />

            {/* Show thinking indicator */}
            <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 mt-2">
              <span className="text-sm text-slate-400">🤔 Thinking...</span>
            </div>
          </div>
        </div>
      );
    }

    // Otherwise show no content indicator
    return (
      <div className="flex items-start gap-3 max-w-[90%]">
        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md border border-emerald-400/30">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <div className="flex items-center gap-2 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2">
          <span className="text-sm text-slate-400">No content</span>
        </div>
      </div>
    );
  }

  // Regular AI message display with content
  return (
    <div className="flex items-start gap-3 max-w-[90%]">
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-md border border-emerald-400/30">
        <Bot className="h-4 w-4 text-white" />
      </div>

      <div className="flex-1 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl rounded-tl-sm p-4 shadow-lg relative group">
        {/* Activity Timeline */}
        {messageEvents && messageEvents.has(message.id) && (
          <ActivityTimeline
            processedEvents={messageEvents.get(message.id) || []}
            isLoading={isLoading}
          />
        )}

        {/* Message content */}
        <div className="prose prose-invert max-w-none">
          <MarkdownRenderer content={message.content} />
        </div>

        {/* Copy button */}
        {onCopy && (
          <button
            onClick={() => handleCopy(message.content, message.id)}
            className="absolute top-3 right-3 p-2 hover:bg-slate-700/50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            title="Copy message"
          >
            {copiedMessageId === message.id ? (
              <CopyCheck className="h-4 w-4 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4 text-slate-400 hover:text-slate-300" />
            )}
          </button>
        )}

        {/* Timestamp */}
        <div className="mt-3 pt-2 border-t border-slate-700/50">
          <span className="text-xs text-slate-400">
            {message.timestamp.toLocaleTimeString()}
          </span>
        </div>
      </div>
    </div>
  );
}
