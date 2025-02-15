"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChatInput } from "./components/chatInput";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { ChatMessages } from "./components/chatMessage";

const ChatDialog = ({ initialQuery }: { initialQuery?: string }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `✨ 欢迎使用 Documind AI 助手！

**我能为您提供以下帮助：**
- 解答技术问题
- 分析文档内容
- 生成示例代码
- 进行创意写作

试试这些例子：
\`\`\`python
# 快速排序实现
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)
\`\`\`

💡 您可以直接输入问题，或粘贴需要分析的代码片段`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const {
    messagesEndRef,
    scrollToBottom,
    canScroll,
    setCanScroll,
    timeoutRef,
  } = useAutoScroll();
  const [hasProcessedInitial, setHasProcessedInitial] = useState(false);
  const initialProcessRef = useRef(false);

  useEffect(() => {
    scrollToBottom();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [messages]);

  useEffect(() => {
    if (initialQuery && initialQuery.trim() && !initialProcessRef.current) {
      initialProcessRef.current = true;
      const autoAsk = async () => {
        const userMessage = { role: "user", content: initialQuery };
        setMessages(prev => {
          if (prev.some(m => m.content === initialQuery)) return prev;
          return [...prev, userMessage];
        });
        await handleSend(userMessage);
      };
      autoAsk();
    }
  }, [initialQuery]);

  const handleSend = async (message?: { role: string; content: string }) => {
    const userMessage = message || { role: "user", content: input };
    if (!userMessage.content.trim()) return;
    if (isFetching) return;
    
    setMessages(prev => {
      if (prev.some(m => m.content === userMessage.content)) return prev;
      return [...prev, userMessage];
    });
    
    if (!message) setInput("");
    setIsFetching(true);
    setCanScroll(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [...messages.slice(-4), userMessage],
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n").filter((line) => line.trim());

        for (const line of lines) {
          if (line.startsWith("data:")) {
            const data = JSON.parse(line.slice(5).trim());
            const processedContent = data.content
              .replace(/<think>/g, ">\n> **思考开始**\n> ")
              .replace(/<\/think>/g, ">\n> **思考结束**\n> ");

            assistantMessage += processedContent;

            setMessages((prev) => {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage?.role === "assistant") {
                return [
                  ...prev.slice(0, -1),
                  { role: "assistant", content: assistantMessage },
                ];
              }
              return [
                ...prev,
                { role: "assistant", content: assistantMessage },
              ];
            });
          }
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full p-0">
      <nav className="flex mx-auto">
        <Image src="/logo.png" alt="Logo" width={150} height={150} />
      </nav>
      <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />
      <ChatInput
        input={input}
        setInput={setInput}
        handleSend={handleSend}
        isFetching={isFetching}
      />
    </div>
  );
};
export default ChatDialog;
