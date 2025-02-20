import React from "react";
import { Document } from "./components/document";
import { preloadQuery } from "convex/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
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
  const user = await currentUser();
  console.log("user", user);
  // 使用数组过滤null值并拼接
  const userNameParts = [user?.firstName, user?.lastName].filter(Boolean);
  const userName = userNameParts.join(' ') || user?.emailAddresses[0].emailAddress;
  const myUser = {
    imageUrl: user?.imageUrl,
    name: userName,
  };

  // 预加载文档数据
  const preloadedDocument = await preloadQuery(
    api.documents.getById,
    { id: documentId as Id<"documents"> },
    { token }
  );

  if (!preloadedDocument) {
    throw new Error("Document not found");
  }

  return <Document preloadedDocument={preloadedDocument} currentUser={myUser} />;
};

export default page;

