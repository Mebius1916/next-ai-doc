"use client";
import React, { useState } from "react";
import Navbar from "./components/narbar";
import SearchInput from "./components/search-input";
import { TemplateGallery } from "./components/templates-gallery";
import DocumentsTable from "./components/documents-table";
import { useSearchParams } from "@/hooks/use-search-params";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import ChatDialog from "../ai-assistant/page";
const Page = () => {
  const [dialog, setDialog] = useState(false);
  const [search] = useSearchParams("search");
  const { results, status, loadMore } = usePaginatedQuery(
    api.documents.get,
    { search },
    { initialNumItems: 5 }
  );
  const aiDialog = () => {
    setDialog(true);
    // console.log(search);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div className="fixed top-0 left-0 right-0 z-10 h-16">
        <Navbar />
      </div>
      {dialog && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-10"
            onClick={() => setDialog(false)}
          />
          <div
            className="fixed h-[95vh] w-2/3 bg-[#EBEFFF] top-1/2 left-1/2 -translate-x-1/2 
          -translate-y-1/2 z-20 min-w-80 rounded-xl shadow-xl"
          >
            <ChatDialog initialQuery={search} />
          </div>
        </>
      )}
      <div className="mt-10">
        <SearchInput dialog={aiDialog} />
        <TemplateGallery />
        <DocumentsTable
          documents={results}
          loadMore={loadMore}
          status={status}
        />
      </div>
    </div>
  );
};

export default Page;
