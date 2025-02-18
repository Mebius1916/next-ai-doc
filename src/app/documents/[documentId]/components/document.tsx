"use client";
import { api } from "../../../../../convex/_generated/api";
import { Editor } from "./editor";
import { Toolbar } from "./toolbar";
import { Navbar } from "./narbar";
import { Room } from "./room";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { Ruler } from "./ruler";

interface DocumentProps {
  preloadedDocument: Preloaded<typeof api.documents.getById>;
}

export const Document = ({ preloadedDocument }: DocumentProps) => {
  const document = usePreloadedQuery(preloadedDocument); //获取预加载的数据
  return (
    <Room>
      <div className="min-h-screen bg-blue-50 ">
        <div className="flex flex-col fixed top-0 left-0 right-0 z-10 bg-blue-50">
          <Navbar data={document} />
          <Toolbar />
          <Ruler />
        </div>
        <div className="h-[100px]"/>
        <div className="print:pt-0">
          <Editor initialContent={document.initialContent} />
        </div>
      </div>
    </Room>
  );
};
