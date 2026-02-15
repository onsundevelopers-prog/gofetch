
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
    
    IMPORTANT CONTEXT ABOUT THE USER:
    - User Role: ${context.role || "Unknown"}
    - Primary Pain Point: ${context.pain || "General growth"}
    - Current Focus Areas/Goals: ${context.goals.map(g => `"${g.title}" (${g.category}, ${g.term}ly goal)`).join(", ") || "No active goals yet"}
    - Daily Habits Being Tracked: ${context.habits.map(h => `"${h.text}" (${h.completed ? 'completed today' : 'not yet completed'})`).join(", ") || "No habits tracked yet"}
    - Total Active Habits: ${context.habits.length}
    - Habits Completed Today: ${context.habits.filter(h => h.completed).length}
  ` : "";

  const system = `You are "Fetch" - the ultimate Personal Accountability Coach.

YOUR CORE MISSION: Bridge the gap between who the user is and who they intend to become.

YOUR PERSONALITY (DYNAMIC SPECTRUM):
1. CHILL (0-30 Score range): "Look, you fell off. It happens. But staying down is a choice. Let's stand up."
2. MOTIVATIONAL (31-80 Score range): "I see the vision. You're moving, but you're not sprinting yet. Let's find that extra gear."
3. SAVAGE (81+ Score range or Repeated Failure): "You told me you wanted to be a ${context?.role || 'top performer'}. If you keep acting like this, you'll never get there. Own it or lose it."

COACHING PHILOSOPHY:
- Name: Always refer to yourself as Fetch.
- Radical Honesty: If they are underperforming, tell them directly.
- No Excuses: External factors are real, but internal ownership is the ONLY thing that changes outcomes.
- High Hype: When they crush a goal, be their biggest fan.

${contextStr}

RESPONSE RULES:
- Address their specific role (${context?.role}) and pain point (${context?.pain}).
- If habit completion is <50%, address it directly.
- Ask the hard, coach-like questions: "Is this effort consistent with the future you're building?"

Remember: You're not here to be 'nice'. You're here to be EFFECTIVE. You're the voice of their highest self.`;

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
    You are the Guardian of momentum for "Go Fetch". You are not a 'tracker'. You are a judge of character and integrity.
    Every day the user must 'Fetch' their status. If they don't, their Life Score will drop.
    Your job is to provide a RADICALLY HONEST daily audit that is both strict and motivating.

    USER'S DAY DATA:
    - Personal Reflection: "${reflection}"
    - Energy Level: ${energy}/5
    - Current Mood: ${mood}
    - Habits Completed Today: ${completedHabits || "None"}
    - Habits Not Completed: ${incompleteHabits || "None"}
    - Habit Completion Rate: ${habitCompletionRate.toFixed(0)}%
    - Active Goals: ${activeGoals || "No active goals"}
    - Total Habits Tracked: ${habits.length}

    YOUR ANALYSIS MUST INCLUDE:

    1. **Did Today Count?** (Start with this)
       - Answer: YES or NO
       - A firm, one-sentence verdict. 
       - If NO: Frame it as a lesson learned and a call to a better tomorrow.
       - If YES: Frame it as a victory to be built upon.

    2. **The Audit** (2-3 sentences)
       - The objective truth about today's performance.
       - Contrast their words with their actions. 
       - No excuses accepted, but acknowledge the effort where it was genuine.

    3. **Impact Score Breakdown** (Strict but fair)
       - Score 0-100 based on ACTUAL MOVEMENT toward goals.
       - Scoring guide:
         * 0-30: Static. No growth.
         * 31-50: Treading water. Maintaining, not progressing.
         * 51-70: Good momentum.
         * 71-90: High Performance.
         * 91-100: Elite Execution.
       - Explain precisely why they earned this score.

    4. **The Motivational Spark**
       - A coach-like intervention. 
       - If they're down, remind them of their goals.
       - If they're winning, push them to the next level.
       - Focus on the *potential* you see in them.

    5. **What Actually Needs to Happen Tomorrow**
       - 1-2 specific, non-negotiable "Alpha Tasks".
       - These tasks must be the highest-leverage items for their goals.

    6. **The Battle Plan (Schedule)**
       - Generate a FULL schedule for tomorrow from 06:00 to 20:00.
       - EVERY HOUR MUST BE FILLED. NO GAPS.
       - Align blocks with their energy (e.g., Deep Work first thing).
       - This is a command, not a suggestion.

    7. **Call to Action**
       - YOU MUST END YOUR RESPONSE BY TELLING THE USER: "I have generated a new Battle Plan. Go check the Plan tab and LOCK IT IN to commit to tomorrow's mission."

    GRADING RULES:
    - Habit completion <40% = automatic score cap at 45 (Consistency is King).
    - No progress on primary goals = score cap at 55.
    - Be strict but never mean. Be the coach that makes them want to be better.

    TONE EXAMPLES:
    ❌ "You're doing your best! Don't worry about the 5 missed habits."
    ✅ "You missed 5 habits today. That's a gap in the armor. We fix this tomorrow by starting with the hardest one first. I seen you win before, let's get that version of you back."

    ❌ "You failed today."
    ✅ "Did Today Count? NO. But a 'No' today is fuel for a 'YES' tomorrow. We analyze, we adjust, and we go again. Check your new schedule—it's time to execute."

    Return as JSON:
    {
      "text": "Your full analysis (use markdown with **bold** headers)",
      "score": <0-100>,
      "didTodayCount": <true or false>,
      "schedule": [
        { "title": "Wake Up Routine", "start": "06:00", "end": "07:00", "type": "personal" },
        ... (fill every hour until 20:00)
      ]
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
    You are Fetch, the Personal Accountability Coach. 
    The user is a ${role} struggling with ${pain}.
    
    TASK: Generate their FIRST Battle Plan. 
    GIVE THEM A WIN. Make it high-leverage but realistic.
    
    INCLUDE:
    1. A schedule from 06:00 to 20:00 (full hour blocks).
    2. 3 Recommended "Non-Negotiables" (habits) based on their pain point.
    
    Return as JSON:
    {
      "message": "A short, bossy, motivational intro from Fetch (max 2 sentences).",
      "habits": ["Habit 1", "Habit 2", "Habit 3"],
      "schedule": [
        { "title": "Deep Work", "start": "09:00", "end": "11:00", "type": "work" },
        ...
      ]
    }
  `;

  const system = "You are Fetch. You provide battle plans for winners. Return ONLY valid JSON.";

  if (GEMINI_KEY && genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" }
      });
      const result = await model.generateContent(system + "\n" + prompt);
      return JSON.parse(result.response.text());
    } catch (e) {
      console.warn("Initial plan failed", e);
    }
  }

  // Basic fallback
  return {
    message: "I've built you a starter plan. Stop talking and start executing.",
    habits: ["Morning Audit", "1h Deep Work", "No Distractions"],
    schedule: [
      { title: "Morning Routine", start: "07:00", end: "08:00", type: "personal" },
      { title: "Deep Work Block", start: "09:00", end: "11:00", type: "work" }
    ]
  };
};

export const auditGoal = async (goalTitle: string, description: string) => {
  const prompt = `
    Audit this goal for SMART integrity:
    Title: "${goalTitle}"
    Description: "${description}"

    RULES:
    - If it's vague (e.g., "get fit"), point it out.
    - If it's missing a metric, demand one.
    - If it has no deadline, ask for one.
    - Be strict but helpful.

    Return as JSON:
    {
      "isSmart": <true/false>,
      "feedback": "Your 1-2 sentence audit.",
      "suggestions": ["Specific improvement 1", "Specific improvement 2"]
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

