
/**
 * AI Avatar Service
 * Provides aesthetic, personality-driven avatars for users.
 */

const AVATAR_OPTIONS = [
    "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Felix&backgroundColor=b6e3f4,c0aede,d1d4f9",
    "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Aneka&backgroundColor=b6e3f4,c0aede,d1d4f9",
    "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Milo&backgroundColor=ffd5dc,ffdfbf,ffda9e",
    "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Zoe&backgroundColor=ffd5dc,ffdfbf,ffda9e",
    "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Jasper&backgroundColor=d1d4f9,b6e3f4,c0aede"
];

export const generateAIAvatar = async (mood: string): Promise<string> => {
    // In a real app, this would use a generation API with the mood as a prompt.
    // For now, we return a high-quality aesthetic placeholder from the collection.
    const randomIndex = Math.floor(Math.random() * AVATAR_OPTIONS.length);
    return AVATAR_OPTIONS[randomIndex];
};
