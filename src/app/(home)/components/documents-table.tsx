"use client";
import React from "react";
import { Doc } from "../../../../convex/_generated/dataModel";
import { PaginationStatus } from "convex/react";
import { LoaderIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DocumentRow } from "./document-row";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
interface DocumentsTableProps {
  documents: Doc<"documents">[] | undefined;
  loadMore: (numItems: number) => void;
  status: PaginationStatus;
}
const DocumentsTable = ({
  documents,
  loadMore,
  status,
}: DocumentsTableProps) => {
  return (
    <div className="max-w-screen-xl mx-auto px-16 py-6 flex flex-col gap-5 h-[45vh]">
      {/* 加载中 */}
      {documents === undefined ? (
        <div className="flex justify-center items-center h-24">
          <LoaderIcon className="animate-spin text-muted-foreground size-5" />
        </div>
      ) : (
        <Table>
          {/* 表头 */}
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead>Name</TableHead>
              <TableHead>&nbsp;</TableHead>
              <TableHead className="hidden md:table-cell">Shared</TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
            </TableRow>
          </TableHeader>
          {/* 表体 */}
          {documents.length === 0 ? (
            <TableBody>
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={4}
                  className="h-24 text-center text-muted-foreground"
                >
                  No documents found
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            // 表体
            <TableBody className={cn(
              "scroll-custom flex-1 overflow-y-auto h-32 px-4"
            )}>
              {documents.map((document) => (
                <DocumentRow key={document._id} document={document} />
              ))}
            </TableBody>
          )}
        </Table>
      )}
      {/* 加载更多 */}
      <div className="flex justify-center items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => loadMore(5)}
          disabled={status !== "CanLoadMore"}
        >
          {status === "CanLoadMore" ? "Loading more" : "End of results"}
        </Button>
      </div>
    </div>
  );
};

export default DocumentsTable;
