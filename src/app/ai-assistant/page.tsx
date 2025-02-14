"use client";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Button } from "@/components/ui/button";

const ChatDialog = () => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "你好，需要帮助吗？" },
  ]);
  const [input, setInput] = useState("");
  const [canScroll, setCanScroll] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  // 创建消息容器的引用
  const messagesEndRef = useRef(null);
  // 将timeoutRef移动到组件作用域
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = (() => {
    let lastExec = 0;
    return () => {
      const now = Date.now();
      const remaining = 300 - (now - lastExec);
      if (remaining <= 0) {
        if (canScroll && messagesEndRef.current) {
          (messagesEndRef.current as HTMLElement).scrollIntoView();
        }
        lastExec = now;
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          if (canScroll && messagesEndRef.current) {
            (messagesEndRef.current as HTMLElement).scrollIntoView();
          }
          lastExec = Date.now();
          timeoutRef.current = null;
        }, remaining);
      }
    };
  })();

  // 每次 messages 更新时，自动滚动
  useEffect(() => {
    scrollToBottom();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [messages]);

  // 监听鼠标滚轮
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY < 0) {
        setCanScroll(false);
      }
    };

    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 含义: fetching的时候点击send按钮无效
    if (isFetching) {
      return;
    } else {
      setIsFetching(true);
    }

    setCanScroll(true);

    const userMessage = { role: "user", content: input };

    // 添加用户消息
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      // 调用流式 API
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

      // 处理流式响应
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        // 解析流式数据
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n").filter((line) => line.trim());
        for (const line of lines) {
          if (line.startsWith("data:")) {
            const data = JSON.parse(line.slice(5).trim());
            assistantMessage += data.content;
            setMessages((prev) => {
              const lastMessage = prev[prev.length - 1];
              if (lastMessage?.role === "assistant") {
                return [
                  ...prev.slice(0, -1),
                  { role: "assistant", content: assistantMessage },
                ];
              } else {
                return [
                  ...prev,
                  { role: "assistant", content: assistantMessage },
                ];
              }
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
    <div className="flex-1 flex flex-col h-screen bg-white p-0">
      <div className="relative bg-white h-12 shadow">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
          AI聊天窗口
        </div>
      </div>
      <div className="flex-1 overflow-y-auto mt-4 mb-4 space-y-4 ">
        {messages.map((msg, index) => (
          <div key={index} className="w-full max-w-4xl m-auto">
            {msg.role === "user" ? (
              <div className="flex justify-end">
                <div className="bg-blue-200 p-3 rounded inline-block">
                  {msg.content}
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <div>
                  <img src="/images/logo.png" alt="logo" />
                </div>
                <div className="pt-1">
                  <ReactMarkdown
                    components={{
                      code({
                        node,
                        inline,
                        className,
                        children,
                        ...props
                      }: React.ComponentProps<"code"> & {
                        inline?: boolean;
                        node?: unknown;
                      }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={materialDark as any}
                            language={match[1]}
                            PreTag="div"
                            {...(props as Omit<typeof props, "ref">)}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        ))}
        {/* 用于自动滚动的空 div */}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex w-full max-w-4xl mb-4 m-auto ">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 h-12 p-4 border border-gray-300 rounded-l-lg focus:outline-none"
          placeholder="给AI发送消息...."
        />

        <Button
          onClick={handleSend}
          disabled={isFetching}
          className="bg-blue-500 text-white h-12 py-4 px-4 rounded-l-none rounded-r-lg hover:bg-blue-600"
        >
          发送
        </Button>
      </div>
    </div>
  );
};

export default ChatDialog;
