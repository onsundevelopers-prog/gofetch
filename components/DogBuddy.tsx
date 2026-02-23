
import React from 'react';
import { motion } from 'framer-motion';

interface DogBuddyProps {
    mood?: 'happy' | 'thinking' | 'excited' | 'sleeping';
    size?: number;
    className?: string;
}

export const DogBuddy: React.FC<DogBuddyProps> = ({
    mood = 'happy',
    size = 200,
    className = ""
}) => {
    // Animation variants
    const headVariants = {
        happy: { y: [0, -5, 0], transition: { repeat: Infinity, duration: 2 } },
        excited: { y: [0, -15, 0], scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 0.5 } },
        thinking: { rotate: [0, -5, 5, 0], transition: { repeat: Infinity, duration: 3 } },
        sleeping: { y: [0, 2, 0], transition: { repeat: Infinity, duration: 4 } }
    };

    const earVariants = {
        happy: { rotate: [-20, -25, -20], transition: { repeat: Infinity, duration: 2 } },
        excited: { rotate: [-30, -10, -30], transition: { repeat: Infinity, duration: 0.4 } },
        thinking: { rotate: [-20, -15, -20], transition: { repeat: Infinity, duration: 1.5 } }
    };

    const tailVariants = {
        happy: { rotate: [0, 20, 0], transition: { repeat: Infinity, duration: 0.8 } },
        excited: { rotate: [0, 45, 0], transition: { repeat: Infinity, duration: 0.3 } },
        sleeping: { rotate: [0, 5, 0], transition: { repeat: Infinity, duration: 5 } }
    };

    const eyeVariants = {
        happy: { scaleY: [1, 1, 0.1, 1], transition: { repeat: Infinity, duration: 4, times: [0, 0.9, 0.95, 1] } },
        sleeping: { scaleY: 0.1 }
    };

    return (
        <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
            <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Tail */}
                <motion.ellipse
                    cx="250" cy="280" rx="25" ry="15" fill="#C4A574"
                    variants={tailVariants}
                    animate={mood}
                    style={{ originX: "240px", originY: "280px" }}
                />

                {/* Ears */}
                <motion.ellipse
                    cx="150" cy="140" rx="50" ry="80" fill="#C4A574"
                    variants={earVariants}
                    animate={mood}
                    style={{ originX: "150px", originY: "140px" }}
                />
                <motion.ellipse
                    cx="250" cy="140" rx="50" ry="80" fill="#C4A574"
                    variants={{
                        ...earVariants,
                        happy: { rotate: [20, 25, 20], transition: { repeat: Infinity, duration: 2 } },
                        excited: { rotate: [30, 10, 30], transition: { repeat: Infinity, duration: 0.4 } }
                    }}
                    animate={mood}
                    style={{ originX: "250px", originY: "140px" }}
                />

                {/* Body */}
                <motion.rect
                    x="160" y="260" width="80" height="60" rx="15" fill="#E8D4A8"
                    animate={mood === 'excited' ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                />

                {/* Head Group */}
                <motion.g variants={headVariants} animate={mood}>
                    {/* Head Shape */}
                    <rect x="140" y="120" width="120" height="140" rx="20" fill="#E8D4A8" />

                    {/* Snout */}
                    <rect x="180" y="200" width="40" height="30" rx="8" fill="#D4C19C" />
                    <ellipse cx="200" cy="215" rx="12" ry="10" fill="#8B7355" />

                    {/* Eyes */}
                    <motion.g variants={eyeVariants} animate={mood} style={{ originY: "170px" }}>
                        <ellipse cx="170" cy="170" rx="18" ry="22" fill="#000000" />
                        <circle cx="175" cy="165" r="6" fill="#FFFFFF" />

                        <ellipse cx="230" cy="170" rx="18" ry="22" fill="#000000" />
                        <circle cx="235" cy="165" r="6" fill="#FFFFFF" />
                    </motion.g>

                    {/* Mouth (Happy) */}
                    {mood !== 'sleeping' && (
                        <motion.path
                            d="M185 235C185 235 190 245 200 245C210 245 215 235 215 235"
                            stroke="#8B7355"
                            strokeWidth="3"
                            strokeLinecap="round"
                            animate={mood === 'excited' ? { d: "M180 235C180 235 190 260 200 260C210 260 220 235 220 235" } : {}}
                        />
                    )}
                </motion.g>

                {/* Paws */}
                <motion.ellipse
                    cx="175" cy="330" rx="15" ry="20" fill="#C4A574"
                    animate={mood === 'excited' ? { y: [0, -10, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 0.4 }}
                />
                <motion.ellipse
                    cx="225" cy="330" rx="15" ry="20" fill="#C4A574"
                    animate={mood === 'excited' ? { y: [0, -10, 0] } : {}}
                    transition={{ repeat: Infinity, duration: 0.4, delay: 0.2 }}
                />
            </svg>
        </div>
    );
};
