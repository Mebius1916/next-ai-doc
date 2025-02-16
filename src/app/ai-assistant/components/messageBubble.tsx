import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export const AssistantMessage = ({ content }: { content: string }) => (
  <div className="flex gap-4 relative ml-10">
    <div className="flex items-center justify-center absolute w-12 h-12 -ml-10 bg-white rounded-full border-2 border-blue-200">
      <img src="/deepseek-color.svg" alt="logo" className="h-8 w-8" />
    </div>
    <div className="px-4 py-4 w-full max-w-3xl bg-white rounded-lg shadow-md mx-3 my-3">
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
                className="bg-gray-800 px-1.5 py-0.5 rounded text-gray-100 text-sm font-mono"
                {...props}
              >
                {children}
              </code>
            );
          },
          p: ({ node, ...props }) => (
            <p className="mb-3 leading-relaxed text-gray-800" {...props} />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc pl-6 mb-3 space-y-1.5" {...props} />
          ),
          ol: ({ node, ...props }) => (
            <ol className="list-decimal pl-6 mb-3 space-y-1.5" {...props} />
          ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-blue-500 bg-blue-50 text-gray-700 px-4 my-2 rounded-r-lg"
              {...props}
            />
          ),
          a: ({ node, ...props }) => (
            <a className="text-blue-600 hover:underline" {...props} />
          ),
          h1: ({ node, ...props }) => (
            <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <h2 className="text-xl font-semibold mt-4 mb-2" {...props} />
          ),
          table: ({ node, ...props }) => (
            <table className="w-full border-collapse my-4" {...props} />
          ),
          th: ({ node, ...props }) => (
            <th className="border-b-2 p-2 text-left bg-gray-50" {...props} />
          ),
          td: ({ node, ...props }) => (
            <td className="border-b p-2" {...props} />
          ),
        }}
        className="text-gray-800 leading-relaxed"
      >
        {content}
      </ReactMarkdown>
    </div>
  </div>
);

export const UserMessage = ({ content }: { content: string }) => (
  <div className="flex justify-end">
    <div className="bg-blue-500 text-white px-4 py-3 rounded-lg shadow-md max-w-3xl">
      {content}
    </div>
  </div>
);
