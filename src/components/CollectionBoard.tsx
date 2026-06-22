import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coffee, ArrowLeft, RotateCcw, X, Info, MapPin, Sparkles } from 'lucide-react';
import { TEAS } from '../constants';
import { TeaData } from '../types';
import TeaStamp from './TeaStamp';

interface CollectionBoardProps {
  unlockedTeas: string[];
  onClearJourney: () => void;
  onBack: () => void;
}

export default function CollectionBoard({ unlockedTeas, onClearJourney, onBack }: CollectionBoardProps) {
  const [selectedTea, setSelectedTea] = useState<TeaData | null>(null);

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleClear = () => {
    onClearJourney();
    setShowClearConfirm(false);
  };

  return (
    <div className="h-full p-6 md:p-8 flex flex-col font-serif relative overflow-hidden bg-brand-cream">
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-text/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-brand-cream p-8 rounded-2xl shadow-2xl border border-brand-border max-w-sm w-full text-center space-y-6"
            >
              <div className="flex justify-center">
                <RotateCcw className="w-12 h-12 text-brand-accent animate-spin-slow" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-serif text-brand-text">Clear Progress?</h3>
                <p className="text-xs text-gray-500 font-light leading-relaxed">
                  This will reset all your discovered tea wisdoms and achievements. This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-3 border border-brand-border rounded-xl text-[10px] uppercase font-bold tracking-widest text-brand-text hover:bg-white transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleClear}
                  className="flex-1 px-4 py-3 bg-brand-text text-brand-cream rounded-xl text-[10px] uppercase font-bold tracking-widest hover:bg-black transition-all"
                >
                  Clear All
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto w-full flex flex-col h-full space-y-4 relative z-10">
        <header className="space-y-4 border-b border-brand-border pb-4 shrink-0">
          <div className="flex items-center gap-5">
             <div className="w-12 h-12 border border-brand-accent rounded-full flex items-center justify-center text-brand-accent shadow-sm bg-white/50">
               <Coffee className="w-6 h-6" />
             </div>
             <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-accent font-sans">Ritual Achievement</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-brand-text tracking-tighter uppercase">Tea Collection</h2>
          <p className="text-gray-400 max-w-2xl font-light italic text-lg leading-relaxed">
            Every masterpiece began with a single cup. Track your mastery as you 
            discover the distinct traditions of Chinese tea culture.
          </p>
        </header>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 py-4 flex-1 overflow-y-auto custom-scrollbar">
          {TEAS.map((tea, index) => {
            const isUnlocked = unlockedTeas.includes(tea.id);
            
            return (
              <motion.div
                key={tea.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center gap-8"
                onClick={() => isUnlocked && setSelectedTea(tea)}
              >
                <div 
                  className={`
                    group relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center transition-all duration-1000
                    transform cursor-pointer
                    ${isUnlocked 
                      ? 'bg-white shadow-xl -rotate-1 hover:scale-105 active:scale-95' 
                      : 'bg-transparent border border-dashed border-brand-border opacity-30'}
                  `}
                >
                  {/* Decorative Border for the stamp box */}
                  <div className={`absolute inset-3 border ${isUnlocked ? 'border-brand-accent/20' : 'border-transparent'}`} />
                  
                  <div className="w-full h-full relative z-10 flex flex-col items-center justify-center p-3">
                    <div className="w-full h-full relative overflow-hidden">
                      {isUnlocked ? (
                        <img 
                          src={tea.stampIllustration} 
                          alt={tea.englishName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full scale-[1.1]">
                          <TeaStamp category={tea.category} isUnlocked={false} />
                        </div>
                      )}
                    </div>
                    {isUnlocked && (
                      <div className="absolute -bottom-1 -right-1 bg-brand-accent text-white py-1 px-2 text-[10px] md:text-xs font-bold uppercase tracking-widest -rotate-3 shadow-lg z-20">
                        {tea.chineseName.substring(tea.chineseName.length - 2)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <h4 className={`text-[11px] uppercase tracking-[0.2em] font-bold font-sans ${isUnlocked ? 'text-brand-text' : 'text-gray-300'}`}>
                    {isUnlocked ? tea.englishName : 'TBD Ceremony'}
                  </h4>
                  {isUnlocked && <p className="text-[9px] text-brand-accent font-bold uppercase tracking-widest opacity-40 group-hover:opacity-100 transition-opacity">REVEAL WISDOM</p>}
                </div>
              </motion.div>
            );
          })}
        </div>

        {selectedTea && (
          <AnimatePresence>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-brand-text/40 backdrop-blur-sm"
              onClick={() => setSelectedTea(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-brand-cream max-w-4xl w-full h-[80vh] flex overflow-hidden shadow-2xl rounded-sm relative"
                onClick={e => e.stopPropagation()}
              >
                <button 
                  onClick={() => setSelectedTea(null)}
                  className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-sidebar transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Left: Image & Stamp */}
                <div className="w-2/5 bg-brand-sidebar p-12 flex flex-col items-center justify-center relative border-r border-brand-border">
                  <div className="absolute top-0 left-0 w-24 h-24 border-b border-r border-brand-border/30 opacity-50" />
                  <div className="absolute bottom-0 right-0 w-32 h-32 border-t border-l border-brand-border/30 opacity-50" />
                  
                  <div className="w-64 h-64 bg-white shadow-xl flex items-center justify-center p-4 mb-10 -rotate-3 border border-brand-border/20 relative">
                    <div className="w-full h-full overflow-hidden">
                      <img 
                        src={selectedTea.heroImage} 
                        alt={selectedTea.englishName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-brand-accent text-white py-2 px-4 text-xs font-bold uppercase tracking-[0.2em] -rotate-3 shadow-lg z-10">
                      {selectedTea.chineseName.substring(selectedTea.chineseName.length - 2)}
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-4xl font-light text-brand-text mb-2">{selectedTea.chineseName}</h3>
                    <p className="text-brand-accent italic tracking-widest text-lg font-serif">{selectedTea.englishName}</p>
                  </div>
                </div>

                {/* Right: Info Scroll */}
                <div className="flex-1 p-16 overflow-y-auto bg-white/50 space-y-12">
                   <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-brand-accent" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent font-sans">Place of Origin</span>
                      </div>
                      <p className="text-2xl font-light text-brand-text leading-tight">{selectedTea.origin}</p>
                   </div>



                   <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <Info className="w-4 h-4 text-brand-accent" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent font-sans">Cultural Legacy</span>
                      </div>
                      <p className="text-brand-text leading-relaxed font-light">{selectedTea.culturalBackground}</p>
                      <p className="text-brand-text leading-relaxed font-light mt-4 text-sm opacity-80">{selectedTea.history}</p>
                   </div>

                   <div className="pt-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-4 h-1 bg-brand-accent" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent font-sans">Vitality</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedTea.healthBenefits.map((b, i) => (
                          <span key={i} className="px-4 py-2 border border-brand-border text-[10px] uppercase font-bold tracking-widest text-brand-text">{b}</span>
                        ))}
                      </div>
                   </div>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        )}

        {unlockedTeas.length > 0 && (
          <div className="flex-1" />
        )}

        <div className="py-4 flex items-center justify-between border-t border-brand-border shrink-0">
           <button
             onClick={onBack}
             className="px-6 py-2 border border-brand-text/20 text-[8px] md:text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-brand-text hover:text-white transition-all font-sans flex items-center gap-2"
           >
             <ArrowLeft className="w-3 h-3" />
             Return to Home
           </button>

           <button
             onClick={() => setShowClearConfirm(true)}
             className="text-gray-400 hover:text-red-600 transition-colors text-[8px] font-bold uppercase tracking-widest flex items-center gap-2 font-sans"
           >
             <RotateCcw className="w-3 h-3" />
             Clear Journey
           </button>
        </div>
      </div>
    </div>
  );
}
