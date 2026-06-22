import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Lock, MapPin, Sparkles } from 'lucide-react';
import { TeaData } from '../types';
import TeaStamp from './TeaStamp';

interface TeaSelectionProps {
  teas: TeaData[];
  unlockedTeas: string[];
  onSelect: (id: string) => void;
  onCollection: () => void;
}

export default function TeaSelection({ teas, unlockedTeas, onSelect, onCollection }: TeaSelectionProps) {
  const [localSelectedId, setLocalSelectedId] = useState<string | null>(null);
  const completionPercentage = (unlockedTeas.length / teas.length) * 100;

  return (
    <div className="h-full p-6 flex flex-col">
      {/* Header Section */}
      <header className="flex justify-between items-end mb-4 shrink-0">
        <div>
          <h1 className="text-4xl font-light tracking-tighter mb-2 font-serif">Tea Journey</h1>
          <p className="text-brand-accent text-sm italic tracking-[0.2em] uppercase font-sans font-medium">
            Explore the Five Great Traditions
          </p>
        </div>
        <div className="text-right border-l border-brand-border pl-8">
          <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-3 font-bold font-sans">Ritual Mastery</div>
          <div className="flex items-center gap-6">
            <span className="text-3xl font-light font-serif">
              0{unlockedTeas.length} <span className="text-sm text-gray-300">/ 0{teas.length}</span>
            </span>
            <div className="w-56 h-2 bg-brand-border rounded-full overflow-hidden shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${completionPercentage}%` }}
                className="h-full bg-brand-green shadow-[0_0_10px_rgba(74,93,78,0.3)]" 
              />
            </div>
          </div>
        </div>
      </header>

      {/* Tea Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 overflow-y-auto pr-2 pb-6 custom-scrollbar">
        {teas.map((tea, index) => {
          const isSelected = localSelectedId === tea.id;
          
          return (
            <motion.div
              key={tea.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setLocalSelectedId(tea.id)}
              className={`
                group px-4 py-8 flex flex-col relative cursor-pointer border transition-all duration-500 hover:shadow-2xl hover:-translate-y-1
                ${isSelected 
                  ? 'bg-brand-green text-white border-brand-green shadow-xl ring-4 ring-brand-green/20' 
                  : 'bg-white border-brand-border hover:bg-brand-sidebar'}
              `}
            >
              {/* Character Watermark */}
              <div className={`absolute top-0 right-0 p-6 opacity-[0.07] select-none pointer-events-none transition-transform group-hover:scale-125 duration-1000 ${isSelected ? 'text-white !opacity-20' : 'group-hover:text-brand-green'}`}>
                <div className="text-8xl font-serif font-bold whitespace-nowrap">
                  {tea.category === 'Green' && '绿茶'}
                  {tea.category === 'White' && '白茶'}
                  {tea.category === 'Oolong' && '乌龙'}
                  {tea.category === 'Red' && '红茶'}
                  {tea.category === 'Dark' && '黑茶'}
                </div>
              </div>

              <span className={`text-[11px] font-bold tracking-[0.2em] uppercase mb-2 font-sans transition-colors ${isSelected ? 'text-green-100' : 'text-brand-accent'}`}>
                {tea.category} · {tea.origin.split(',')[0]}
              </span>
              
              <h2 className={`text-xl font-medium mb-0 font-serif transition-colors ${isSelected ? 'text-white' : 'text-brand-text'}`}>
                {tea.chineseName}
              </h2>
              
              <p className={`text-xs mb-2 font-light italic transition-colors ${isSelected ? 'text-green-50' : 'text-gray-500'}`}>
                {tea.englishName}
              </p>

              {/* Tea Image Icon (Background) */}
              <div className="absolute top-[60%] -translate-y-1/2 right-2 w-32 h-32 opacity-10 group-hover:opacity-20 transition-all duration-1000 pointer-events-none z-0 overflow-hidden">
                <motion.img 
                  src={tea.cardImage || tea.heroImage} 
                  alt={tea.englishName} 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  animate={{ 
                    rotate: isSelected ? [0, 5, 0] : 0,
                    scale: isSelected ? 1.1 : 1
                  }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                <p className={`text-[13px] leading-relaxed flex-1 font-light transition-colors ${isSelected ? 'text-white/90' : 'text-gray-600'} pr-16`}>
                  {tea.description}
                </p>
              </div>

              <AnimatePresence>
                {isSelected && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(tea.id);
                    }}
                    className="mt-4 w-full py-2.5 bg-white text-brand-green text-[10px] font-bold tracking-[0.3em] uppercase rounded-sm shadow-xl hover:bg-gray-50 transition-all active:scale-95"
                  >
                    Enter Ceremony
                  </motion.button>
                )}
              </AnimatePresence>

              {!isSelected && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-[10px] font-bold text-brand-accent tracking-[0.2em] group-hover:text-brand-green transition-transform group-hover:translate-x-2">
                    SELECT CEREMONY →
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress Footer */}
      <footer className="mt-4 pt-4 border-t border-brand-border flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="hidden sm:block">
            <span className="text-[9px] text-gray-400 font-bold tracking-[0.3em] uppercase font-sans">Achieved Seals</span>
          </div>
          <div className="flex gap-4">
            {teas.map((tea, i) => {
              const unlocked = unlockedTeas.includes(tea.id);
              return (
                <div 
                  key={tea.id}
                  className={`
                    w-12 h-12 flex items-center justify-center p-0 rounded-sm transform transition-all duration-700 overflow-hidden
                    ${unlocked 
                      ? `bg-white shadow-xl border border-brand-accent/10 ${i % 2 === 0 ? '-rotate-6' : 'rotate-6'} scale-110` 
                      : 'bg-brand-sidebar/40 opacity-10 border border-dashed border-brand-border'}
                  `}
                >
                  <div className="w-full h-full relative">
                    {unlocked ? (
                      <img 
                        src={tea.stampIllustration} 
                        alt={tea.englishName}
                        className="w-full h-full object-cover scale-[1.1]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full scale-[1.35]">
                        <TeaStamp category={tea.category} isUnlocked={unlocked} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-8">
          <button 
            onClick={onCollection}
            className="px-6 py-3 bg-brand-text text-white text-[10px] uppercase font-bold tracking-[0.2em] hover:bg-black transition-all font-sans active:scale-95 shadow-xl"
          >
            History Board
          </button>
        </div>
      </footer>
    </div>
  );
}
