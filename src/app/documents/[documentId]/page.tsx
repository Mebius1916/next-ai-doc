import React from "react";
import { Document } from "../components/document";
import { preloadQuery } from "convex/nextjs";
import { auth } from "@clerk/nextjs/server";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
interface DocumentIdPageProps {
  params: Promise<{ documentId: string }>;
}

const page = async ({ params }: DocumentIdPageProps) => {
  const { documentId } = await params;

  const { getToken } = await auth();
  const token = (await getToken({ template: "convex" })) ?? undefined;
  if (!token) {
    throw new Error("Unauthorized");
  }

  // 预加载文档数据
  const preloadedDocument = await preloadQuery(
    api.documents.getById,
    { id: documentId as Id<"documents"> },
    { token }
  );

  if (!preloadedDocument) {
    throw new Error("Document not found");
  }

  return <Document preloadedDocument={preloadedDocument} />;
};

export default page;

