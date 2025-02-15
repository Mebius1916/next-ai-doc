"use client";
import React from "react";
import Navbar from "./components/narbar";
import SearchInput from "./components/search-input";
import { TemplateGallery } from "./components/templates-gallery";
import DocumentsTable from "./components/documents-table";
import { useSearchParams } from "@/hooks/use-search-params";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
const page = () => {
  const [search] = useSearchParams("search");
  const { results, status, loadMore } = usePaginatedQuery(
    api.documents.get,
    { search },
    { initialNumItems: 5 }
  );
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
      <div className="mt-10">
        <SearchInput />
        <TemplateGallery />
        <div className="scroll-custom flex-1 overflow-y-auto h-[calc(100vh-30rem)] px-4">
          <DocumentsTable
            documents={results}
            loadMore={loadMore}
            status={status}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
