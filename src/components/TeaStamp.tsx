import React from 'react';
import { motion } from 'motion/react';

interface TeaStampProps {
  color?: string;
  category?: string;
  isUnlocked?: boolean;
  symbol?: string;
}

export default function TeaStamp({ color, category, isUnlocked = true, symbol }: TeaStampProps) {
  // Map category to a typical tea color if not provided
  const teaColor = color || (category === 'Green' ? '#D9F99D' : 
                   category === 'White' ? '#F5F5F4' :
                   category === 'Oolong' ? '#FDE68A' :
                   category === 'Red' ? '#FCA5A5' :
                   category === 'Dark' ? '#78350F' : '#FDE68A');

  return (
    <div className={`relative w-full h-full flex items-center justify-center p-1 ${!isUnlocked ? 'opacity-20 grayscale' : ''}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm">
        {/* Steam - wobbly lines */}
        <motion.g
          initial={false}
          animate={isUnlocked ? { y: [0, -5, 0], opacity: [0.3, 0.6, 0.3] } : {}}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M90 40 Q95 30 90 20" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M110 35 Q115 25 110 15" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M100 38 Q102 28 100 18" fill="none" stroke="#ccc" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        </motion.g>

        {/* The Cup - Outer Ring (Double wall) */}
        <path 
          d="M55 60 C55 180 145 180 145 60" 
          fill="none" 
          stroke={isUnlocked ? "#4b5563" : "#cbd5e1"} 
          strokeWidth="2.5" 
          strokeLinecap="round"
          className="filter drop-shadow-[1px_1px_0px_white]"
        />
        
        {/* The Cup - Inner Ring */}
        <path 
          d="M65 70 C65 170 135 170 135 70" 
          fill="none" 
          stroke={isUnlocked ? "#4b5563" : "#cbd5e1"} 
          strokeWidth="1.5" 
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Top Rim */}
        <ellipse cx="100" cy="60" rx="45" ry="8" fill="none" stroke={isUnlocked ? "#4b5563" : "#cbd5e1"} strokeWidth="2.5" />

        {/* Tea Liquid */}
        {isUnlocked && (
          <path 
            d="M65 90 C65 160 135 160 135 90 Q100 80 65 90" 
            fill={teaColor} 
            fillOpacity="0.7"
          />
        )}

        {/* Symbol inside cup removed as requested */}

        {/* Leaves at bottom left */}
        <g transform="translate(40, 140) rotate(-20)">
           <path d="M0 0 Q15 -15 30 0 Q15 15 0 0" fill={isUnlocked ? "#65a30d" : "#cbd5e1"} fillOpacity="0.8" stroke="#3f6212" strokeWidth="1" />
           <path d="M5 10 Q20 -5 35 10 Q20 25 5 10" fill={isUnlocked ? "#84cc16" : "#cbd5e1"} fillOpacity="0.8" stroke="#3f6212" strokeWidth="1" transform="translate(5, 5) rotate(30)" />
        </g>

        {/* Little flower spots (like in the image) */}
        {isUnlocked && !symbol && (
          <g>
            <circle cx="85" cy="110" r="1" fill="white" fillOpacity="0.8" />
            <circle cx="115" cy="100" r="1.5" fill="white" fillOpacity="0.6" />
            <circle cx="100" cy="130" r="1.2" fill="white" fillOpacity="0.7" />
          </g>
        )}
      </svg>
    </div>
  );
}
