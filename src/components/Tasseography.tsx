import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, RefreshCw, Info, ArrowLeft } from 'lucide-react';
import { DIVINATIONS } from '../constants';

interface TasseographyProps {
  onBack: () => void;
}

interface LeafPattern {
  id: number;
  x: number;
  y: number;
  rotate: number;
  scale: number;
  opacity: number;
}

export default function Tasseography({ onBack }: TasseographyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reading, setReading] = useState<string | null>(null);
  const [leaves, setLeaves] = useState<LeafPattern[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const generateLeaves = () => {
    const count = Math.floor(Math.random() * 15) + 20; 
    const newLeaves: LeafPattern[] = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 110;
      newLeaves.push({
        id: i,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        rotate: Math.random() * 360,
        scale: 0.5 + Math.random() * 0.8,
        opacity: 0.5 + Math.random() * 0.5
      });
    }
    return newLeaves;
  };

  const openCup = () => {
    if (isThinking) return;

    if (isOpen) {
      setIsOpen(false);
      setReading(null);
      setLeaves([]);
      setTimeout(() => {
        startThinking();
      }, 750);
    } else {
      startThinking();
    }
  };

  const startThinking = () => {
    setIsThinking(true);
    setTimeout(() => {
      setLeaves(generateLeaves());
      const randomIndex = Math.floor(Math.random() * DIVINATIONS.length);
      setReading(DIVINATIONS[randomIndex]);
      setIsOpen(true);
      setIsThinking(false);
    }, 600);
  };

  return (
    <div className="h-full flex flex-col bg-brand-cream relative overflow-hidden font-serif">
      {/* Background Zen Pattern removed */}

      <div className="relative z-10 flex flex-col h-full">
        {/* Header matching TeaBaiXi style */}
        <header className="p-4 md:p-6 border-b border-brand-border flex items-center justify-between bg-white/40 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBack}
              className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center hover:bg-white transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-brand-text" />
            </button>
            <div className="space-y-0.5 text-left">
              <h2 className="text-2xl font-light italic tracking-tight">TASSEOGRAPHY</h2>
              <p className="text-[9px] uppercase tracking-[0.3em] text-brand-accent font-bold font-sans">Traditional Tasseography · 茶占卜</p>
            </div>
          </div>
          <button 
            onClick={() => setShowInfo(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-brand-accent/30 bg-white/40 text-[10px] font-bold uppercase tracking-widest text-brand-accent hover:bg-brand-accent hover:text-white transition-all shadow-sm active:scale-95"
          >
            <Info className="w-4 h-4" /> The History
          </button>
        </header>

        {/* Combined Interaction and Result Area matching TeaBaiXi structure */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 gap-8 md:gap-12">
          {/* Left Spacer to match TeaBaiXi controls width */}
          <div className="hidden lg:block w-16" />

          {/* The Teacup Area - Center */}
          <div className="relative group shrink-0 scale-90 md:scale-100">
             <div
               onClick={openCup}
               className={`
                 relative w-64 h-64 md:w-[22rem] md:h-[22rem] lg:w-[28rem] lg:h-[28rem] rounded-full bg-white shadow-[0_30px_60px_-12px_rgba(0,0,0,0.12)]
                 flex items-center justify-center overflow-hidden border-[10px] md:border-[14px] border-gray-100 transition-all duration-1000
                 ${isThinking ? 'cursor-wait scale-[1.02]' : 'cursor-pointer'}
                 ${isOpen ? 'scale-105' : 'hover:scale-[1.01] active:scale-[0.99]'}
               `}
             >
                {/* Cup Interior Ridge */}
                <div className="absolute inset-4 md:inset-6 rounded-full border-2 border-gray-200/20 pointer-events-none shadow-inner" />

                {/* Tea Liquor Surface */}
                <div className="absolute inset-6 md:inset-8 rounded-full bg-amber-500/10 shadow-[inner_0_0_40px_rgba(166,124,82,0.12)] flex items-center justify-center overflow-hidden">
                  <div className="absolute top-4 left-1/4 w-32 h-8 md:w-48 md:h-12 bg-white/20 blur-xl md:blur-2xl rotate-[-45deg]" />
                  
                  <AnimatePresence>
                    {leaves.map((leaf) => (
                      <motion.div
                        key={leaf.id}
                        initial={{ opacity: 0, scale: 0, rotate: leaf.rotate }}
                        animate={{ 
                          opacity: leaf.opacity, 
                          scale: leaf.scale, 
                          x: leaf.x, 
                          y: leaf.y,
                          rotate: leaf.rotate
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ 
                          duration: 0.6, 
                          delay: leaf.id * 0.015
                        }}
                        className="absolute w-[2px] md:w-[3px] h-10 md:h-14 bg-brand-green/80 blur-[0.2px]"
                        style={{ borderRadius: '100% 10% 100% 10%' }}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {/* The Lid (Animated) */}
                <motion.div
                  initial={false}
                  animate={
                    isOpen 
                      ? { x: 300, y: -40, opacity: 0, rotate: 20, scale: 0.8 } 
                      : isThinking 
                        ? { x: [0, -1, 1, -1, 1, 0], y: [0, 1, -1, 1, -1, 0], scale: 1.01 }
                        : { x: 0, y: 0, opacity: 1, rotate: 0 }
                  }
                  transition={
                    isOpen 
                      ? { duration: 1, ease: "circOut" } 
                      : isThinking
                        ? { duration: 0.2, repeat: Infinity, ease: "linear" }
                        : { duration: 1 }
                  }
                  className="absolute inset-2 rounded-full bg-white shadow-2xl z-40 flex items-center justify-center border-[4px] border-gray-50"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-50 border border-gray-200 shadow-inner flex items-center justify-center">
                     <motion.div 
                      animate={isThinking ? { scale: [1, 1.2, 1], backgroundColor: ['transparent', '#A67C52', 'transparent'] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 ${isThinking ? 'border-brand-accent' : 'border-brand-accent/20'}`}
                     />
                  </div>
                  <div className="absolute inset-10 rounded-full border-2 border-dashed border-gray-100" />
                  <div className="absolute bottom-12 md:bottom-16 text-[8px] md:text-[9px] font-extrabold text-gray-300 uppercase tracking-[0.2em] pointer-events-none">
                    {isThinking ? 'Reading Fate' : (isOpen ? '' : 'Tap to start')}
                  </div>
                </motion.div>
             </div>
             <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 md:w-56 h-4 md:h-6 bg-black/5 blur-2xl rounded-full" />
          </div>

          {/* Left Panel Context for Tasseography (Result Panel moved to be integrated or right) */}
          {/* I'll put the result panel in the middle area or as a 4th element, but matching TeaBaiXi's 3 column feel */}
          <div className="w-56 md:w-72 lg:w-80 space-y-6 md:space-y-10 shrink-0">
             <div className="flex flex-col items-center md:items-start h-48 md:h-64 justify-center">
               <AnimatePresence mode="wait">
                 {!reading && !isThinking && (
                   <motion.div
                     key="prompt"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="text-brand-text/30 text-sm md:text-base italic font-serif text-center md:text-left"
                   >
                     "Seek the whisper in the leaves..."
                   </motion.div>
                 )}
                 {isThinking && (
                   <motion.div
                     key="thinking"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="text-brand-accent/40 text-xs md:text-sm tracking-[0.3em] uppercase font-sans animate-pulse"
                   >
                     Consulting the Oracle
                   </motion.div>
                 )}
                 {reading && isOpen && (
                   <motion.div
                     key="result"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     transition={{ duration: 0.8 }}
                     className="space-y-6 md:space-y-8 flex flex-col items-center md:items-start text-center md:text-left"
                   >
                     <div className="w-12 md:w-16 h-[1px] bg-brand-accent/30" />
                     <p className="text-2xl md:text-3xl lg:text-4xl font-light text-brand-text italic leading-tight font-serif tracking-tight">
                       "{reading}"
                     </p>
                     <button 
                      onClick={openCup}
                      className="group py-3 px-8 rounded-full border border-brand-accent text-[9px] md:text-[10px] uppercase font-bold tracking-[0.2em] text-brand-accent hover:bg-brand-accent hover:text-white transition-all font-sans flex items-center gap-3 bg-white/30 backdrop-blur-sm shadow-lg"
                    >
                       <RefreshCw className="w-3 h-4 group-hover:rotate-180 transition-transform duration-700" /> Seek Further Counsel
                     </button>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>

             <div className="space-y-6">
                <div className="space-y-2 md:space-y-4">
                  <h4 className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-brand-text/40">The Method</h4>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed italic text-left">
                    "Focus your intent upon the basin. The patterns are echoes of fate."
                  </p>
                </div>
                
                <div className="space-y-2 md:space-y-4">
                  <h4 className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-brand-text/40">Common Symbols</h4>
                  <ul className="space-y-1 md:space-y-2 text-[10px] md:text-xs text-gray-500 italic text-left">
                    <li>• Bird: Auspicious news arriving</li>
                    <li>• Circle: Completion of a cycle</li>
                    <li>• Mountain: A journey of growth</li>
                    <li>• Leaf: New life or beginnings</li>
                  </ul>
                </div>
             </div>
          </div>
        </div>

        <div className="h-4" />
      </div>

      {/* Info Modal matching TeaBaiXi style */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setShowInfo(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-brand-cream max-w-xl w-full p-12 border border-brand-border shadow-2xl relative overflow-hidden rounded-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent" />
              <button 
                onClick={() => setShowInfo(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-brand-text"
              >
                ✕
              </button>
              
              <div className="space-y-8">
                <div className="space-y-2">
                  <h3 className="text-4xl font-serif italic text-brand-text text-left">The Art of Tasseography</h3>
                  <div className="w-16 h-px bg-brand-accent" />
                </div>
                
                <div className="space-y-4 text-brand-text/70 text-sm leading-relaxed text-left">
                  <p>
                    <strong>Tasseography (茶占卜)</strong> is an ancient method of divination that interprets patterns in tea leaves. Though popular in Europe since the 17th century, its roots trace back to various traditions of reading patterns in sediment.
                  </p>
                  <p>
                    In the Chinese tradition, it is closely linked to the contemplative nature of tea drinking. As the tea is consumed, the remaining leaves settle at the bottom of the cup, forming symbols and shapes that suggest whispers of destiny.
                  </p>
                  <p>
                    It is an art of intuition and mindfulness. Rather than strict prediction, it invites the seeker to pause, reflect, and find personal meaning in the ephemeral remains of the brew.
                  </p>
                </div>

                <div className="pt-8 flex justify-center text-[10px] font-bold uppercase tracking-[0.5em] text-brand-accent">
                  · Seek the Truth in the Leaves ·
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
