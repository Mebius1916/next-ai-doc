import { Liveblocks } from "@liveblocks/node";
import { ConvexHttpClient } from "convex/browser";
import { auth, currentUser } from "@clerk/nextjs/server";
import { api } from "../../../../convex/_generated/api";

// 初始化 Convex 客户端，用于与后端数据库交互
const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
// 初始化 Liveblocks 服务端 SDK，使用密钥进行认证
const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY!,
});

// 处理 POST 请求的入口函数
export async function POST(req: Request) {
  // Clerk 身份验证：获取会话声明
  const { sessionClaims } = await auth();
  if (!sessionClaims) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 从clerk获取当前用户详细信息
  const user = await currentUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 解析请求体中的 room 参数（即文档ID）
  const { room } = await req.json();
  // 通过 Convex 查询指定ID的文档
  const document = await convex.query(api.documents.getById, {
    id: room,
  });
  // console.log(document);
  // 文档不存在时返回未授权
  if (!document) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 权限验证逻辑：
  // 1. 检查是否是文档所有者
  const isOwner = document.ownerId === user.id;
  console.log(document.organizationId);
  // 2. 检查是否是组织成员（需匹配组织ID且不为空）
  const isOrganizationMember = !!(
    document.organizationId && document.organizationId === sessionClaims.org_id
  );
  // 双重权限校验失败时返回未授权
  if (!isOwner && !isOrganizationMember) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 创建 Liveblocks 会话：
  // - 使用用户ID作为会话标识
  // - 携带用户信息（姓名优先使用全名，否则用邮箱，最后匿名）
  // - 提供用户头像URL
  const name =
    user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Anonymous";
  // 将用户名转换为颜色
  const nameToNumber = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue = Math.abs(nameToNumber) % 360;
  const color = `hsl(${hue}, 80%, 60%)`;
  const session = liveblocks.prepareSession(user.id, {
    userInfo: {
      name,
      avatar: user.imageUrl,
      color,
    },
  });

  // 授予该会话对指定房间的完全访问权限
  session.allow(room, session.FULL_ACCESS);

  // 生成授权响应返回给客户端
  const { body, status } = await session.authorize();
  return new Response(body, { status });
}
