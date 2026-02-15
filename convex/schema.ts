
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    messages: defineTable({
        conversationId: v.string(),
        role: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
        userId: v.string(),
        createdAt: v.number(),
    }).index("by_conversation", ["conversationId"]),

    conversations: defineTable({
        userId: v.string(),
        title: v.string(),
        lastMessageAt: v.number(),
    }).index("by_user", ["userId"]),

    userPreferences: defineTable({
        userId: v.string(),
        theme: v.string(),
        avatarUrl: v.string(),
        premium: v.boolean(),
    }).index("by_user", ["userId"]),

    tasks: defineTable({
        userId: v.string(),
        text: v.string(),
        completed: v.boolean(),
        dueDate: v.number(),
        quantity: v.optional(v.number()),
        targetQuantity: v.optional(v.number()),
        unit: v.optional(v.string()),
    }).index("by_user", ["userId"]),

    stats: defineTable({
        userId: v.string(),
        score: v.number(),
        streak: v.number(),
        lastActive: v.number(),
    }).index("by_user", ["userId"]),

    users: defineTable({
        userId: v.string(),
        name: v.string(),
        email: v.string(),
        picture: v.string(),
        isPremium: v.boolean(),
        trialEndsAt: v.optional(v.number()),
        isTrialUsed: v.optional(v.boolean()),
        score: v.number(),
        streak: v.number(),
        streakLastUpdated: v.optional(v.number()),
        lastActive: v.optional(v.number()),
        onboardingMessage: v.optional(v.string()),
    }).index("by_user", ["userId"]),

    habits: defineTable({
        userId: v.string(),
        text: v.string(),
        completed: v.boolean(),
        streak: v.number(),
        target: v.number(),
        lastCompletedDate: v.optional(v.string())
    }).index("by_user", ["userId"]),

    goals: defineTable({
        userId: v.string(),
        title: v.string(),
        category: v.string(),
        term: v.string(),
        targetDate: v.string(),
        progress: v.number(),
        // SMART framework fields
        specific: v.optional(v.string()),
        measurable: v.optional(v.string()),
        achievable: v.optional(v.string()),
        relevant: v.optional(v.string()),
        timeBound: v.optional(v.string()),
        // Numerical goal fields
        isNumerical: v.optional(v.boolean()),
        targetNumber: v.optional(v.number()),
        currentNumber: v.optional(v.number()),
        unit: v.optional(v.string()), // e.g., pages, hours, reps
    }).index("by_user", ["userId"]),

    daily_logs: defineTable({
        userId: v.string(),
        date: v.string(),
        energy: v.number(),
        mood: v.string(),
        reflection: v.string(),
        feedback: v.optional(v.string()),
        productivityScore: v.number(),
        impactScore: v.number(),
        didTodayCount: v.boolean(),
    }).index("by_user_date", ["userId", "date"]),

    daily_plans: defineTable({
        userId: v.string(),
        date: v.string(),
        events: v.any(), // Storing the full schedule array
    }).index("by_user_date", ["userId", "date"]),
});
