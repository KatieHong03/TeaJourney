import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, BookOpen, Info, X } from 'lucide-react';

interface AboutProps {
  onBack: () => void;
}

interface TeaTool {
  name: string;
  chineseName: string;
  image: string;
  description: string;
}

const TEA_TOOLS: TeaTool[] = [
  {
    name: "Gaiwan",
    chineseName: "盖碗",
    image: "/gaiwan_lid_closed.png",
    description: "The 'lidded bowl' is the quintessential vessel for brewing. It consists of a saucer, a bowl, and a lid, representing earth, humanity, and heaven."
  },
  {
    name: "Cha He",
    chineseName: "茶荷",
    image: "/chahe_green_tea.png",
    description: "The 'tea lotus' or presentation tray. It is used to present the dry tea leaves to guests for appreciation of their scent and appearance before brewing."
  },
  {
    name: "Fairness Cup",
    chineseName: "公道杯",
    image: "/fairness-cup_empty.png",
    description: "The 'justice cup' ensures every guest receives tea of the same strength. Once brewed in the gaiwan, the tea is poured here before serving."
  },
  {
    name: "Tasting Cup",
    chineseName: "品茗杯",
    image: "/teacup_filled.png",
    description: "Small, delicate cups designed to concentrate the tea's aroma and flavor, allowing the drinker to savor every subtle note of the infusion."
  }
];

