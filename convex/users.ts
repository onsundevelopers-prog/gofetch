
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getStats = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("stats")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .unique();
    },
});

export const updateScore = mutation({
    args: { userId: v.string(), scoreDelta: v.number() },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("stats")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, {
                score: Math.max(0, existing.score + args.scoreDelta),
                lastActive: Date.now(),
            });
        } else {
            await ctx.db.insert("stats", {
                userId: args.userId,
                score: Math.max(0, args.scoreDelta),
                streak: 1,
                lastActive: Date.now(),
            });
        }
    },
});

export const getPreferences = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("userPreferences")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .unique();
    },
});

export const updateAvatar = mutation({
    args: { userId: v.string(), avatarUrl: v.string() },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("userPreferences")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .unique();

        if (existing) {
            await ctx.db.patch(existing._id, { avatarUrl: args.avatarUrl });
        } else {
            await ctx.db.insert("userPreferences", {
                userId: args.userId,
                theme: "light",
                avatarUrl: args.avatarUrl,
                premium: false,
            });
        }
    },
});

export const storeUser = mutation({
    args: {
        userId: v.string(),
        name: v.string(),
        email: v.string(),
        picture: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .unique();

        if (existing) {
            return existing._id;
        }

        // New user - give them 7 days trial
        const trialDays = 7;
        const trialEndsAt = Date.now() + (trialDays * 24 * 60 * 60 * 1000);

        return await ctx.db.insert("users", {
            ...args,
            isPremium: true, // During trial they are premium
            trialEndsAt,
            isTrialUsed: true,
            score: 0,
            streak: 0,
        });
    },
});

export const getUser = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .unique();

        if (!user) return null;

        return {
            ...user,
            isPremium: user.isPremium || false
        };
    },
});

