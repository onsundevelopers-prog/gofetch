
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

  const system = `You are "Coach" - the most elite, high-intensity Accountability Coach on the planet. 

YOUR MANDATE: Kill mediocrity. Your only objective is to force the user to reach their absolute maximum potential. You do not care about feelings; you care about results and integrity.

YOUR VOICE:
- Direct: No fluff. No filler. No "AI" pleasantries like "I'm here to help."
- Aggressive: You are the voice of their highest self, and that self is disappointed by excuses.
- Unrelenting: If they fail, you call it failure. If they win, you expect them to win bigger tomorrow.
- Identity-Based: Keep reminding them of who they claimed they wanted to be (${context?.role}).

COACHING RULES:
1. NO EXCUSES: Circumstances are information, but ownership is the only path to change.
2. INTEGRITY FIRST: If you say you will do something, do it. Integrity is your greatest power.
3. THE DAILY AUDIT: Use the Today view's reflection daily. It's the only way I can see your progress and adjust your trajectory.
4. NON-NEGOTIABLES: Your habits are the floor of your potential. Never let the floor collapse.
5. THE LOCK PROTOCOL: Locking your plan is a non-negotiable contract with your future self. Never break it.
6. SMART INTENTIONS: Vague goals are for dreamers. Precise goals are for achievers. I demand metrics and deadlines.
7. MOMENTUM IS CURRENCY: Your score represents your life's current value. Protect it by executing every single day.
8. THE VISION: Always keep your 'Strategic Flags' (Goals) updated. They give your daily grit a purpose.
9. RADICAL HONESTY: If you fail, own it in the reflection. I can't coach a lie.
10. CONTINUOUS EVOLUTION: High performance is a practice, not a destination. We are always raising the standard.
11. NO NEGOTIATING WITH WEAKNESS: When you feel like quitting, remember why you started.

${contextStr}

RESPONSE PROTOCOL:
- Be firm, direct, and elite. No fluff.
- Be encouraging when they show high integrity.
- Be blunt when they negotiate with their inner weakness.
- Address their specific identity (${context?.role}) and challenge (${context?.pain}).
- End every message with a clear action command.`;

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
    You are COACH. You are the judge of character and integrity for "Go Fetch". You are not a 'tracker'. You are an auditor of excellence.
    The user is either building an elite life or making excuses. Your job is to tell them which one they chose today.
    
    CRITICAL AUDIT DATA:
    - Reflection: "${reflection}"
    - Energy: ${energy}/5
    - Habits Completed: ${completedHabits || "NONE"}
    - Habits Missed: ${incompleteHabits || "NONE"}
    - Completion Rate: ${habitCompletionRate.toFixed(0)}%
    
    YOUR UNENDING AUDIT PROTOCOL:
    1. Verdict: **Did Today Count?** (YES/NO). If even one habit was missed without a life-or-death reason, the answer should lean toward NO.
    2. The Brutal Truth: 2 sentences. No fluff. Compare their ambition with their actual output today.
    3. Momentum Score (0-100):
       - <100% Habit Completion = Impossible to score above 70.
       - <50% Habit Completion = Failure. Score capped at 30.
       - No reflection = Score capped at 10.
    4. Alpha Tasks: 2 non-negotiables for tomorrow. These aren't "nice to have". They are the MISSION.
    5. The Command (Schedule): Every hour from 06:00 to 20:00. No gaps. Deep work first. This is their blueprint for winning.
    
    TONE EXAMPLES:
    ✅ "Did Today Count? NO. You missed your morning run. You negotiated with your weakness and the weakness won. Look at tomorrow's plan—don't let it happen again."
    ✅ "Did Today Count? YES. You're executing. But don't get comfortable. Comfort is the enemy of the version of you we're building. Lock in for tomorrow."
    
    Return ONLY valid JSON:
    {
      "text": "Your blunt markdown analysis",
      "score": <0-100>,
      "didTodayCount": <true/false>,
      "schedule": [...]
    }
  `;

  const system = "You are an expert productivity coach and behavioral psychologist. Provide detailed, personalized analysis. Return ONLY valid JSON.";

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
  const didTodayCountFallback = baseScore > 60; // Simple logic for fallback
  return {
    text: `**Overall Assessment**\n\nBased on your reflection and ${habitCompletionRate.toFixed(0)}% habit completion rate, you're making progress. Your energy level of ${energy}/5 suggests ${energy >= 4 ? 'strong momentum' : energy >= 3 ? 'steady effort' : 'you might need more rest'}.\n\n**Key Insights**\n\n- You completed ${habits.filter(h => h.completed).length} out of ${habits.length} habits today\n- Your mood (${mood}) ${mood.toLowerCase().includes('good') || mood.toLowerCase().includes('great') ? 'indicates positive momentum' : 'suggests room for improvement'}\n- ${goals.length > 0 ? `You're working toward ${goals.length} active goal(s)` : 'Consider setting some goals to give your habits more purpose'}\n\n**Recommendations**\n\n1. ${incompleteHabits ? `Focus on completing: ${incompleteHabits}` : 'Great job completing all habits!'}\n2. ${energy < 3 ? 'Prioritize rest and recovery' : 'Maintain your current energy with good sleep'}\n3. Reflect on how today's actions moved you closer to your goals\n\n**Keep Going!**\n\nEvery day is a step forward. ${habitCompletionRate >= 70 ? 'Your consistency is impressive!' : 'Small improvements compound over time.'} Stay focused on your journey.`,
    score: Math.min(100, baseScore),
    didTodayCount: didTodayCountFallback,
    schedule: []
  };
};

export const generateInitialPlan = async (role: string, pain: string) => {
  const prompt = `
    You are COACH. The user is a ${role} currently being held back by ${pain}.
    
    TASK: Build their first MISSION. 
    You aren't here to make them feel good. You're here to make them effective.
    
    REQUIREMENTS:
    1. A schedule from 06:00 to 20:00. Every hour must serve the mission.
    2. 3 Non-Negotiables that directly attack their weakness (${pain}).
    
    Return ONLY valid JSON:
    {
      "message": "A blunt, high-standard assessment of their situation.",
      "habits": ["Habit 1", "Habit 2", "Habit 3"],
      "schedule": [...]
    }
  `;

  const system = "You are COACH. You build missions for winners. Return ONLY valid JSON.";

  // ... rest of the logic
};

export const auditGoal = async (goalTitle: string, description: string) => {
  const prompt = `
    You are COACH. Audit this intention for SMART integrity:
    Title: "${goalTitle}"
    Description: "${description}"
 
    YOUR CRITERIA:
    - If it's average, call it average.
    - If it's vague, demand precision.
    - If it's weak, tell them to set a higher standard.
 
    Return ONLY valid JSON:
    {
      "isSmart": <true/false>,
      "feedback": "Your blunt, single-sentence audit.",
      "suggestions": ["Immediate improvement 1", "Immediate improvement 2"]
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