export default function About({ onBack }: AboutProps) {
  const [showToolsGuide, setShowToolsGuide] = useState(false);

  return (
    <div className="h-full py-4 md:py-8 px-6 md:px-16 bg-brand-cream relative overflow-y-auto font-serif flex flex-col custom-scrollbar">
      {/* Background Character */}
      <div className="fixed inset-0 flex items-center justify-center opacity-[0.015] pointer-events-none select-none z-0">
        <span className="text-[20rem] md:text-[35rem] font-serif leading-none text-brand-accent">茶</span>
      </div>

      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col relative z-10">
        {/* Header Section - More Compact */}
        <header className="mb-4 md:mb-6 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-brand-accent/10 pb-4 md:pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 group cursor-pointer" onClick={onBack}>
              <ArrowLeft className="w-3.5 h-3.5 text-brand-accent group-hover:-translate-x-1 transition-transform" />
              <span className="text-[9px] uppercase tracking-[0.3em] font-sans font-bold text-brand-accent">Return</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif text-brand-text leading-tight tracking-tighter italic">
              The Infinite Steep
            </h2>
            <p className="text-sm md:text-lg text-brand-accent font-light italic tracking-tight max-w-2xl opacity-80">
              Celebrating four millennia of botanical wisdom, philosophical depth, and the meticulous craft of the leaf.
            </p>
          </div>
          
          {/* Prominent Tools Entry */}
          <button 
            onClick={() => setShowToolsGuide(true)}
            className="relative flex items-center gap-4 self-center md:self-end px-8 py-4 bg-brand-sidebar border border-brand-accent/20 hover:border-brand-accent group transition-all shadow-sm hover:shadow-md"
          >
            <div className="absolute -top-3 -left-3 bg-brand-accent text-white p-2 rounded-full shadow-lg group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="block text-[10px] uppercase tracking-[0.2em] font-sans font-extrabold text-brand-accent">Explore Implements</span>
              <span className="block text-sm font-serif italic text-brand-text">Tea Tools Guide</span>
            </div>
          </button>
        </header>

        {/* Main Content Grid - Optimized spacing */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 flex-1 items-center">
          {/* Mission & Narrative */}
          <div className="md:col-span-8 space-y-6 md:space-y-8">
            <div className="space-y-4 md:space-y-6">
              <div className="inline-block px-3 py-0.5 border border-brand-accent/30 rounded-full">
                <span className="text-[9px] uppercase tracking-[0.4em] font-sans font-bold text-brand-accent">Our Philosophy</span>
              </div>
              <blockquote className="text-xl md:text-3xl font-serif italic text-brand-text leading-tight tracking-tight">
                "Chinese tea culture is far more than just a beverage; it is a philosophy of balance, 
                respect for nature, and the art of mindfulness."
              </blockquote>
              <div className="w-16 h-[1px] bg-brand-accent/30" />
              <p className="text-base text-gray-500 font-light leading-relaxed max-w-xl font-serif">
                Tea Journey bridges the gap between ancient ritual and modern life. We invite you to pause, breathe, and connect with a heritage that has shaped civilizations.
              </p>
            </div>

            {/* Values Grid - More compact */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-brand-accent/5">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest font-sans text-brand-accent">Ritual</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed font-light italic">Each step of the brewing process is a practiced entry into a deeper narrative.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest font-sans text-brand-accent">Tradition</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed font-light italic">From high mountains to misty hills, we explore the cornerstones of tea history.</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-widest font-sans text-brand-accent">Heritage</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed font-light italic">Respecting regional variations and the mastery required to unlock the leaf.</p>
              </div>
            </div>
          </div>

          {/* Decorative / Image Column - Scaled down */}
          <div className="md:col-span-4 hidden md:flex flex-col justify-center items-center relative gap-8">
            <div className="absolute inset-0 border-l border-brand-accent/10 pointer-events-none" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="relative aspect-square w-full max-w-[220px]"
            >
              <img 
                src="/gaiwan_green_leaves_lid_open.png" 
                alt="Gaiwan" 
                className="w-full h-full object-contain filter drop-shadow-xl"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                <p className="text-[9px] uppercase tracking-[0.4em] font-sans font-bold text-brand-accent">The Vessel</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer - Integrated and slimmer */}
        <footer className="mt-6 pt-4 border-t border-brand-accent/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-[8px] font-bold uppercase tracking-[0.3em] text-brand-accent/30">
            <span>Ver 1.0</span>
            <div className="w-0.5 h-0.5 bg-brand-accent/10 rounded-full" />
            <span>© 2026</span>
          </div>
          
          <button
            onClick={onBack}
            className="group relative px-10 py-3 bg-brand-text text-white overflow-hidden shadow-lg transition-transform active:scale-95"
          >
            <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative text-[10px] font-bold uppercase tracking-[0.4em] flex items-center gap-3">
              Resume Your Study
            </span>
          </button>
        </footer>
      </div>


      {/* Tea Tools Modal */}
      <AnimatePresence>
        {showToolsGuide && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div 
              className="absolute inset-0 bg-brand-text/90 backdrop-blur-md" 
              onClick={() => setShowToolsGuide(false)}
            />
            
            <motion.div 
              className="relative bg-brand-cream w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-white/10"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <header className="p-8 md:p-12 border-b border-brand-accent/10 flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-4xl font-serif italic text-brand-text">The Scholar's Implements</h3>
                  <p className="text-[10px] uppercase tracking-[0.4em] font-sans font-bold text-brand-accent">Essential Tools of the Kung Fu Tea Ceremony</p>
                </div>
                <button 
                  onClick={() => setShowToolsGuide(false)}
                  className="p-3 border border-brand-accent/20 hover:bg-brand-accent hover:text-white transition-all rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {TEA_TOOLS.map((tool, idx) => (
                    <motion.div 
                      key={tool.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="group flex flex-col md:flex-row gap-8 items-center bg-white/40 p-8 border border-brand-accent/5 hover:border-brand-accent/20 transition-all shadow-sm"
                    >
                      <div className="w-40 h-40 flex-shrink-0 bg-brand-cream/50 relative overflow-hidden flex items-center justify-center p-4">
                        <img 
                          src={tool.image} 
                          alt={tool.name} 
                          className="w-full h-full object-contain filter drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 space-y-4 text-center md:text-left">
                        <div className="space-y-1">
                          <div className="flex items-center justify-center md:justify-start gap-3">
                            <h4 className="text-2xl font-serif text-brand-text">{tool.name}</h4>
                            <span className="text-lg text-brand-accent italic font-serif">{tool.chineseName}</span>
                          </div>
                          <div className="w-10 h-0.5 bg-brand-accent/30 mx-auto md:mx-0" />
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed font-light font-serif">
                          {tool.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-12 p-8 bg-brand-text text-white/90 rounded-sm">
                  <div className="flex gap-6 items-start">
                    <Info className="w-6 h-6 text-brand-accent flex-shrink-0" />
                    <div className="space-y-2">
                       <h5 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-accent/80">Historical Context</h5>
                       <p className="text-xs font-serif italic font-light leading-relaxed">
                         "The tea tool is an extension of the practitioner's hand. To understand the tool is to respect the leaf. In the Song Dynasty, these implements were refined not just for function, but as aesthetic objects that mirrored the harmony of the tea liquor itself."
                       </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

