"use client";
import { api } from "../../../../../convex/_generated/api";
import { Editor } from "./editor";
import { Toolbar } from "./toolbar";
import { Navbar } from "./narbar";
import { Room } from "./room";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { Ruler } from "./ruler";
import { useState } from "react";
import ChatDialog from "@/app/ai-assistant/page";
import Image from "next/image";
import { Ellipsis, MessagesSquare } from "lucide-react";
import Link from "next/link";
interface DocumentProps {
  preloadedDocument: Preloaded<typeof api.documents.getById>;
}

export const Document = ({ preloadedDocument }: DocumentProps) => {
  const document = usePreloadedQuery(preloadedDocument); //获取预加载的数据
  const [dialog, setDialog] = useState(false);
  return (
    <Room>
      <div className="min-h-screen bg-blue-50 ">
        <div className="flex flex-col fixed top-0 left-0 right-0 z-10 bg-blue-50">
          <Navbar data={document} />
          <Toolbar />
          <Ruler />
        </div>
        <div className="h-[100px]" />
        <div className="print:pt-0 flex">
          <Editor initialContent={document.initialContent} />
          <div className="fixed right-2 bottom-4">
            <button
              onClick={() => setDialog(true)}
              className="cursor-pointer bg-white shadow-lg h-32 mr-4 w-12 rounded-full flex flex-col items-center justify-center"
            >
              <Image
                src="/logo3.png"
                alt="Logo"
                width={30}
                height={30}
                className="mb-1"
              />
              AI
              <br />
              助
              <br />手
            </button>
            <button className="bg-white w-12 h-12 rounded-full mt-3 flex items-center justify-center">
              <MessagesSquare size={20} color="#E4D1FF" />
            </button>
            <Link href="https://github.com/Mebius1916" target="_blank" rel="noopener noreferrer">
              <button className="bg-white w-12 h-12 rounded-full mt-3 flex items-center justify-center">
                <Ellipsis size={20} color="#E4D1FF" />
              </button>
            </Link>
          </div>
          {dialog && (
            <div
              className="fixed flex flex-col w-[406px] 
            h-[calc(100vh_-_100px_-_20px)] bg-gradient-to-br from-purple-50 to-blue-50 right-0 top-[104px] mr-2 z-10
            shadow-lg rounded-md print:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="absolute right-2 top-2 cursor-pointer"
                onClick={() => setDialog(false)}
              >
                <path
                  d="M11.1153 4.16924L11.8303 4.88423C12.0559 5.10988 12.0559 5.47573 11.8303 5.70137L9.53141 7.99986L11.8303 10.2986C12.0559 10.5243 12.0559 10.8901 11.8303 11.1158L11.1153 11.8308C10.8897 12.0564 10.5238 12.0564 10.2982 11.8308L7.99878 9.53105L5.70174 11.8299C5.47609 12.0556 5.11025 12.0556 4.8846 11.8299L4.1696 11.1149C3.94395 10.8893 3.94395 10.5234 4.1696 10.2978L6.46615 7.99986L4.1696 5.70221C3.94395 5.47656 3.94395 5.11072 4.1696 4.88507L4.8846 4.17007C5.11025 3.94442 5.47609 3.94442 5.70174 4.17007L7.99878 6.46723L10.2982 4.16924C10.5238 3.94359 10.8897 3.94359 11.1153 4.16924Z"
                  fill="#333940"
                ></path>
              </svg>
              <ChatDialog initialContent="Lassistant" />
            </div>
          )}
        </div>
      </div>
    </Room>
  );
};
