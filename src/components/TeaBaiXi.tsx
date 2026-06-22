import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eraser, Download, Info, ArrowLeft, Palette, Droplets, Trash2 } from 'lucide-react';

interface TeaBaiXiProps {
  onBack: () => void;
}

const BambooStick = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    {/* Tapered stick shape like a hairpin (簪子) */}
    <path 
      d="M20.5 3.5C21.3 2.7 22.3 2.7 22.8 3.2C23.3 3.7 23.3 4.7 22.5 5.5L6.5 21.5C6.0 22.0 4.5 22.5 3.5 22.5C2.5 22.5 1.5 21.5 1.5 20.5C1.5 19.5 2.0 18.0 2.5 17.5L18.5 1.5C19.3 0.7 20.3 0.7 20.8 1.2C21.3 1.7 21.3 2.7 20.5 3.5Z" 
      fill="currentColor"
    />
    {/* Decorative 'head' of the stick */}
    <circle cx="21" cy="3" r="1.5" fill="none" stroke="white" strokeWidth="0.5" />
    <path d="M19 5L21 7" stroke="white" strokeWidth="0.5" opacity="0.5" />
  </svg>
);

export default function TeaBaiXi({ onBack }: TeaBaiXiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastX = useRef<number | null>(null);
  const lastY = useRef<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushMode, setBrushMode] = useState<'brush' | 'eraser'>('brush');
  const [brushSize, setBrushSize] = useState(10);
  const [showInfo, setShowInfo] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        setContext(ctx);
        clearCanvas(ctx);
      }
    }
  }, []);

  const clearCanvas = (ctx: CanvasRenderingContext2D | null) => {
    const activeCtx = ctx || context;
    if (activeCtx && canvasRef.current) {
      const { width, height } = canvasRef.current;
      activeCtx.fillStyle = '#1B3022'; // Deep Matcha
      activeCtx.fillRect(0, 0, width, height);
      
      // Foam grain texture background
      for (let i = 0; i < 3000; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        activeCtx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.03})`;
        activeCtx.beginPath();
        activeCtx.arc(x, y, Math.random() * 1.5, 0, Math.PI * 2);
        activeCtx.fill();
      }
    }
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!canvasRef.current) return;
    setIsDrawing(true);
    const { x, y } = getCoordinates(e);
    lastX.current = x;
    lastY.current = y;
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    lastX.current = null;
    lastY.current = null;
  };

  const drawFoamDab = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
    const isEraser = brushMode === 'eraser';
    
    // 1. Core bloom (very soft)
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, size * 1.5);
    
    if (isEraser) {
      // Paint back the deep matcha background color to 'erase'
      gradient.addColorStop(0, 'rgba(27, 48, 34, 0.4)');
      gradient.addColorStop(0.6, 'rgba(27, 48, 34, 0.1)');
      gradient.addColorStop(1, 'rgba(27, 48, 34, 0)');
    } else {
      gradient.addColorStop(0, 'rgba(245, 240, 225, 0.08)');
      gradient.addColorStop(0.5, 'rgba(240, 235, 220, 0.03)');
      gradient.addColorStop(1, 'rgba(240, 235, 220, 0)');
    }
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // 2. Micro-bubbles (frothy texture) - only for brush mode
    if (!isEraser) {
      for (let i = 0; i < 3; i++) {
        const ox = (Math.random() - 0.5) * size;
        const oy = (Math.random() - 0.5) * size;
        const r = Math.random() * 2 + 1;
        ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.2})`;
        ctx.beginPath();
        ctx.arc(x + ox, y + oy, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !context || !canvasRef.current) return;

    const { x, y } = getCoordinates(e);

    if (lastX.current !== null && lastY.current !== null) {
      // Calculate distance for interpolation (prevent gaps)
      const dx = x - lastX.current;
      const dy = y - lastY.current;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const steps = Math.max(1, Math.floor(dist / 2));
      
      for (let i = 0; i <= steps; i++) {
        const ix = lastX.current + (dx * i) / steps;
        const iy = lastY.current + (dy * i) / steps;
        // Jitter slightly for organic feel
        const jx = ix + (Math.random() - 0.5) * 1.5;
        const jy = iy + (Math.random() - 0.5) * 1.5;
        drawFoamDab(context, jx, jy, brushSize);
      }
    } else {
      drawFoamDab(context, x, y, brushSize);
    }

    lastX.current = x;
    lastY.current = y;
  };

  const downloadArt = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'tea-art.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <div className="h-full flex flex-col bg-brand-cream relative overflow-hidden font-serif">
      {/* Background Zen Pattern */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#a67c52_1px,transparent_1px)] [background-size:30px_30px]" />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <header className="p-4 md:p-6 border-b border-brand-border flex items-center justify-between bg-white/40 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <button 
              onClick={onBack}
              className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center hover:bg-white transition-all active:scale-95"
            >
              <ArrowLeft className="w-4 h-4 text-brand-text" />
            </button>
            <div className="space-y-0.5">
              <h2 className="text-2xl font-light italic tracking-tight">TEA FOAM ART</h2>
              <p className="text-[9px] uppercase tracking-[0.3em] text-brand-accent font-bold font-sans">Traditional Water-on-Tea Art · 茶百戲</p>
            </div>
          </div>
          <button 
            onClick={() => setShowInfo(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-brand-accent/30 bg-white/40 text-[10px] font-bold uppercase tracking-widest text-brand-accent hover:bg-brand-accent hover:text-white transition-all shadow-sm active:scale-95"
          >
            <Info className="w-4 h-4" /> The History
          </button>
        </header>

        <div className="flex-1 flex items-center justify-center p-4 md:p-8 gap-8 md:gap-12">
          {/* Controls - Left */}
          <div className="flex flex-col gap-4 md:gap-6 w-16">
            <div className="space-y-4 md:space-y-4">
              <div className="space-y-2 text-center">
                 <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">Brush</span>
                 <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setBrushMode('brush')}
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${brushMode === 'brush' ? 'bg-brand-accent border-brand-accent text-white shadow-lg' : 'bg-white/50 border-brand-border text-gray-400 hover:bg-white'}`}
                    >
                      <BambooStick className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={() => setBrushMode('eraser')}
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${brushMode === 'eraser' ? 'bg-brand-accent border-brand-accent text-white shadow-lg' : 'bg-white/50 border-brand-border text-gray-400 hover:bg-white'}`}
                    >
                      <Eraser className="w-5 h-5" />
                    </button>
                 </div>
              </div>
              
              <div className="space-y-2 text-center">
                 <span className="text-[8px] uppercase tracking-widest font-bold text-gray-400">Size</span>
                 <input 
                  type="range" 
                  min="4" 
                  max="30" 
                  value={brushSize} 
                  onChange={(e) => setBrushSize(parseInt(e.target.value))}
                  className="accent-brand-accent h-20 md:h-24 [appearance:slider-vertical]"
                 />
              </div>

              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => clearCanvas(null)}
                  className="w-12 h-12 rounded-xl border border-brand-border flex flex-col items-center justify-center gap-1 bg-white/50 hover:bg-white hover:border-red-200 transition-all group"
                  title="Clear All"
                >
                  <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
                  <span className="text-[7px] uppercase font-bold text-gray-400 group-hover:text-red-400">All</span>
                </button>
                <button 
                  onClick={downloadArt}
                  className="w-12 h-12 rounded-xl border border-brand-border flex flex-col items-center justify-center gap-1 bg-white/50 hover:bg-white hover:border-brand-accent transition-all group"
                >
                  <Download className="w-4 h-4 text-gray-400 group-hover:text-brand-accent" />
                  <span className="text-[7px] uppercase font-bold text-gray-400 group-hover:text-brand-accent">Save</span>
                </button>
              </div>
            </div>
          </div>

          {/* Canvas Bowl */}
          <div className="relative scale-90 md:scale-100">
            <div className="absolute inset-0 bg-black/5 rounded-full shadow-[inset_0_10px_40px_rgba(0,0,0,0.2)] pointer-events-none z-10" />
            <div className="p-4 md:p-6 bg-[#2C1810] rounded-full shadow-2xl relative"> {/* Bowl Porcelain Edge */}
              <div className="absolute inset-1 border-[10px] md:border-[14px] border-[#1C0F0A] rounded-full opacity-50 pointer-events-none" />
              <canvas
                ref={canvasRef}
                width={500}
                height={500}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="rounded-full shadow-inner cursor-crosshair bg-[#1B3022] w-[260px] h-[260px] md:w-[340px] md:h-[340px] lg:w-[400px] lg:h-[400px]"
              />
            </div>
            
            {/* Visual feedback removed */}
          </div>

          {/* Right Panel - Context */}
          <div className="w-48 md:w-64 space-y-6 md:space-y-8">
            <div className="space-y-2 md:space-y-4">
              <h4 className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-brand-text/40">The Technique</h4>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed italic">
                "Wait for the foam. Use water to 'carve' the light. The art exists only for a moment."
              </p>
            </div>
            
            <div className="space-y-2 md:space-y-4">
              <h4 className="text-[9px] md:text-[10px] uppercase tracking-widest font-bold text-brand-text/40">Inspiration</h4>
              <ul className="space-y-1 md:space-y-2 text-[11px] md:text-xs text-gray-500 italic">
                <li>• Floating Bamboo Leaves</li>
                <li>• Distant Mountain Peaks</li>
                <li>• Solitary Crane</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Info Modal */}
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
              className="bg-brand-cream max-w-xl w-full border border-brand-border shadow-2xl relative flex flex-col max-h-[85vh] overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-brand-accent z-20" />
              <button 
                onClick={() => setShowInfo(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-brand-text z-20"
              >
                ✕
              </button>
              
              <div className="overflow-y-auto p-8 md:p-12">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-serif italic text-brand-text">The History of Tea Foam Art</h3>
                    <div className="w-16 h-px bg-brand-accent" />
                  </div>

                  <div className="w-full aspect-square max-w-[300px] mx-auto bg-gray-100 rounded-lg overflow-hidden border border-brand-border shadow-md">
                    <img 
                      src="/baixi_history.jpg" 
                      alt="Traditional Tea Foam Art" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  
                  <div className="space-y-4 text-brand-text/70 text-sm leading-relaxed">
                    <p>
                      <strong>Tea Foam Art (茶百戲)</strong>, also known as "Tea Art" or "Water Danqing," is a traditional Chinese tea game that flourished during the Tang and Song Dynasties. Unlike latte art, which uses different liquids, Tea Foam Art uses only water and tea.
                    </p>
                    <p>
                      The artist whisks tea (usually finely powdered like matcha) into a thick, frothy "cloud" (Dian Cha). By using a brush dipped in water or a small spatula, the artist manipulates the foam's surface tension to create ethereal images.
                    </p>
                    <p>
                      Historically, it was considered one of the elegant pastimes of the literati, often compared to calligraphy and painting. The image is ephemeral, lasting only as long as the bubbles remain stable.
                    </p>
                  </div>

                  <div className="pt-8 flex justify-center text-[10px] font-bold uppercase tracking-[0.5em] text-brand-accent">
                    · A Moment of Zen in Every Stroke ·
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
