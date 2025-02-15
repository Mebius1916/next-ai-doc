import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export const AssistantMessage = ({ content }: { content: string }) => (
  <div className="flex gap-4 relative">
    <div className="flex items-center justify-center absolute ml-2">
      <img src="/deepseek-color.svg" alt="logo" className="h-8 w-8" />
    </div>
    <div className="pt-1 pl-12 pr-4 w-full max-w-3xl">
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                style={materialDark as any}
                language={match[1]}
                PreTag="div"
                customStyle={{
                  background: "#292D3E",
                  borderRadius: "0.5rem",
                  margin: "1rem 0",
                  padding: "1.25rem",
                }}
                codeTagProps={{
                  style: { fontFamily: "Fira Code, monospace" },
                }}
                {...props}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-red-600"
                {...props}
              >
                {children}
              </code>
            );
          },
          p: ({ node, ...props }) => (
            <p className="mb-4 leading-relaxed" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 mb-4 space-y-2" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 mb-4 space-y-2" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-blue-500 bg-blue-50 text-gray-700 px-4 rounded-lg"
              {...props}
            />
          ),
        }}
        className="prose max-w-none text-gray-800 leading-relaxed"
      >
        {content}
      </ReactMarkdown>
    </div>
  </div>
);

export const UserMessage = ({ content }: { content: string }) => (
  <div className="flex justify-end">
    <div className="bg-white p-3 rounded inline-block shadow-md">{content}</div>
  </div>
);