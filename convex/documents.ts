import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

// 创建新文档
export const create = mutation({
  args: {
    title: v.optional(v.string()),
    initialContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // 获取当前用户身份
    const user = await ctx.auth.getUserIdentity();

    // 如果用户未登录，抛出未授权错误
    if (!user) {
      throw new ConvexError("Unathorized");
    }
    const organizationId = (user.organization ?? undefined) as
      | string
      | undefined;

    // 在数据库中创建新文档
    return await ctx.db.insert("documents", {
      title: args.title ?? "Untitled coument",
      ownerId: user.subject,
      organizationId,
      initialContent: args.initialContent,
    });
  },
});

// 删除选择文档
export const removeById = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    //首先检查用户是否已登录。如果未登录，抛出未授权错误。
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const organizationId = (user.organization ?? undefined) as
      | string
      | undefined;

    // 获取文档数据
    const document = await ctx.db.get(args.id);

    if (!document) {
      throw new ConvexError("Document not found");
    }

    // 检查用户是否是文档所有者
    const isOwner = document.ownerId === user.subject;

    const isOrganizationMember = !!(
      document.organizationId && document.organizationId === organizationId
    );
    
    if (!isOwner || !isOrganizationMember) {
      throw new ConvexError("Unauthorized");
    }

    // 执行删除操作
    return await ctx.db.delete(args.id);
  },
});

//更新文档名称
export const updateById = mutation({
  args: { id: v.id("documents"), title: v.string() },
  handler: async (ctx, args) => {
    //首先检查用户是否已登录。如果未登录，抛出未授权错误。
    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    // 获取文档数据
    const document = await ctx.db.get(args.id);

    if (!document) {
      throw new ConvexError("Document not found");
    }

    // 检查用户是否是文档所有者
    const isOwner = document.ownerId === user.subject;

    if (!isOwner) {
      throw new ConvexError("Unauthorized");
    }

    return await ctx.db.patch(args.id, { title: args.title });
  },
});

// 获取查询数据
export const get = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
  },

  handler: async (ctx, { search, paginationOpts }) => {

    const user = await ctx.auth.getUserIdentity();

    if (!user) {
      throw new ConvexError("Unauthorized");
    }

    const organizationId = (user.organization ?? undefined) as
      | string
      | undefined;

    if (search && organizationId) {
      return await ctx.db
        .query("documents")//查询documents数据库
        .withSearchIndex("search_title", (q) =>
          q.search("title", search).eq("organizationId", organizationId)
        )
        .paginate(paginationOpts);//分页
    }

    //如果只提供搜索参数
    else if (search) {
      return await ctx.db
        .query("documents")
        //模糊搜索
        .withSearchIndex("search_title", (q) =>
          q.search("title", search).eq("ownerId", user.subject)
        )
        .paginate(paginationOpts);
    }

    //如果只提供组织ID
    if (organizationId) {
      return await ctx.db
        .query("documents")
        //严格搜索
        .withIndex("by_organization_id", (q) =>
          q.eq("organizationId", organizationId)
        )
        .paginate(paginationOpts);
    }

    //如果没有提供搜索参数，则返回所有文档
    return await ctx.db
      .query("documents")

      .withIndex("by_owner_id", (q) => q.eq("ownerId", user.subject))
      .paginate(paginationOpts);
  },
});

// 获取单个文档
export const getById = query({
  args: { id: v.id("documents") },
  handler: async (ctx, { id }) => {
    const document = await ctx.db.get(id);
    if (!document) {
      throw new ConvexError("Document not found");
    }
    return document;
  },
});

// 获取多个文档
export const getByIds = query({
  args: { ids: v.array(v.id("documents")) },
  handler: async (ctx, { ids }) => {
    const documents = [];
    
    for (const id of ids) {
      const document = await ctx.db.get(id);
      
      if (document) {
        documents.push({ id: document._id, name: document.title });
      } else {
        documents.push({ id, name: "[Removed]" });
      }
    }
    return documents;
  },
});
