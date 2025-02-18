"use client";
import { AssistantMessage, UserMessage } from "./messageBubble";

interface ChatMessagesProps {
  messages: Array<{ role: string; content: string }>;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  initialContent?: string;
}

export const ChatMessages = ({ messages, messagesEndRef,initialContent }: ChatMessagesProps) => {
  return (
    <div className="flex-1 overflow-y-auto mt-4 mb-4 space-y-4 scroll-custom mx-4">
      {messages.map((msg, index) => (
        <div key={index} className="w-full max-w-4xl m-auto">
          {msg.role === "user" ? (
            <UserMessage content={msg.content} />
          ) : (
            <AssistantMessage content={msg.content} initialContent={initialContent} />
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};