import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Lock } from 'lucide-react';
import { getGeminiChatResponse } from '../services/geminiService';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

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
      content: "Hello! I'm your AI productivity coach. How can I help you today?"
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
      const finalResponse = response?.text || "I'm here to help. Could you rephrase that?";

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
      const errorMsg = { _id: `err-${Date.now()}`, role: 'assistant', content: "I'm having trouble connecting. Please check your API keys and try again." };
      setLocalMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-24">
      {/* Header */}
      <header className="p-6 border-b border-[var(--border)] bg-white">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-light">Chat</h1>
          <p className="text-xs text-[var(--text-secondary)]">AI productivity coach</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-2xl mx-auto w-full">
        {messages.map((m: any, idx: number) => {
          const isUser = m.role === 'user';
          return (
            <div key={m._id || idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] px-4 py-3 rounded-lg text-sm leading-relaxed ${isUser
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-white border border-[var(--border)]'
                  }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-[var(--border)] px-4 py-3 rounded-lg text-sm text-[var(--text-secondary)]">
              Thinking...
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-[var(--border)] bg-white">
        <form onSubmit={handleSend} className="flex gap-3 max-w-2xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 input"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-12 h-12 rounded-lg bg-[var(--accent)] text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-30"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

    </div>
  );
};
