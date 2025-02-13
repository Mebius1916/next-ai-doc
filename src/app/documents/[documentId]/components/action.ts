//server action
"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function getDocuments(ids: Id<"documents">[]) {
  return await convex.query(api.documents.getByIds, { ids });
}

/*
   获取当前组织的所有用户列表
   @returns 返回处理后的用户数组，包含id、name和avatar信息
*/
export async function getUsers() {
  // 获取当前会话信息，包含组织ID等认证数据
  const { sessionClaims } = await auth();
  // 初始化Clerk客户端
  const clerk = await clerkClient();

  // 通过Clerk API获取指定组织的用户列表
  const response = await clerk.users.getUserList({
    organizationId: [sessionClaims?.org_id as string],
  });

  // 处理用户数据，提取需要的字段并格式化
  const users = response.data.map((user) => ({
    id: user.id,
    // 用户名优先级：全名 > 邮箱 > "Anonymous"
    name:
      user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous",
    // 用户头像URL
    avatar: user.imageUrl,
  }));

  return users;
}
