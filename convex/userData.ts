import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// GUEST FALLBACK:
// This is redundant if we handle local storage on client,
// but for logged-in users, this syncs their data.

export const saveGoal = mutation({
    args: {
        userId: v.string(),
        title: v.string(),
        category: v.string(),
        term: v.string(),
        targetDate: v.string(),
        progress: v.number(),
        specific: v.optional(v.string()),
        measurable: v.optional(v.string()),
        achievable: v.optional(v.string()),
        relevant: v.optional(v.string()),
        timeBound: v.optional(v.string()),
        isNumerical: v.optional(v.boolean()),
        targetNumber: v.optional(v.number()),
        currentNumber: v.optional(v.number()),
        unit: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("goals", args);
    }
});

export const updateGoal = mutation({
    args: {
        id: v.id("goals"),
        progress: v.optional(v.number()),
        currentNumber: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        await ctx.db.patch(id, updates);
    }
});

export const deleteGoal = mutation({
    args: { id: v.id("goals") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    }
});

export const getGoals = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("goals")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();
    }
});

export const saveHabit = mutation({
    args: {
        userId: v.string(),
        text: v.string(),
        target: v.number(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("habits", {
            userId: args.userId,
            text: args.text,
            target: args.target,
            completed: false,
            streak: 0,
        });
    }
});

export const toggleHabit = mutation({
    args: { id: v.id("habits") },
    handler: async (ctx, args) => {
        const habit = await ctx.db.get(args.id);
        if (habit) {
            await ctx.db.patch(args.id, { completed: !habit.completed });
        }
    }
});

export const deleteHabit = mutation({
    args: { id: v.id("habits") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    }
});

export const getHabits = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("habits")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .collect();
    }
});

// REPORTS & PLANS

export const saveDailyLog = mutation({
    args: {
        userId: v.string(),
        date: v.string(),
        energy: v.number(),
        mood: v.string(),
        reflection: v.string(),
        feedback: v.optional(v.string()),
        productivityScore: v.number(),
        impactScore: v.number(),
        didTodayCount: v.boolean(),
    },
    handler: async (ctx, args) => {
        // 1. Save or update the daily log
        const existing = await ctx.db
            .query("daily_logs")
            .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
            .filter((q) => q.eq(q.field("date"), args.date))
            .first();

        let logId;
        if (existing) {
            await ctx.db.patch(existing._id, args);
            logId = existing._id;
        } else {
            logId = await ctx.db.insert("daily_logs", args);
        }

        // 2. Update Streak and Score in stats table
        const stats = await ctx.db
            .query("stats")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .unique();

        const today = new Date(args.date);
        const now = Date.now();

        if (stats) {
            let newStreak = stats.streak;
            const lastActiveDate = new Date(stats.lastActive);

            // Check if last activity was yesterday
            const diffDays = Math.floor((today.getTime() - lastActiveDate.getTime()) / (1000 * 3600 * 24));

            if (args.didTodayCount) {
                if (diffDays === 1) {
                    newStreak += 1;
                } else if (diffDays > 1) {
                    newStreak = 1; // Restarted after missing days
                } else if (diffDays === 0) {
                    // Already updated today, keep current streak incremented from previous update
                    // or if it was 0, it stays 1.
                    if (newStreak === 0) newStreak = 1;
                }
            } else {
                newStreak = 0; // BROKEN STREAK - SHAME
            }

            await ctx.db.patch(stats._id, {
                // MOMENTUM SCORING: 40% historical, 60% recent performance
                // This ensures the score GOES LOWER if you slack off.
                score: Math.floor((stats.score * 0.4) + (args.productivityScore * 0.6)),
                streak: newStreak,
                lastActive: now,
            });
        } else {
            await ctx.db.insert("stats", {
                userId: args.userId,
                score: args.productivityScore,
                streak: args.didTodayCount ? 1 : 0,
                lastActive: now,
            });
        }

        return logId;
    }
});

export const saveDailyPlan = mutation({
    args: {
        userId: v.string(),
        date: v.string(),
        events: v.any(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("daily_plans")
            .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
            .filter((q) => q.eq(q.field("date"), args.date))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, { events: args.events });
        } else {
            await ctx.db.insert("daily_plans", args);
        }
    }
});

export const getHistory = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("daily_logs")
            .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();
    }
});

export const getPlan = query({
    args: { userId: v.string(), date: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("daily_plans")
            .withIndex("by_user_date", (q) => q.eq("userId", args.userId))
            .filter((q) => q.eq(q.field("date"), args.date))
            .first();
    }
});
