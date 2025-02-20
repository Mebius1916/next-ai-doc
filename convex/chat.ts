import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const sendMessage = mutation({
  args: {
    content: v.string(),
    organizationId: v.string(), // 直接使用传入的房间ID
    name: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    return ctx.db.insert("messages", {
      userId: user?.subject || "guest", // 简单用户标识
      content: args.content,
      name: args.name,
      imageUrl: args.imageUrl,
      organizationId: args.organizationId, // 自动归属到对应房间
      timestamp: Date.now(),
    });
  },
});

export const getRoomMessages = query({
  args: { organizationId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db.query("messages")
      .withIndex("by_organization", q => 
        q.eq("organizationId", args.organizationId) // 精确匹配房间ID
      )
      .order("desc")//按时间降序排序
      .collect();// 执行并返回数组
  },
});