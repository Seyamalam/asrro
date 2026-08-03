import {
  paginationOptsValidator,
  paginationResultValidator,
} from "convex/server"
import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireExecutive, writeAudit } from "./_lib/auth"
import { cleanText } from "./_lib/validation"
import { blogFields } from "./model"

const blogDoc = v.object({
  _id: v.id("blogs"),
  _creationTime: v.number(),
  ...blogFields,
})

export const listPublic = query({
  args: {
    category: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    paginationOpts: paginationOptsValidator,
  },
  returns: paginationResultValidator(blogDoc),
  handler: async (ctx, args) => {
    if (args.category !== undefined)
      return await ctx.db
        .query("blogs")
        .withIndex("by_status_and_category_and_publishedAt", (q) =>
          q.eq("status", "published").eq("category", args.category!)
        )
        .order("desc")
        .paginate(args.paginationOpts)
    if (args.featured !== undefined)
      return await ctx.db
        .query("blogs")
        .withIndex("by_status_and_featured_and_publishedAt", (q) =>
          q.eq("status", "published").eq("featured", args.featured!)
        )
        .order("desc")
        .paginate(args.paginationOpts)
    return await ctx.db
      .query("blogs")
      .withIndex("by_status_and_publishedAt", (q) =>
        q.eq("status", "published")
      )
      .order("desc")
      .paginate(args.paginationOpts)
  },
})

export const searchPublic = query({
  args: {
    search: v.string(),
    category: v.optional(v.string()),
    limit: v.number(),
  },
  returns: v.array(blogDoc),
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(50, Math.floor(args.limit)))
    const search = cleanText(args.search, "Search", 200)
    return args.category !== undefined
      ? await ctx.db
          .query("blogs")
          .withSearchIndex("search_public_blogs", (q) =>
            q
              .search("title", search)
              .eq("status", "published")
              .eq("category", args.category!)
          )
          .take(limit)
      : await ctx.db
          .query("blogs")
          .withSearchIndex("search_public_blogs", (q) =>
            q.search("title", search).eq("status", "published")
          )
          .take(limit)
  },
})

export const getPublicBySlug = query({
  args: { slug: v.string() },
  returns: v.union(blogDoc, v.null()),
  handler: async (ctx, args) => {
    const item = await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug.trim().toLowerCase()))
      .unique()
    return item?.status === "published" ? item : null
  },
})

export const upsert = mutation({
  args: {
    blogId: v.optional(v.id("blogs")),
    slug: v.string(),
    title: v.string(),
    excerpt: v.string(),
    body: v.string(),
    category: v.string(),
    tags: v.array(v.string()),
    authorName: v.string(),
    authorMemberId: v.optional(v.id("members")),
    coverAssetId: v.optional(v.id("assets")),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("archived")
    ),
    featured: v.boolean(),
  },
  returns: v.id("blogs"),
  handler: async (ctx, args) => {
    const actor = await requireExecutive(ctx)
    if (args.tags.length > 30)
      throw new ConvexError("Tags are limited to 30 entries")
    const slug = cleanText(args.slug, "Slug", 100).toLowerCase()
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
      throw new ConvexError("Invalid blog slug")
    const slugOwner = await ctx.db
      .query("blogs")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique()
    if (slugOwner && slugOwner._id !== args.blogId)
      throw new ConvexError("Blog slug is already in use")
    const existing = args.blogId ? await ctx.db.get("blogs", args.blogId) : null
    if (args.blogId && !existing) throw new ConvexError("Blog post not found")
    const now = Date.now()
    const value = {
      slug,
      title: cleanText(args.title, "Title", 220),
      excerpt: cleanText(args.excerpt, "Excerpt", 600),
      body: cleanText(args.body, "Body", 100_000),
      category: cleanText(args.category, "Category", 80),
      tags: args.tags.map((tag) => cleanText(tag, "Tag", 60)),
      authorName: cleanText(args.authorName, "Author name", 120),
      authorMemberId: args.authorMemberId,
      coverAssetId: args.coverAssetId,
      status: args.status,
      featured: args.featured,
      publishedAt:
        args.status === "published"
          ? (existing?.publishedAt ?? now)
          : existing?.publishedAt,
      updatedAt: now,
    }
    const id = existing
      ? (await ctx.db.replace("blogs", existing._id, value), existing._id)
      : await ctx.db.insert("blogs", value)
    await writeAudit(
      ctx,
      actor,
      "blog.upsert",
      "blog",
      id,
      `Updated ${value.title}`
    )
    return id
  },
})
