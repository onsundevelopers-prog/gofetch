
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DailyRecord, UserGoal } from "../types";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

const genAI = GEMINI_KEY ? new GoogleGenerativeAI(GEMINI_KEY) : null;

async function fetchGroq(prompt: string, history: any[], system: string, isJson: boolean = false) {
  try {
    const messages = [
      { role: "system", content: system },
      ...history.slice(-10).map(h => ({ role: h.role === 'assistant' ? 'assistant' : 'user', content: h.content })),
      { role: "user", content: prompt }
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages,
        response_format: isJson ? { type: "json_object" } : undefined
      })
    });

    if (!response.ok) throw new Error(`Groq API error: ${response.status}`);

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response structure from Groq");
    }
    return data.choices[0].message.content;
  } catch (e) {
    console.error("fetchGroq error:", e);
    // @ts-ignore
    if (e.message) console.error("Error message:", e.message);
    throw e;
  }
}

// Log once on load if keys are missing
if (!GEMINI_KEY && !GROQ_KEY) {
  console.error("CRITICAL: Both VITE_GEMINI_API_KEY and VITE_GROQ_API_KEY are missing from environment variables.");
}

export const getGeminiChatResponse = async (prompt: string, history: any[], context?: { goals: UserGoal[], habits: any[], role?: string, pain?: string }) => {
  const contextStr = context ? `
    
    CRITICAL INTELLIGENCE:
    - Target Identity: ${context.role || "High-Performer"}
    - Primary Weakness: ${context.pain || "Lack of discipline"}
    - Intentions: ${context.goals.map(g => `"${g.title}"`).join(", ") || "No defined vision"}
    - Current Performance: ${context.habits.filter(h => h.completed).length}/${context.habits.length} non-negotiables completed today.
  ` : "";

  const system = `You are "Buddy" - the helpful, encouraging, and slightly playful dog companion for the Antigravity productivity platform.

YOUR MANDATE: Help the user 'defy gravity' (their own inertia) through positive reinforcement, clear guidance, and gentle nudges. You are inspired by the best educational mascots like Duolingo's Duo, but specifically tailored for high-performance productivity in a beginner-friendly way.

YOUR VOICE:
- Encouraging: Always find the silver lining, but remain honest about progress.
- Playful: Use dog-related metaphors (fetching goals, wagging tails for wins, barking at blockers).
- Clear & Simple: 10x more comprehensible than a standard coach. Use simple words and direct instructions.
- Loyal: You are their partner in growth. "We" are doing this together.

BUDDY'S RULES:
1. POSITIVITY FIRST: Even when they fail, focus on what we can 'fetch' next time.
2. MICRO-WINS: Celebrate every small action. Progress is a series of tiny wags.
3. THE DAILY FETCH: Encourage the use of the reflection tool as a way to 'bring back the data' from the day.
4. GENTLE NUDGES: Use "Woof!" or "Bark!" as playful attention-getters instead of aggressive commands.
5. NO JARGON: Explain things simply. If a goal is too complex, help them break it down into 'bite-sized treats'.
6. VISUAL THINKING: Refer to visual cues in the app (the momentum bar, the stars, the dog's reactions).

${contextStr}

RESPONSE PROTOCOL:
- Be warm, supportive, and helpful.
- Use occasional "Woof!" or dog emojis 🐕🦴.
- Focus on the IMMEDIATE NEXT ACTION that is easiest to do.
- Address their role (${context?.role}) as their 'Identity' and encourage them to grow into it.
- End every message with a supportive encouraging phrase or a question to keep them engaged.`;

  // ... rest of the logic remains same for Gemini/Groq calls

  // Try Gemini first
  if (GEMINI_KEY && genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: system,
      });

      const chat = model.startChat({
        history: history.slice(-10).map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }],
        })),
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();

      if (text && text.trim()) {
        return { text, functionCalls: [] };
      }
    } catch (e) {
      console.warn("Gemini failed, trying Groq fallback", e);
    }
  }

  // Try Groq as fallback
  if (GROQ_KEY) {
    try {
      const text = await fetchGroq(prompt, history, system);
      if (text && text.trim()) {
        return { text, functionCalls: [] };
      }
    } catch (e) {
      console.error("Groq also failed", e);
    }
  }

  // Final fallback response
  return {
    text: "I'm having trouble connecting to my AI services right now. Please check that you have either VITE_GEMINI_API_KEY or VITE_GROQ_API_KEY configured in your .env file. Once connected, I'll be able to provide detailed, personalized guidance for your growth journey!",
    functionCalls: []
  };
};

