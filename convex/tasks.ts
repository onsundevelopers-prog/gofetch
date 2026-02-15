
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listHabits = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("tasks")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();
    },
});

export const addHabit = mutation({
    args: {
        userId: v.string(),
        text: v.string(),
        target: v.number(),
        quantity: v.optional(v.number()),
        targetQuantity: v.optional(v.number()),
        unit: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        // Check for free limit
        const existing = await ctx.db
            .query("tasks")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();

        // Check if user is premium
        const prefs = await ctx.db
            .query("userPreferences")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .unique();

        if (!prefs?.premium && existing.length >= 3) {
            throw new Error("Free tier limited to 3 habits. Upgrade to Premium for unlimted growth!");
        }

        return await ctx.db.insert("tasks", {
            userId: args.userId,
            text: args.text,
            completed: false,
            dueDate: Date.now(),
            quantity: args.quantity,
            targetQuantity: args.targetQuantity,
            unit: args.unit,
        });
    },
});

export const toggleHabit = mutation({
    args: { id: v.id("tasks") },
    handler: async (ctx, args) => {
        const habit = await ctx.db.get(args.id);
        if (habit) {
            await ctx.db.patch(args.id, { completed: !habit.completed });
        }
    },
});

export const deleteHabit = mutation({
    args: { id: v.id("tasks") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const updateTaskQuantity = mutation({
    args: { id: v.id("tasks"), quantity: v.number() },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, { quantity: args.quantity });
    },
});
