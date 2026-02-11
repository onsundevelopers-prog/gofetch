
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listConversations = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("conversations")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();
    },
});

export const getMessages = query({
    args: { conversationId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("messages")
            .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
            .order("asc")
            .collect();
    },
});

export const sendMessage = mutation({
    args: {
        conversationId: v.string(),
        content: v.string(),
        role: v.union(v.literal("user"), v.literal("assistant")),
        userId: v.string()
    },
    handler: async (ctx, args) => {
        const messageId = await ctx.db.insert("messages", {
            conversationId: args.conversationId,
            content: args.content,
            role: args.role,
            userId: args.userId,
            createdAt: Date.now(),
        });

        await ctx.db.patch(ctx.db.normalizeId("conversations", args.conversationId)!, {
            lastMessageAt: Date.now(),
        });

        return messageId;
    },
});

export const createConversation = mutation({
    args: { userId: v.string(), title: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db.insert("conversations", {
            userId: args.userId,
            title: args.title,
            lastMessageAt: Date.now(),
        });
    },
});
