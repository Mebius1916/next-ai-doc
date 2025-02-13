"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { FullscreenLoader } from "@/components/fullscreen-loader";
import { getUsers, getDocuments } from "./action";
import { toast } from "sonner";
import { Id } from "../../../../../convex/_generated/dataModel";
import { LEFT_MARGIN_DEFAULT, RIGHT_MARGIN_DEFAULT } from "@/lib/margin";
type User = { id: string; name: string; avatar: string };

export function Room({ children }: { children: ReactNode }) {
  const params = useParams();
  const documentId = params.documentId as string;
  const [users, setUsers] = useState<User[]>([]);

  // 获取当前组织所有用户数据
  useEffect(() => {
    (async () => {
      try {
        const list = await getUsers();
        setUsers(list);
      } catch {
        toast.error("Failed to fetch users");
      }
    })();
  }, []);

  return (
    <LiveblocksProvider
      throttle={16} //实时协作的频率60hz
      //liveblocks鉴权
      authEndpoint={async () => {
        const response = await fetch("/api/liveblocks-auth", {
          method: "POST",
          body: JSON.stringify({ room: documentId }),
        });
        return await response.json();//返回鉴权令牌和用户信息
      }}

      //在数据库内根据当前在线协作users查找具体users信息
      resolveUsers={({ userIds }) => {
        return userIds.map(
          //users为数据库中所有用户信息
          (userId) => users.find((user) => user.id === userId) ?? undefined
        );
      }}
      //@功能：在文档中输入@时，自动提示用户列表
      resolveMentionSuggestions={({ text }) => {
        let filteredUsers = users;
        if (text) {
          filteredUsers = users.filter((user) =>
            user.name.toLowerCase().includes(text.toLowerCase())
          );
        }
        return filteredUsers.map((user) => user.name);
      }}
      //其他文档引用功能
      resolveRoomsInfo={async ({ roomIds }) => {
        // 这个函数会在以下情况被自动调用：
        // 1. 用户输入新的文档引用时（比如输入 [[ 时）
        // 2. 文档内容发生变化时
        // 3. 被引用的文档信息更新时（通过 Liveblocks 的实时连接）
        const documents = await getDocuments(roomIds as Id<"documents">[]);
        return documents.map((document) => ({
          id: document.id,
          name: document.name,
        }));
      }}
    >
      <RoomProvider
        id={documentId}
        initialStorage={{ leftMargin: LEFT_MARGIN_DEFAULT, rightMargin: RIGHT_MARGIN_DEFAULT }} //设置文档初始状态
      >
        <ClientSideSuspense
          fallback={<FullscreenLoader label="Room loading" />}
        >
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
