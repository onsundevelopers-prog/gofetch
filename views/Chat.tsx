import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Lock, SparklesBold as Sparkles } from '../lib/icons';
import { getGeminiChatResponse } from '../services/geminiService';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';
import { DogBuddy } from '../components/DogBuddy';

export const Chat: React.FC<{ user: any, goals: any[] }> = ({ user, goals }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isConvexSafe = !localStorage.getItem('force_guest_mode');

  // Local Chat Backup
  const [localMessages, setLocalMessages] = useState<any[]>(() => {
    const userId = user?.id || 'guest';
    const saved = localStorage.getItem(`chat_${userId}`);
    return saved ? JSON.parse(saved) : [{
      _id: 'welcome',
      role: 'assistant',
      content: "Woof! I'm Buddy, your space-flight wingman. How can I help you defy gravity today? 🐕🚀"
    }];
  });

  // Safe Convex integration
  const conversations = useQuery("messages:listConversations" as any, (user && !user.isGuest && isConvexSafe) ? { userId: user.id } : "skip");
  const currentConv = conversations?.[0];
  const convexMessages = useQuery("messages:getMessages" as any, currentConv ? { conversationId: currentConv._id } : "skip");

  const messages = useMemo(() => {
    if (user?.isGuest || !isConvexSafe) return localMessages;
    const serverMessages = convexMessages || [];
    const unsyncedMessages = localMessages.filter(lm =>
      !serverMessages.some(sm => sm.content === lm.content && sm.role === lm.role)
    );
    return [...serverMessages, ...unsyncedMessages];
  }, [user?.isGuest, isConvexSafe, localMessages, convexMessages]);

  const sendMessageMutation = useMutation("messages:sendMessage" as any);
  const createConversationMutation = useMutation("messages:createConversation" as any);

  const [localHabits] = useState<any[]>(() => {
    const userId = user?.id || 'guest';
    const saved = localStorage.getItem(`habits_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });
  const convexHabits = useQuery("tasks:listHabits" as any, (user && !user.isGuest && isConvexSafe) ? { userId: user.id } : "skip");
  const habits = (user?.isGuest || !isConvexSafe) ? localHabits : (convexHabits || []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading || !user) return;

    const userMsg = input;
    setInput('');
    setLoading(true);

    const newUserMsg = { _id: `temp-${Date.now()}`, role: 'user', content: userMsg };
    setLocalMessages(prev => [...prev, newUserMsg]);

    try {
      let resolvedConvId: string | null = null;
      if (!user.isGuest && isConvexSafe) {
        resolvedConvId = currentConv?._id;
        if (!resolvedConvId) {
          resolvedConvId = await createConversationMutation({ userId: user.id, title: "Chat" });
        }
        await sendMessageMutation({ conversationId: resolvedConvId, content: userMsg, role: "user", userId: user.id });
      }

      const historyItems = (Array.isArray(messages) ? messages : []).map((m: any) => ({ role: m.role, content: m.content }));
      const response = await getGeminiChatResponse(userMsg, historyItems, { goals: goals || [], habits: habits || [] });
      const finalResponse = response?.text || "I'm still learning the controls. Could you try that again, Buddy?";

      const aiMsg = { _id: `ai-${Date.now()}`, role: 'assistant', content: finalResponse };
      setLocalMessages(prev => {
        const updated = [...prev, aiMsg];
        localStorage.setItem(`chat_${user.id || 'guest'}`, JSON.stringify(updated));
        return updated;
      });

      if (!user.isGuest && isConvexSafe && resolvedConvId) {
        await sendMessageMutation({ conversationId: resolvedConvId, content: finalResponse, role: "assistant", userId: user.id });
      }

    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMsg = { _id: `err-${Date.now()}`, role: 'assistant', content: "Signal lost! Check our API keys and let's try again." };
      setLocalMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50/30">
      {/* Header */}
      <header className="p-8 bg-white border-b border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <DogBuddy mood={loading ? 'thinking' : 'happy'} size={48} />
          <div className="space-y-1">
            <h1 className="text-2xl font-serif text-[var(--text-primary)]">Orbit Chat</h1>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500/40">Communications with Buddy</p>
          </div>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
          <Sparkles size={18} />
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-2xl mx-auto w-full pb-32">
        {messages.map((m: any, idx: number) => {
          const isUser = m.role === 'user';
          return (
            <div key={m._id || idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div
                className={`max-w-[85%] px-6 py-4 rounded-[2rem] text-sm leading-relaxed shadow-sm ${isUser
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-white border border-gray-50 text-[var(--text-primary)] font-serif italic rounded-bl-none'
                  }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="max-w-[85%] px-6 py-4 rounded-[2rem] rounded-bl-none bg-white border border-gray-50 text-[var(--text-primary)] font-serif italic shadow-sm flex items-center gap-3">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-blue-500/40 rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-blue-500/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-blue-500/40 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-xs text-gray-400">Buddy is thinking...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
        <div className="max-w-2xl mx-auto w-full pointer-events-auto">
          <form onSubmit={handleSend} className="relative group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Buddy anything..."
              className="w-full bg-white border-2 border-gray-50 p-5 pr-16 rounded-[2.5rem] shadow-2xl shadow-blue-500/10 text-base font-serif italic focus:border-blue-500 outline-none transition-all placeholder:text-gray-200"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center hover:scale-105 transition-all disabled:opacity-30 shadow-lg shadow-blue-500/20"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