export const analyzeDay = async (reflection: string, energy: number, mood: string, goals: UserGoal[], habits: any[]) => {
  const completedHabits = habits.filter(h => h.completed).map(h => h.text).join(", ");
  const incompleteHabits = habits.filter(h => !h.completed).map(h => h.text).join(", ");
  const activeGoals = goals.map(g => `${g.title} (${g.category}, ${g.progress}% complete)`).join(", ");
  const habitCompletionRate = habits.length > 0 ? (habits.filter(h => h.completed).length / habits.length) * 100 : 0;

  const prompt = `
    You are BUDDY, the loyal productivity companion. You are analyzing the user's day to help them see their progress and prepare for tomorrow's 'fetch'.
    
    CRITICAL COMPANION DATA:
    - Reflection: "${reflection}"
    - Energy: ${energy}/5
    - Habits Completed: ${completedHabits || "NONE"}
    - Habits Missed: ${incompleteHabits || "NONE"}
    - Completion Rate: ${habitCompletionRate.toFixed(0)}%
    
    YOUR COMPANION AUDIT PROTOCOL:
    1. Verdict: **Did we move forward today?** (YES/NO).
    2. The Encouraging Truth: Celebrate what was done and gently point out what we can 'fetch' tomorrow. 
    3. Momentum Score (0-100): Be fair, encouraging but realistic.
    4. Mission Tasks: 2 simple things for tomorrow to keep the tail wagging.
    5. The Schedule: A balanced day from 06:00 to 20:00. Include 'Rest & Play' as types.
    
    PERSONA:
    You are BUDDY. A smart, loyal, and helpful dog. 
    Your tone is warm, bite-sized, and supportive. Use high-impact positivity.
    - No corporate speak.
    - Use dog metaphors naturally.
    - Focus on MOMENTUM and JOY.
    
    Return ONLY valid JSON:
    {
      "text": "Your warm markdown analysis with a 'Woof!'",
      "score": <0-100>,
      "didTodayCount": <true/false>,
      "schedule": [
        {"start": "06:00", "title": "Morning Wag (Routine)", "type": "MISSION"},
        {"start": "07:00", "title": "Focused Fetch (Work)", "type": "WORK"}
      ]
    }
  `;

  const system = "You are BUDDY, the loyal companion mascot for Antigravity. You are encouraging and helpful. Return ONLY valid JSON.";

  if (GEMINI_KEY && genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await model.generateContent(system + "\n" + prompt);
      const response = JSON.parse(result.response.text());
      return {
        text: response.text,
        score: response.score,
        didTodayCount: response.didTodayCount,
        schedule: response.schedule || []
      };
    } catch (e) {
      console.warn("Gemini analysis failed, falling back to Groq", e);
    }
  }

  if (GROQ_KEY) {
    try {
      const raw = await fetchGroq(prompt, [], system, true);
      const response = JSON.parse(raw);
      return {
        text: response.text,
        score: response.score,
        didTodayCount: response.didTodayCount,
        schedule: response.schedule || []
      };
    } catch (e) {
      console.error("Groq analysis failed", e);
    }
  }

  // Fallback with more detailed local analysis
  const baseScore = 40 + (energy * 10) + (habits.filter(h => h.completed).length * 5);
  const didTodayCountFallback = baseScore > 60;
  return {
    text: `**Overall Assessment**\n\nBased on your reflection and ${habitCompletionRate.toFixed(0)}% habit completion rate, you're making progress. Your energy level of ${energy}/5 suggests ${energy >= 4 ? 'strong momentum' : energy >= 3 ? 'steady effort' : 'you might need more rest'}.\n\n(AI Connection Lost - Manual backup score generated)`,
    score: Math.min(100, baseScore),
    didTodayCount: didTodayCountFallback,
    schedule: []
  };
};

export const generateInitialPlan = async (role: string, pain: string) => {
  const prompt = `
    You are BUDDY. You are helping a new friend (${role}) who is dealing with ${pain}.
    
    TASK: Design our first 'Flight Path' together. 
    Make it feel doable but exciting. We're going to defy gravity together!
    
    REQUIREMENTS:
    1. A schedule from 06:00 to 20:00. Every hour should have a purpose, including rest.
    2. 3 Simple Habits that help them start small and win big against ${pain}.
    
    Return ONLY valid JSON:
    {
      "message": "A warm, supportive, and exciting welcome. Tell them you're ready to fetch some big wins!",
      "habits": ["Habit 1", "Habit 2", "Habit 3"],
      "schedule": [
        {"start": "06:00", "title": "Morning Lift-Off", "type": "MISSION"},
        {"start": "07:00", "title": "The Fetch (Main Work)", "type": "WORK"}
      ]
    }
    Generate the full list from 06:00 to 20:00 with no gaps.
  `;

  const system = "You are BUDDY. You build Flight Paths for your friends. You are a loyal dog companion. Return ONLY valid JSON.";

  if (GEMINI_KEY && genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await model.generateContent(system + "\n" + prompt);
      const response = JSON.parse(result.response.text());
      return response;
    } catch (e) {
      console.warn("Gemini init plan failed, trying Groq", e);
    }
  }

  if (GROQ_KEY) {
    try {
      const raw = await fetchGroq(prompt, [], system, true);
      return JSON.parse(raw);
    } catch (e) {
      console.error("Groq init plan failed", e);
    }
  }

  // Fallback
  return {
    message: "I couldn't reach the server, but the standard remains high. Focus on your discipline.",
    habits: ["Morning Audit", "Deep Work Session", "Physical Training"],
    schedule: [
      { start: "06:00", title: "Wake & Audit", type: "MISSION" },
      { start: "08:00", title: "Deep Work", type: "WORK" },
      { start: "17:00", title: "Physical Training", type: "STRENGTH" }
    ]
  };
};

export const auditGoal = async (goalTitle: string, description: string) => {
  const prompt = `
    You are BUDDY. Help our friend refine this goal so it's as clear as a crystal!
    Title: "${goalTitle}"
    Description: "${description}"
 
    YOUR CRITERIA:
    - Is it 'Bite-sized'? (Atomic/Small)
    - Is it 'Fetchable'? (Realistic)
    - Is it 'Timed'? (Deadline)
 
    Return ONLY valid JSON:
    {
      "isSmart": <true/false>,
      "feedback": "Your warm, helpful feedback on how to make this better.",
      "suggestions": ["Small adjustment 1", "Small adjustment 2"]
    }
  `;

  if (GEMINI_KEY && genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await model.generateContent(prompt);
      return JSON.parse(result.response.text());
    } catch (e) {
      console.warn("Audit failed", e);
    }
  }

  return { isSmart: true, feedback: "Keep it simple and actionable.", suggestions: [] };
};

