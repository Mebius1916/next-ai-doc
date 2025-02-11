// 定义数据库schema
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),          // 文档标题（必填字符串）
    initialContent: v.optional(v.string()), // 初始内容（可选字符串）
    ownerId: v.string(),        // 所有者ID（必填字符串）
    roomId: v.optional(v.string()),     // 关联房间ID（可选）
    organizationId: v.optional(v.string()), // 所属组织ID（可选）
  })
   .index("by_owner_id", ["ownerId"])          // 按所有者ID建立索引
   .index("by_organization_id", ["organizationId"]) // 按组织ID建立索引
   .searchIndex("search_title", {              // 创建可搜索索引
      searchField: "title",                   // 可搜索的标题字段
      filterFields: ["ownerId", "organizationId"], // 可过滤字段
    })
});