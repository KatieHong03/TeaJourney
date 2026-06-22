import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Info, Trophy, Sparkles } from 'lucide-react';

interface WelcomeProps {
  onBegin: () => void;
  onCollection: () => void;
  onAbout: () => void;
}

export default function Welcome({ onBegin, onCollection, onAbout }: WelcomeProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleStart = () => {
    setIsOpening(true);
    // Delay to allow animation to play before transitioning
    setTimeout(() => {
      onBegin();
    }, 800);
  };

  return (
    <div className="relative h-full flex flex-col items-center justify-center overflow-hidden bg-brand-cream font-serif p-6">
      {/* Background Aesthetic - Calming Mountains */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden flex items-center justify-center">
         {/* Large calligraphy character background */}
         <div className="text-[70vw] md:text-[50vw] font-serif select-none opacity-[0.03] text-brand-text leading-none">
           茶
         </div>
      </div>
      
      <div className="relative z-10 w-full flex flex-col items-center justify-center flex-1 max-w-4xl mx-auto">
        <div 
          className="relative flex flex-col items-center cursor-pointer group w-full" 
          onClick={handleStart}
        >
          {/* Teapot Display Area */}
          <div className="mb-12 relative flex justify-center w-full">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="w-full max-w-[500px] aspect-[5/4] relative flex items-center justify-center p-4"
            >
              <div className="w-full h-full relative">
                {/* Cross-fading images to avoid 'separate screen' feel */}
                <motion.img
                  src="/gaiwan_lid_closed.png"
                  alt="Gaiwan"
                  initial={false}
                  animate={{ 
                    opacity: isOpening ? 0 : 1,
                    scale: 1
                  }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(74,55,40,0.15)]"
                />
                <motion.img
                  src="/gaiwan_green_leaves_lid_open.png"
                  alt="Gaiwan Open"
                  initial={false}
                  animate={{ 
                    opacity: isOpening ? 1 : 0,
                    scale: isOpening ? 1.3 : 1.2,
                    x: 8,
                    y: 8
                  }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(74,55,40,0.25)]"
                />
              </div>

              {/* Steam Effect when opening */}
              <AnimatePresence>
                {isOpening && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-[10%] left-1/2 -translate-x-1/2 flex gap-2 pointer-events-none"
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          y: [-20, -280], 
                          x: [0, (i - 2) * 60],
                          opacity: [0, 0.4, 0],
                          scale: [1, 4]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                        className="absolute w-20 h-20 bg-white/20 rounded-full blur-3xl"
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpening ? 0 : 1 }}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-[9px] font-bold uppercase tracking-[0.8em] text-brand-accent animate-pulse">
                  Touch to Steep
                </span>
                <div className="w-px h-6 bg-brand-accent/20" />
              </div>
            </motion.div>
          </div>

          <motion.div 
            animate={{ 
              opacity: 1, // Keep title visible, App.tsx handles the final fade out
              y: 0,
              filter: 'blur(0px)'
            }}
            className="text-center space-y-4 md:space-y-6"
          >
            <h1 className="text-6xl md:text-8xl font-serif font-normal text-brand-text tracking-tight leading-none">
              Tea <span className="relative inline-block">
                Journey
                <div className="absolute inset-x-0 -bottom-2 flex justify-center">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="h-[1px] bg-brand-accent/40" 
                  />
                </div>
              </span>
            </h1>
            <p className="text-brand-accent font-sans text-[9px] md:text-[10px] italic uppercase tracking-[0.4em] font-medium max-w-2xl mx-auto leading-relaxed opacity-80">
              LEARN, BREW, AND EXPLORE THE STORIES BEHIND CHINESE TEA
            </p>
          </motion.div>
        </div>
      </div>

      {/* Secondary Actions - Subtle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpening ? 0 : 0.6 }}
        className="relative z-20 pb-12 pt-6 flex items-center gap-12 shrink-0 transition-opacity duration-300"
      >
        <button onClick={onCollection} className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-text/60 hover:text-brand-accent transition-colors">
          Collections
        </button>
        <div className="w-px h-4 bg-brand-border" />
        <button onClick={onAbout} className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-text/60 hover:text-brand-accent transition-colors">
          The History
        </button>
      </motion.div>
    </div>
  );
}
