import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'motion/react';
import { 
  ArrowRight, 
  ArrowLeft,
  RotateCw, 
  Thermometer, 
  Timer, 
  Droplets, 
  Sprout, 
  Navigation,
  CheckCircle,
  Trophy,
  Coffee,
  X,
  Play,
  Check
} from 'lucide-react';
import { TeaData, BrewingStep } from '../types';
import TeaStamp from './TeaStamp';
import { teaSounds } from '../services/soundService';

interface BrewingSimulationProps {
  tea: TeaData;
  onComplete: () => void;
  onExit: () => void;
  onHome: () => void;
}

export default function BrewingSimulation({ tea, onComplete, onExit, onHome }: BrewingSimulationProps) {
  const [isIntroMode, setIsIntroMode] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isActionComplete, setIsActionComplete] = useState(false);
  const [showStamp, setShowStamp] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [steamIntensity, setSteamIntensity] = useState(1);
  const [fillLevel, setFillLevel] = useState(0);
  const [isFilling, setIsFilling] = useState(false);
  const [pourQuality, setPourQuality] = useState<'perfect' | 'good' | 'poor' | null>(null);
  
  // New interaction states
  const [tempPointer, setTempPointer] = useState(0);
  const [isLeafInVessel, setIsLeafInVessel] = useState(false);
  const [isDraggingLeaf, setIsDraggingLeaf] = useState(false);
  const [teaCanisterOpen, setTeaCanisterOpen] = useState(false);
  const [pouringPhase, setPouringPhase] = useState(false);
  const [isLidClosed, setIsLidClosed] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);
  const [isVesselTilt, setIsVesselTilt] = useState(false);
  const [warmthProgress, setWarmthProgress] = useState(0);
  const [teaStepStatus, setTeaStepStatus] = useState<'default' | 'container_pressed' | 'leaves_added'>('default');
  const [kettleHeating, setKettleHeating] = useState(false);
  const [pourSequence, setPourSequence] = useState(0);
  const vesselRef = useRef<HTMLDivElement>(null);
  const autoCompleteTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle Serve Step sequence
  const [serveSequence, setServeSequence] = useState(0);

  const step = tea.steps[currentStepIndex];
  const isLastStep = tea.steps.length > 0 && currentStepIndex === tea.steps.length - 1;

  useEffect(() => {
    // Clear any pending auto-complete timers when step changes
    if (autoCompleteTimeoutRef.current) {
      clearTimeout(autoCompleteTimeoutRef.current);
      autoCompleteTimeoutRef.current = null;
    }

    if (!isIntroMode && step) {
      setIsActionComplete(false);
      setTimer(step.duration || null);
      setIsTimerActive(false);
      setSteamIntensity(1);
      setFillLevel(0);
      setIsFilling(false);
      setPourQuality(null);
      setIsLeafInVessel(false);
      setTempPointer(0);
      setPouringPhase(false);
      setIsLidClosed(false);
      setShakeCount(0);
      setIsVesselTilt(false);
      setWarmthProgress(0);
      setTeaStepStatus('default');
      setKettleHeating(false);
      setPourSequence(0);
      setServeSequence(0);
    }
  }, [currentStepIndex, step, isIntroMode]);

  // Temperature pointer animation (oscillating) - REMOVED per user request
  useEffect(() => {
    // This effect was part of the old water volume mini-game and is no longer needed
  }, []);

  // New Kettle Heating Logic
  useEffect(() => {
    let interval: any;
    if (kettleHeating && !pouringPhase && !isActionComplete) {
      interval = setInterval(() => {
        setTempPointer(prev => {
          if (prev >= 100) return 100;
        return prev + 1.2; // Slightly slower for better control
      });
    }, 40);
  }
  return () => clearInterval(interval);
}, [kettleHeating, pouringPhase, isActionComplete]);

  // Handle Pour Sequence for image animations
  useEffect(() => {
    let interval: any;
    if (isFilling && (step?.action === 'Pour into Fairness Cup' || pouringPhase)) {
      interval = setInterval(() => {
        setPourSequence(prev => {
          const next = (prev % 4) + 1;
          return next;
        });
      }, 150); // Slightly faster for smoother appearance
    } else {
      setPourSequence(0);
    }
    return () => clearInterval(interval);
  }, [isFilling, step?.action, pouringPhase]);

  const handleRetry = () => {
    setFillLevel(0);
    setPourQuality(null);
    setIsActionComplete(false);
    setIsTimerActive(false);
    setPouringPhase(false);
    setTempPointer(0);
    setKettleHeating(false);
  };

  const handleLeafDrop = () => {
    setIsLeafInVessel(true);
    setIsActionComplete(true);
  };

  // Handle water filling logic
  useEffect(() => {
    let fillInterval: any;
    if (isFilling && (
      step?.action === 'Pour & Brew' || 
      step?.action === 'Warm Vessel' || 
      step?.action === 'Fill Vessel' ||
      step?.action === 'Pour Water' ||
      step?.action === 'Pour into Fairness Cup'
    )) {
      fillInterval = setInterval(() => {
        if (step?.action === 'Warm Vessel') {
          setWarmthProgress(prev => {
            if (prev >= 100) {
              clearInterval(fillInterval);
              stopFilling(); 
              if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
              autoCompleteTimeoutRef.current = setTimeout(() => {
                setIsActionComplete(true);
                autoCompleteTimeoutRef.current = null;
              }, 800);
              setPourQuality('perfect');
              return 100;
            }
            return prev + 2;
          });
          setFillLevel(prev => Math.min(prev + 3, 85));
        } else {
          setFillLevel(prev => {
            const increment = step?.action === 'Pour into Fairness Cup' ? 1.0 : 2.5;
            const next = prev + increment; 
            if (next >= 100) {
              // Stay in filling state visually for a moment longer
              // but stop the interval logic
              setIsFilling(false);
              
              // Give a good delay so the progress bar visually stays at the end
              if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
              autoCompleteTimeoutRef.current = setTimeout(() => {
                setPouringPhase(false);
                if (step?.action === 'Pour into Fairness Cup') {
                  setIsActionComplete(true);
                } else {
                  setIsTimerActive(true);
                }
                autoCompleteTimeoutRef.current = null;
              }, 800);

              return 100;
            }
            return next;
          });
        }
      }, 30);
    }
    return () => clearInterval(fillInterval);
  }, [isFilling, step?.action]);

  const startFilling = () => {
    if (isActionComplete) return;
    
    if (['Pour Water', 'Pour & Brew', 'Fill Vessel'].includes(step?.action || '')) {
      if (!pouringPhase) {
        setKettleHeating(true);
      } else {
        setIsFilling(true);
      }
      return;
    }

    if (isFilling) return;
    if (step?.action === 'Warm Vessel' && warmthProgress >= 100) return;
    setIsFilling(true);
  };

  const stopFilling = () => {
    if (['Pour Water', 'Pour & Brew', 'Fill Vessel'].includes(step?.action || '')) {
      if (kettleHeating) {
        setKettleHeating(false);
        // Use tea-specific temperature with a generous tolerance
        const target = step?.targetTemp || tea.brewingTemp;
        const tolerance = 10; // Increased tolerance for better playability
        const targetMin = target - tolerance;
        const targetMax = target + tolerance;
        
        if (tempPointer >= targetMin && tempPointer <= targetMax) {
          setPourQuality('perfect');
          setPouringPhase(true); // Proceed to pour
          setTempPointer(target); // Snap to target for visual polish
        } else {
          setPourQuality('poor');
          // Keep tempPointer as is so they see the overshoot/undershoot
        }
      } else if (isFilling) {
        setIsFilling(false);
        if (step?.action === 'Pour & Brew') {
          if (fillLevel >= 45) { // Lowered for better iPad feel
            setPouringPhase(false);
            setIsTimerActive(true);
            setPourQuality('perfect');
          } else {
            // Let them keep pouring if too low
          }
        } else if (fillLevel >= 90) {
          setPouringPhase(false);
          setIsTimerActive(true);
          setPourQuality('perfect');
        }
      }
      return;
    }

    if (step?.action === 'Pour into Fairness Cup') {
      setIsFilling(false);
      if (fillLevel >= 100) {
        if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
        autoCompleteTimeoutRef.current = setTimeout(() => {
          setIsActionComplete(true);
          autoCompleteTimeoutRef.current = null;
        }, 800);
      }
      return;
    }

    if (!isFilling) return;
    setIsFilling(false);
    
    // For "Pour & Brew", we don't end the timer immediately, we let it steep
    if (step?.action === 'Pour & Brew') {
      if (fillLevel >= 50) {
        setPourQuality('perfect');
        if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
        autoCompleteTimeoutRef.current = setTimeout(() => {
          setPouringPhase(false);
          setIsTimerActive(true);
          autoCompleteTimeoutRef.current = null;
        }, 800);
      } else {
        // Just keep filling if it's too low
        setIsFilling(false);
        setIsTimerActive(false);
      }
    } else {
      setIsTimerActive(false);
      if (fillLevel >= 75 && fillLevel <= 88) {
        setPourQuality('perfect');
        if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
        autoCompleteTimeoutRef.current = setTimeout(() => {
          setIsActionComplete(true);
          autoCompleteTimeoutRef.current = null;
        }, 800);
      } else {
        setPourQuality('poor');
      }
    }
  };

  // Audio lifecycle
  useEffect(() => {
    // Boiling logic
    if (kettleHeating) {
      teaSounds.startBoiling();
    } else {
      teaSounds.stopBoiling();
    }

    // Pouring logic
    const shouldPour = isFilling;
    if (shouldPour) {
      teaSounds.startPouring();
    } else {
      teaSounds.stopPouring();
    }

    return () => {
      teaSounds.stopBoiling();
      teaSounds.stopPouring();
    };
  }, [kettleHeating, isFilling]);

  useEffect(() => {
    let interval: any;
    if (isTimerActive && timer !== null && timer > 0) {
      interval = setInterval(() => {
        setTimer(t => (t !== null ? t - 1 : null));
        if (steamIntensity > 1) setSteamIntensity(prev => Math.max(1, prev - 0.05));
      }, 1000);
    } else if (isTimerActive && timer === 0) {
      setIsActionComplete(true);
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, steamIntensity]);

  const handleAction = () => {
    if (!step) return;
    
    if (step.action === 'Shake & Smell') {
      // Logic moved to handleVesselClick
      return;
    }

    if (step.action === 'Pour into Fairness Cup') {
      setIsVesselTilt(true);
      setIsTimerActive(true);
      
      // Animate progress bar manually for the automated version
      let startTime = Date.now();
      const animDuration = 2500;
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, (elapsed / animDuration) * 100);
        setFillLevel(progress);
        if (progress >= 100) clearInterval(interval);
      }, 30);

      if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
      autoCompleteTimeoutRef.current = setTimeout(() => {
        setIsActionComplete(true);
        setIsTimerActive(false);
        clearInterval(interval);
        autoCompleteTimeoutRef.current = null;
      }, 3500);
      return;
    }

    if (step.duration && step.action !== 'Pour & Brew') {
      setIsTimerActive(true);
    } else if (
      !['Pour & Brew', 'Add Tea', 'Warm Vessel', 'Serve', 'Pour into Fairness Cup', 'Shake & Smell', 'Pour Water', 'Fill Vessel'].includes(step.action || '')
    ) {
      if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
      autoCompleteTimeoutRef.current = setTimeout(() => {
        setIsActionComplete(true);
        autoCompleteTimeoutRef.current = null;
      }, 800);
    }
    
    // Handle manual steps like Serve
    if (step.action === 'Serve') {
      // Logic handled via handleVesselClick (taps)
    }
  };

  const handleVesselClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();

    // Timer reduction logic
    if (isTimerActive && (step?.action === 'Steep' || step?.action === 'Pour & Brew' || step?.action === 'Fill Vessel' || step?.action === 'Pour Water') && timer && timer > 0 && !pouringPhase) {
      setTimer(prev => (prev !== null ? Math.max(0, prev - 5) : null));
      setSteamIntensity(prev => Math.min(3, prev + 0.3));
      if (teaSounds?.playPop) teaSounds.playPop();
      
      const rect = e.currentTarget.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
      
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      
      const newRipple = { id: Date.now(), x, y };
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 1000);
      return;
    }

    if (step?.action === 'Serve' && !isActionComplete) {
      if (serveSequence < 3) {
        setServeSequence(prev => prev + 1);
        if (teaSounds?.playPop) teaSounds.playPop();
        
        // Add ripples for visual feedback
        const rect = e.currentTarget.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        
        const newRipple = { id: Date.now(), x, y };
        setRipples(prev => [...prev, newRipple]);
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id));
        }, 1000);

        if (serveSequence + 1 >= 3) {
          if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
          autoCompleteTimeoutRef.current = setTimeout(() => {
            setIsActionComplete(true);
            setPourQuality('perfect');
            autoCompleteTimeoutRef.current = null;
          }, 1200);
        }
      }
      return;
    }

    if (step?.action === 'Warm Vessel' && warmthProgress >= 100 && fillLevel > 0) {
      setFillLevel(0);
      setIsActionComplete(true);
      if (teaSounds?.playPop) teaSounds.playPop();
    }

    if (step?.action === 'Shake & Smell' && !isActionComplete) {
      if (!isLidClosed) {
        setIsLidClosed(true);
        if (teaSounds?.playPop) teaSounds.playPop();
      } else if (shakeCount < 3) {
        setShakeCount(prev => prev + 1);
        setSteamIntensity(prev => Math.min(3, prev + 0.2));
        if (teaSounds?.playPop) teaSounds.playPop();
        if (shakeCount + 1 >= 3) {
          if (autoCompleteTimeoutRef.current) clearTimeout(autoCompleteTimeoutRef.current);
          autoCompleteTimeoutRef.current = setTimeout(() => {
            setIsLidClosed(false);
            setIsActionComplete(true);
            setPourQuality('perfect');
            if (teaSounds?.playPop) teaSounds.playPop();
            autoCompleteTimeoutRef.current = null;
          }, 800);
        }
      }
    }
  };

  const nextStep = () => {
    // Immediate reset to prevent UI flicker/state leakage
    if (autoCompleteTimeoutRef.current) {
      clearTimeout(autoCompleteTimeoutRef.current);
      autoCompleteTimeoutRef.current = null;
    }

    setIsActionComplete(false);
    setServeSequence(0);
    setFillLevel(0);
    setPouringPhase(false);
    setIsTimerActive(false);
    setTimer(null);
    setShakeCount(0);
    setIsLidClosed(false);
    setWarmthProgress(0);
    setPourQuality(null);
    setKettleHeating(false);
    setPourSequence(0);
    
    setCurrentStepIndex(prev => {
      const next = prev + 1;
      if (next >= tea.steps.length) {
        setShowStamp(true);
        return prev;
      }
      return next;
    });
  };

  if (!step && !isIntroMode && !showStamp) return null;

  if (isIntroMode) {
    return (
      <div className="h-full flex flex-col bg-white font-serif overflow-y-auto relative custom-scrollbar">
        {/* Exit Button Top Left */}
        <button 
          onClick={onHome}
          className="absolute top-8 left-8 z-30 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-text/40 hover:text-brand-accent transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Journey
        </button>

        {/* Tea Image Placeholder */}
        <div className="absolute top-8 right-8 md:top-12 md:right-12 w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full border border-brand-border bg-brand-sidebar flex items-center justify-center overflow-hidden z-20 shadow-xl">
          <img 
            src={tea.heroImage} 
            alt={tea.englishName} 
            className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700 hover:scale-110" 
          />
        </div>

        <div className="max-w-4xl mx-auto py-24 px-12 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-20"
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b border-brand-border pb-10 pr-0 md:pr-72 lg:pr-80">
              <div>
                <h1 className="text-4xl md:text-6xl font-light text-brand-text mb-4 tracking-tighter">{tea.chineseName}</h1>
                <p className="text-brand-accent italic text-xl md:text-2xl tracking-[0.1em]">{tea.englishName}</p>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-16">
              {/* History Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 bg-brand-accent rounded-full" />
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-accent font-sans">The Sacred Legacy</h3>
                </div>
                <p className="text-brand-text leading-relaxed font-light text-xl italic">
                  {tea.history}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed font-light mt-6">
                  Originally from <span className="font-medium text-brand-text">{tea.origin}</span>, this {tea.category} tea is a cornerstone of Chinese heritage.
                </p>
              </div>

              {/* Data Section */}
              <div className="space-y-12">
                {/* Benefits */}
                <div className="space-y-6">
                  <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-accent font-sans">Vitality & Essence</h3>
                  <div className="flex flex-wrap gap-3">
                    {tea.healthBenefits.map((benefit, i) => (
                      <span key={i} className="px-5 py-2.5 bg-brand-sidebar text-brand-text border border-brand-border rounded-full text-xs font-bold tracking-wide uppercase font-sans">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Technical data */}
                <div className="grid grid-cols-2 gap-10 border-t border-brand-border pt-10">
                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 font-sans">Caffeine</h4>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {[1, 2, 3].map(i => (
                          <div 
                            key={i} 
                            className={`w-5 h-1.5 rounded-full ${
                              (tea.caffeineLevel === 'Low' && i === 1) || 
                              (tea.caffeineLevel === 'Medium' && i <= 2) || 
                              (tea.caffeineLevel === 'High') 
                                ? 'bg-brand-accent shadow-[0_0_8px_rgba(166,124,82,0.3)]' : 'bg-gray-200'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-brand-text uppercase font-sans tracking-widest">{tea.caffeineLevel}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 font-sans">Ideal Temp</h4>
                    <p className="text-3xl font-light text-brand-text font-serif tracking-tight">
                      {tea.brewingTemp}°C <span className="text-sm text-gray-400 ml-1">/ {Math.round(tea.brewingTemp * 9/5 + 32)}°F</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profiles Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-brand-border pt-12">
              <div className="space-y-6">
                <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-accent font-sans">Scent Profile</h3>
                <div className="flex flex-wrap gap-2">
                  {tea.aroma.map((a, i) => (
                    <span key={i} className="text-lg font-light italic text-brand-text/80 group flex items-center gap-2">
                      {a}{i < tea.aroma.length - 1 && <span className="text-brand-accent/30 text-xs italic opacity-0 md:opacity-100 group-hover:opacity-100 transition-opacity">•</span>}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-brand-accent font-sans">Taste Profile</h3>
                <div className="flex flex-wrap gap-2">
                  {tea.taste.map((t, i) => (
                    <span key={i} className="text-lg font-light italic text-brand-text/80 group flex items-center gap-2">
                      {t}{i < tea.taste.length - 1 && <span className="text-brand-accent/30 text-xs italic opacity-0 md:opacity-100 group-hover:opacity-100 transition-opacity">•</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="flex flex-col items-center gap-8 pt-4 pb-12">
              <button
                onClick={() => setIsIntroMode(false)}
                className="group flex flex-col items-center gap-6 focus:outline-none"
                id="start-brewing"
              >
                <div className="px-20 py-6 bg-brand-text text-white text-[11px] font-bold uppercase tracking-[0.5em] hover:bg-black transition-all shadow-[0_20px_50px_rgba(0,0,0,0.15)] active:scale-95">
                  Begin the Ritual
                </div>
              </button>
              
              <button 
                onClick={onHome}
                className="text-[10px] text-gray-400 uppercase tracking-widest hover:text-brand-accent transition-colors font-bold"
              >
                Return to Tea Selection
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-brand-cream font-serif relative">
      {/* Quick Exit during Simulation */}
      <button 
        onClick={onHome}
        className="absolute top-4 right-8 z-30 text-[10px] font-bold uppercase tracking-[0.4em] text-brand-text/30 hover:text-red-600 transition-colors py-2"
      >
        Exit Ritual
      </button>
      {/* Progress Line */}
      <div className="h-1.5 bg-brand-border shadow-inner">
        <motion.div 
          className="h-full bg-brand-green shadow-[0_0_10px_rgba(74,93,78,0.4)]" 
          initial={{ width: 0 }}
          animate={{ width: `${((currentStepIndex + 1) / tea.steps.length) * 100}%` }}
        />
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Step Info Panel */}
        <div className="w-[28rem] bg-brand-sidebar border-r border-brand-border p-6 flex flex-col justify-between overflow-hidden">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-5">
                <span className="w-10 h-10 rounded-full border-2 border-brand-accent flex items-center justify-center text-sm font-bold text-brand-accent font-sans shadow-sm">
                  {currentStepIndex + 1}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent font-sans">
                  The Brewing Ritual
                </span>
              </div>
              <h2 className="text-4xl font-light text-brand-text leading-[1.1] tracking-tight">{step?.title}</h2>
            </div>

            <div className="space-y-6">
              <p className="text-[15px] italic text-gray-500 font-light leading-relaxed border-l-[3px] border-brand-border/50 pl-6">
                {step?.description}
              </p>
              
              <div className="pt-2 space-y-1">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 font-sans">Current Instruction:</h4>
                <p className="text-brand-text text-lg leading-relaxed font-light">
                  {step?.instruction}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-brand-border/40 space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-accent font-sans">Heritage Context</h4>
            <div className="space-y-2">
              <p className="text-xs text-brand-text font-medium uppercase tracking-widest">{tea.category} Selection</p>
              <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                Nurtured in {tea.origin}, this leaf represents centuries of horticultural mastery.
              </p>
            </div>
          </div>
        </div>

        {/* Central Brewing Area */}
        <div 
          className="flex-1 relative flex flex-col items-center justify-center pb-8 overflow-hidden cursor-pointer active:scale-[0.995] transition-transform duration-500"
          onClick={handleVesselClick}
        >
            {/* Geometric Flourishes removed per user request for clean background */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.01] flex items-center justify-center">
               <div className="w-[600px] h-[600px] border border-brand-text/20 rounded-full" />
            </div>

            <div className="relative w-full max-w-xl aspect-square flex flex-col items-center justify-center z-10 translate-y-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`vessel-${tea.id}-${currentStepIndex}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                  className="relative flex flex-col items-center"
                >
                  {/* Steam Animation */}
                  {(isTimerActive || (isActionComplete && (step?.action === 'Pour Water' || step?.action === 'Steep' || step?.action === 'Fill Vessel' || step?.action === 'Serve' || step?.action === 'Rinse'))) && (
                    <div className="absolute -top-40 flex gap-6 pointer-events-none">
                      {[1, 2, 3, 4].map((i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 0, x: (i - 2.5) * 15 }}
                          animate={{ 
                            opacity: [0, 0.5 * steamIntensity, 0], 
                            y: -200 * steamIntensity,
                            x: ((i - 2.5) * 15) + (Math.sin(i * 2) * 30),
                            scale: [1, 1.4 * steamIntensity, 1]
                          }}
                          transition={{ 
                            duration: 4 / steamIntensity, 
                            repeat: Infinity, 
                            delay: i * 0.7,
                            ease: "easeOut"
                          }}
                          className="w-16 h-40 bg-white/40 blur-3xl rounded-full"
                        />
                      ))}
                    </div>
                  )}                  {/* The Vessel Container (Gaiwan) */}
                  <motion.div 
                    ref={vesselRef}
                    onClick={handleVesselClick}
                    onMouseDown={() => ['Warm Vessel', 'Pour Water', 'Pour & Brew', 'Fill Vessel', 'Pour into Fairness Cup'].includes(step?.action || '') && !isTimerActive && startFilling()}
                    onMouseUp={() => ['Warm Vessel', 'Pour Water', 'Pour & Brew', 'Fill Vessel', 'Pour into Fairness Cup'].includes(step?.action || '') && !isTimerActive && stopFilling()}
                    onMouseLeave={() => ['Warm Vessel', 'Pour Water', 'Pour & Brew', 'Fill Vessel', 'Pour into Fairness Cup'].includes(step?.action || '') && !isTimerActive && stopFilling()}
                    onTouchStart={() => ['Warm Vessel', 'Pour Water', 'Pour & Brew', 'Fill Vessel', 'Pour into Fairness Cup'].includes(step?.action || '') && !isTimerActive && startFilling()}
                    onTouchEnd={() => ['Warm Vessel', 'Pour Water', 'Pour & Brew', 'Fill Vessel', 'Pour into Fairness Cup'].includes(step?.action || '') && !isTimerActive && stopFilling()}
                    animate={{ 
                      rotate: 0,
                      x: 0,
                      y: 0,
                      scale: ['Pour into Fairness Cup', 'Serve'].includes(step?.action || '') ? 1.4 : 1
                    }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className={`relative w-80 h-80 lg:w-[28rem] lg:h-[28rem] ${['Warm Vessel', 'Serve', 'Shake & Smell', 'Add Tea'].includes(step?.action || '') ? 'cursor-pointer' : ''}`}
                  >
                    {/* Water/Tea Level - Removed as requested to only keep the tea cup image */}
                    
                    {/* Sparkles during speed up */}
                    {isTimerActive && (step?.action === 'Steep' || step?.action === 'Pour & Brew') && steamIntensity > 1.2 && !pouringPhase && (
                      <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-b-[4.5rem] lg:rounded-b-[5rem]">
                        {[...Array(10)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ 
                              opacity: [0, 1, 0], 
                              scale: [0, 2, 0],
                              x: [Math.random() * 250 - 125, Math.random() * 250 - 125],
                              y: [Math.random() * 150, 0]
                            }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
                            className="absolute left-1/2 top-1/2 w-2.5 h-2.5 bg-white rounded-full blur-[3px]"
                          />
                        ))}
                      </div>
                    )}

                    {/* Tea Leaves - Hide for image-based steps to avoid double-layering */}
                    {(currentStepIndex > tea.steps.findIndex(s => s.action === 'Add Tea') || isLeafInVessel) && !['Add Tea', 'Shake & Smell', 'Warm Vessel', 'Pour Water', 'Pour & Brew', 'Fill Vessel', 'Pour into Fairness Cup', 'Serve'].includes(step?.action || '') && (
                      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[85%] h-32 flex flex-wrap justify-center overflow-hidden gap-1 opacity-80 z-20">
                        {/* Clumped leaves at the bottom */}
                        {[...Array(35)].map((_, i) => (
                          <motion.div 
                            key={i}
                            initial={{ scale: 0.1, y: 200, rotate: i * 45 }}
                            animate={{ 
                               scale: isActionComplete || step.action === 'Steep' || step.action === 'Pour & Brew' || isLeafInVessel ? 1.2 + (Math.random() * 0.6) : 0, 
                               y: (isTimerActive && !pouringPhase) ? [0, -70, 0] : (isLeafInVessel ? 20 + Math.random() * 20 : 0),
                               x: (isTimerActive && !pouringPhase) ? [0, (i % 5 - 2) * 25, 0] : (i % 8 - 4) * 10,
                               rotate: (isTimerActive && !pouringPhase) ? [i*30, i*30 + 360] : i*30,
                               filter: (isTimerActive && !pouringPhase) ? 'blur(1px)' : 'blur(0px)'
                            }}
                            transition={{ 
                              delay: i * 0.005, 
                              repeat: (isTimerActive && !pouringPhase) ? Infinity : 0, 
                              duration: (3 + Math.random() * 2) / (steamIntensity || 1),
                              ease: "easeInOut"
                            }}
                            className={`w-3 h-10 shadow-[0_4px_8px_rgba(0,0,0,0.2)] ${
                              tea.category === 'Green' ? 'bg-[#0f1f13]' : 
                              (tea.category === 'Red' || tea.category === 'Dark') ? 'bg-[#1c0d02]' : 
                              'bg-[#2d2212]'
                            }`}
                            style={{ 
                              borderRadius: '100% 20% 100% 20%', 
                              transformOrigin: 'center',
                              opacity: 0.7 + (Math.random() * 0.3)
                            }}
                          />
                        ))}
                      </div>
                    )}

                    {/* Aroma Mist Effect for Shake & Smell */}
                    {step?.action === 'Shake & Smell' && isActionComplete && (
                      <div className="absolute inset-0 z-50 pointer-events-none">
                        {/* Wafting Mist */}
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={`aroma-${i}`}
                            initial={{ 
                              opacity: 0, 
                              scale: 0.5, 
                              x: '-50%', 
                              y: '20%' 
                            }}
                            animate={{ 
                              opacity: [0, 0.7, 0.4, 0],
                              scale: [1, 2, 3.5],
                              x: [
                                `${-10 + Math.random() * 20}%`, 
                                `${-30 + Math.random() * 60}%`,
                                `${-50 + Math.random() * 100}%`
                              ],
                              y: ['20%', '-30%', '-80%'],
                            }}
                            transition={{
                              duration: 6,
                              repeat: Infinity,
                              delay: i * 0.4,
                              ease: "linear"
                            }}
                            className="absolute left-1/2 top-1/4 w-32 h-32 bg-white/30 blur-[50px] rounded-full"
                          />
                        ))}

                        {/* Sparkling Essence Particles */}
                        {[...Array(15)].map((_, i) => (
                          <motion.div
                            key={`sparkle-${i}`}
                            initial={{ 
                              opacity: 0,
                              scale: 0,
                              x: `${Math.random() * 100}%`,
                              y: `${30 + Math.random() * 40}%`
                            }}
                            animate={{ 
                              opacity: [0, 0.8, 0],
                              scale: [0, 1, 0],
                              y: [`${30 + Math.random() * 40}%`, `${10 + Math.random() * 20}%`],
                            }}
                            transition={{
                              duration: 2 + Math.random() * 2,
                              repeat: Infinity,
                              delay: i * 0.2,
                              ease: "easeInOut"
                            }}
                            className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_8px_2px_rgba(255,255,255,0.8)]"
                          />
                        ))}
                      </div>
                    )}

                    {/* Vessel Image Replacement */}
                    <motion.div 
                      key={shakeCount} // Force animation reset on each tap
                      animate={{ 
                        scale: step?.action === 'Shake & Smell' && isLidClosed && !isActionComplete 
                          ? 0.85 // Make closed lid smaller as requested
                          : ((kettleHeating || (isFilling && pouringPhase)) ? 1.2 : (isDraggingLeaf && step?.action === 'Add Tea' ? 1.05 : 1)), // Reduced from 1.5 back to 1.2 for early steps per user request
                        x: step?.action === 'Shake & Smell' && isLidClosed && !isActionComplete && shakeCount > 0
                          ? [0, -4, 4, -4, 4, 0] // Shake effect
                          : 0,
                        filter: isDraggingLeaf && step?.action === 'Add Tea' ? 'drop-shadow(0 0 20px rgba(255,255,255,0.4))' : 'drop-shadow(0 0 0px rgba(255,255,255,0))'
                      }}
                      transition={{ 
                        x: { duration: 0.3, ease: "easeInOut" },
                        scale: { duration: 0.2 } 
                      }}
                      className="absolute inset-0 z-50 pointer-events-none"
                    >
                      <img 
                        src={(() => {
                          if (step?.action === 'Warm Vessel') {
                            if (isActionComplete) return '/gaiwan_empty_lid_open.png';
                            // Strictly show warm images ONLY during filling (long press)
                            if (isFilling) {
                              if (warmthProgress < 33) return '/gaiwan_warm_1.png';
                              if (warmthProgress < 66) return '/gaiwan_warm_2.png';
                              return '/gaiwan_warm_3.png';
                            }
                            return '/gaiwan_empty_lid_open.png';
                          }
                          if (step?.action === 'Add Tea') {
                            if (teaStepStatus === 'leaves_added' || isLeafInVessel) {
                              return '/gaiwan_green_leaves_lid_open.png';
                            }
                            return '/gaiwan_empty_lid_open.png';
                          }
                          if (step?.action === 'Shake & Smell') {
                            if (isLidClosed && !isActionComplete) return '/gaiwan_lid_closed.png';
                            return '/gaiwan_green_leaves_lid_open.png';
                          }
                          if (['Pour Water', 'Pour & Brew', 'Fill Vessel'].includes(step?.action || '')) {
                            // Kettle lifecycle in the main slot
                            if (kettleHeating) return '/kettle_heating.gif';
                            if (pouringPhase) {
                              if (pourSequence === 1) return '/kettle_pouring_1.png';
                              if (pourSequence === 2) return '/kettle_pouring_2.png';
                              if (pourSequence === 3) return '/kettle_pouring_3.png';
                              if (pourSequence === 4) return '/kettle_pouring_4.png';
                              return '/kettle_pouring_1.png';
                            }
                            
                            // If we are in the brewing phase (after pouring)
                            if ((isTimerActive || isActionComplete) && !pouringPhase) {
                              return '/gaiwan_lid_closed.png';
                            }
                            
                            // Default state for these steps is the kettle
                            return '/kettle.png';
                          }
                          if (step?.action === 'Pour into Fairness Cup') {
                            if (isActionComplete) return '/fairness-cup_filled.png';
                            if (isFilling) {
                              if (pourSequence === 1) return '/gaiwan_to_fairness-cup_1.png';
                              if (pourSequence === 2) return '/gaiwan_to_fairness-cup_2.png';
                              if (pourSequence === 3) return '/gaiwan_to_fairness-cup_3.png';
                              if (pourSequence === 4) return '/gaiwan_to_fairness-cup_4.png';
                              return '/gaiwan_to_fairness-cup_1.png';
                            }
                            return '/fairness-cup_empty.png';
                          }
                          if (step?.action === 'Serve') {
                            if (isActionComplete && serveSequence >= 3) return '/teacup_filled.png';
                            if (serveSequence === 1) return '/fairness-cup_to_teacup_step1.png';
                            if (serveSequence === 2) return '/fairness-cup_to_teacup_step2.png';
                            if (serveSequence === 3) return '/fairness-cup_to_teacup_step3.png';
                            return '/fairness-cup_filled.png';
                          }
                          return '/gaiwan_empty_lid_open.png';
                        })()} 
                        alt="Gaiwan" 
                        className="w-full h-full object-contain"
                      />
                    </motion.div>

                    {/* Vessel Outer and Water Level removed per user request to only keep the tea cup image */}
                    
                    {/* CSS Lid removed - Now part of Gaiwan images */}
                    
                    {/* Warmth Progress Bar directly under vessel */}
                    {step?.action === 'Warm Vessel' && !isActionComplete && (
                      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 space-y-2 z-40">
                         <div className="h-1.5 w-full bg-brand-border/10 rounded-full overflow-hidden shadow-inner">
                            <motion.div 
                              className="h-full bg-orange-400"
                              animate={{ width: `${warmthProgress}%` }}
                              transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
                            />
                         </div>
                         <div className="flex justify-center">
                            <span className="text-[8px] font-bold text-brand-accent uppercase tracking-[0.2em]">
                              {warmthProgress >= 100 ? 'Vessel Warmed' : isFilling ? 'Heating...' : 'Hold Pot to Warm'}
                            </span>
                         </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Fairness Cup & Tasting Cups - Removed per user request to only use provided images */}
                  <AnimatePresence>
                  </AnimatePresence>

                  {/* Original Teapot (for other steps) */}
                  <AnimatePresence>
                  </AnimatePresence>

                  {/* Timer/Status Display */}
                  <div className="mt-2 h-40 flex flex-col items-center">
                    {!(isActionComplete && (step.action !== 'Serve' || serveSequence >= 3)) ? (
                      <div className="flex flex-col items-center gap-4">
                        {/* Interactive Add Tea Step - Simple Tap Interaction */}
                        {step?.action === 'Add Tea' && !isLeafInVessel && (
                          <div className="relative flex flex-col items-center -mt-32">
                            {/* Chahe (Tea Container) - Click to Add */}
                            <motion.div 
                              className="relative w-40 h-40 cursor-pointer z-30"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                if (teaStepStatus === 'default') {
                                  setTeaStepStatus('leaves_added');
                                  handleLeafDrop();
                                  if (teaSounds?.playPop) teaSounds.playPop();
                                }
                              }}
                            >
                               <img 
                                 src={teaStepStatus === 'default' ? '/chahe_green_tea.png' : '/chahe_empty.png'} 
                                 alt="Tea Container" 
                                 className="w-full h-full object-contain"
                               />
                               
                               {teaStepStatus === 'default' && (
                                 <motion.div 
                                   initial={{ opacity: 0, y: 10 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
                                 >
                                   <span className="text-[10px] bg-brand-accent text-white px-4 py-1.5 rounded-full shadow-lg font-bold tracking-[0.2em] uppercase">
                                     Tap to Add Leaves
                                   </span>
                                 </motion.div>
                               )}
                            </motion.div>

                            {/* Hint */}
                            {teaStepStatus === 'default' && (
                              <motion.span 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] font-sans mt-4"
                              >
                                {tea.englishName}
                              </motion.span>
                            )}
                          </div>
                        )}

                        {/* Interactive Kettle Heating & Pouring Instructions */}
                         {(['Pour Water', 'Pour & Brew', 'Fill Vessel', 'Pour into Fairness Cup'].includes(step?.action || '')) && !isActionComplete && (!isTimerActive || step?.action === 'Pour into Fairness Cup') && (
                          <div className="w-80 space-y-4 -mt-16">
                             <div className="flex flex-col items-center gap-4">
                               <div className="flex justify-between w-full">
                                  <span className="text-[10px] font-bold text-brand-accent uppercase tracking-widest font-sans">
                                    {step.action === 'Pour into Fairness Cup' ? 'Pouring Essence' : 'Prep Stage'}
                                  </span>
                                  <span className="text-[10px] font-bold text-brand-text/50 uppercase tracking-widest font-sans">
                                    {pouringPhase || step.action === 'Pour into Fairness Cup' ? 'Active Ritual' : 'Heating Vessel'}
                                  </span>
                               </div>
                               <div className="h-2 w-full bg-brand-border/20 rounded-full overflow-hidden relative shadow-inner">
                                 {/* Dynamic Target Temperature Range Marker */}
                                 {!pouringPhase && step.action !== 'Pour into Fairness Cup' && (
                                   <div 
                                     className="absolute h-full bg-brand-green/30 border-x border-brand-green/50 z-10" 
                                     style={{ 
                                       left: `${(step.targetTemp || tea.brewingTemp) - 10}%`, 
                                       width: '20%' 
                                     }} 
                                   />
                                 )}
                                 <motion.div 
                                   className={`h-full ${pouringPhase || step.action === 'Pour into Fairness Cup' ? 'bg-brand-green shadow-[0_0_8px_rgba(34,197,94,0.3)]' : 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.3)]'}`}
                                   animate={{ width: `${(pouringPhase || step.action === 'Pour into Fairness Cup') ? fillLevel : tempPointer}%` }}
                                   transition={{ 
                                     type: "tween",
                                     ease: "linear",
                                     duration: 0.1
                                   }}
                                 />
                               </div>
                               
                               <p className="text-[10px] text-gray-400 italic text-center px-4">
                                 {step.action === 'Pour into Fairness Cup' 
                                   ? 'Hold the vessel to pour the tea into the fairness cup'
                                   : !pouringPhase 
                                     ? `Hold pot to heat water to target temperature (${(step.targetTemp || tea.brewingTemp)}°C)` 
                                     : 'Hold pot to pour water into the vessel'}
                               </p>

                               {!pouringPhase && pourQuality === 'poor' && (
                                 <motion.div 
                                   initial={{ opacity: 0, y: 5 }}
                                   animate={{ opacity: 1, y: 0 }}
                                   className="flex flex-col items-center gap-3"
                                 >
                                   <span className="text-[9px] text-red-500 font-bold uppercase tracking-widest">
                                     Missed Target. Recalibrating...
                                   </span>
                                   <button
                                     onClick={handleRetry}
                                     className="px-6 py-2 border border-red-500 text-[9px] font-bold uppercase tracking-widest bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all rounded-full flex items-center gap-2"
                                   >
                                     <RotateCw className="w-3 h-3" />
                                     Restart Heating
                                   </button>
                                 </motion.div>
                               )}
                             </div>
                          </div>
                        )}

                         {step.action === 'Add Tea' && isLeafInVessel && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center gap-2"
                          >
                            <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green mb-2">
                              <Check className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-brand-text uppercase tracking-widest">Tea Leaves Prepared</span>
                            <span className="text-[10px] text-gray-400 italic">Essence has been gathered. Ready for the next dance.</span>
                          </motion.div>
                        )}

                        {step.action === 'Serve' && !isActionComplete && (
                          <div className="flex flex-col items-center gap-6">
                            <motion.span 
                              animate={{ opacity: [0.7, 1, 0.7] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.3em] text-center"
                            >
                              {serveSequence === 0 ? 'Ritual of Sharing' : 
                               (serveSequence >= 3 ? 'Ceremony Concluding...' : `Pouring essence... (${serveSequence}/3)`)}
                            </motion.span>
                            
                            <div className="flex gap-2">
                              {[1, 2, 3].map(i => (
                                <div 
                                  key={i} 
                                  className={`w-4 h-1 rounded-full transition-colors duration-500 ${serveSequence >= i ? 'bg-brand-accent' : 'bg-brand-border/20'}`} 
                                />
                              ))}
                            </div>
                            
                            <span className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.3em] text-center animate-pulse mt-4">
                               {serveSequence === 0 ? 'Tap vessel to start serving' : 
                                serveSequence < 3 ? 'Tap vessel to continue serving' : ''}
                            </span>
                          </div>
                        )}
                         
                         {step.action === 'Warm Vessel' && (
                          <div className="w-64 flex flex-col items-center -mt-16">
                            {isActionComplete ? (
                              <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center gap-2"
                              >
                                <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green mb-2">
                                  <Check className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-bold text-brand-text uppercase tracking-widest">Ritual of Warming Complete</span>
                                <span className="text-[10px] text-gray-400 italic">The porcelain is now awakened. Proceed.</span>
                              </motion.div>
                            ) : (
                               <div className="flex flex-col items-center gap-2">
                                 <span className="text-[10px] font-bold text-brand-accent uppercase tracking-[0.3em] text-center">
                                   {warmthProgress >= 100 
                                     ? 'Tap cup to discard water' 
                                     : isFilling ? 'Pouring Hot Water...' : 'Long Press the Cup or Pot to Warm'}
                                 </span>
                               </div>
                            )}
                          </div>
                        )}

                        {step.action === 'Shake & Smell' && !isActionComplete && (
                          <div className="flex flex-col items-center gap-2 -mt-16">
                             <div className="flex gap-2 mb-4">
                               {[1, 2, 3].map(i => (
                                 <div 
                                   key={i} 
                                   className={`w-3 h-3 rounded-full border border-brand-accent ${shakeCount >= i ? 'bg-brand-accent' : 'bg-transparent'}`} 
                                 />
                               ))}
                             </div>
                             <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-accent animate-pulse">
                               {!isLidClosed ? 'Tap Gaiwan to Close Lid' : 'Tap 3 Times to Awaken Leaves'}
                             </span>
                          </div>
                        )}

                        {step.action === 'Shake & Smell' && isActionComplete && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center gap-2"
                          >
                            <div className="w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green mb-2">
                              <Check className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-bold text-brand-text uppercase tracking-widest">Fragrance Awakened</span>
                            <span className="text-[10px] text-gray-400 italic">The essence is ready for water.</span>
                          </motion.div>
                        )}

                        {timer !== null && isTimerActive && (step.action === 'Steep' || step.action === 'Pour & Brew' || step.action === 'Pour Water' || step.action === 'Fill Vessel') && !pouringPhase && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform relative -mt-24"
                            onClick={handleVesselClick}
                          >
                            {/* Tap Ripples relative to timer */}
                            <AnimatePresence>
                              {ripples.map(ripple => (
                                <motion.div
                                  key={ripple.id}
                                  initial={{ scale: 0, opacity: 0.5 }}
                                  animate={{ scale: 4, opacity: 0 }}
                                  exit={{ opacity: 0 }}
                                  style={{ 
                                    position: 'absolute',
                                    left: ripple.x,
                                    top: ripple.y,
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    backgroundColor: 'rgba(34, 197, 94, 0.4)',
                                    pointerEvents: 'none',
                                    zIndex: 10
                                  }}
                                />
                              ))}
                            </AnimatePresence>

                            <span className="text-8xl font-light font-serif tracking-tighter text-brand-text">{timer}s</span>
                            <div className="flex flex-col items-center gap-3 mt-4">
                              <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-accent font-sans">
                                {['Steep', 'Pour & Brew', 'Pour Water', 'Fill Vessel'].includes(step.action || '') ? 'Extraction in progress' : 'Performing Ritual'}
                              </span>
                              {['Steep', 'Pour & Brew', 'Pour Water', 'Fill Vessel'].includes(step.action || '') && (
                                <motion.span 
                                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.98, 1, 0.98] }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                  className="text-[10px] text-brand-accent font-bold uppercase tracking-[0.2em]"
                                >
                                  Gently tap to accelerate essence
                                </motion.span>
                              )}
                            </div>
                          </motion.div>
                        )}
                        
                        {!isTimerActive && !pouringPhase && !(step.action === 'Pour & Brew' || step.action === 'Pour Water' || step.action === 'Warm Vessel' || step.action === 'Fill Vessel' || step.action === 'Add Tea' || step.action === 'Shake & Smell' || step.action === 'Pour into Fairness Cup' || step.action === 'Serve') && (
                          <button
                            onClick={handleAction}
                            className="px-24 py-7 border-2 border-brand-text text-xs font-bold uppercase tracking-[0.5em] bg-white text-brand-text hover:bg-brand-text hover:text-white transition-all shadow-[0_30px_70px_rgba(0,0,0,0.15)] active:scale-95 flex items-center gap-4 group"
                          >
                            {step.action === 'Shake & Smell' ? (
                               isLidClosed ? <RotateCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" /> : <CheckCircle className="w-5 h-5" />
                            ) : (
                              <Play className="w-5 h-5 fill-current group-hover:scale-125 transition-transform duration-500" />
                            )}
                            {step.action === 'Shake & Smell' ? (isLidClosed ? 'Shake Vessel' : 'Seal Vessel') : `Perform ${step.action}`}
                          </button>
                        )}
                      </div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center gap-6"
                      >
                          <div className="flex items-center gap-4 text-brand-green">
                            {pourQuality === 'perfect' ? <Trophy className="w-6 h-6 text-brand-accent" /> : <CheckCircle className="w-6 h-6" />}
                            <h3 className="text-2xl font-light text-brand-text font-serif italic tracking-tight">
                              Stage Completed
                            </h3>
                          </div>
                         <button
                           onClick={nextStep}
                           className="px-16 py-5 bg-brand-text text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-black transition-all shadow-[0_20px_60px_rgba(0,0,0,0.15)] active:scale-95"
                         >
                           {isLastStep ? 'Conclude Ceremony' : 'Proceed to Next Stage →'}
                         </button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
           </div>
        </div>
      </div>

      {/* Final Stamp Award Screen */}
      <AnimatePresence>
        {showStamp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-cream flex flex-col items-center bg-brand-cream overflow-y-auto custom-scrollbar"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-xl w-full space-y-10 py-12 flex flex-col items-center"
            >
              <div className="space-y-4 text-center">
                <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-accent font-sans">Ritual Accomplished</span>
                <h2 className="text-5xl font-light text-brand-text font-serif italic tracking-tighter">Tea Mastered</h2>
              </div>

              <div className="relative w-96 h-96 mx-auto">
                <motion.div
                  initial={{ opacity: 0, scale: 1.5, rotate: 10 }}
                  animate={{ opacity: 1, scale: 1, rotate: -3 }}
                  transition={{ delay: 0.5, duration: 1.2, type: "spring", damping: 15 }}
                  className="w-full h-full bg-white shadow-[0_30px_60px_rgba(0,0,0,0.15)] flex items-center justify-center p-4 border border-brand-border/10 relative"
                >
                   <div className="w-full h-full relative group overflow-hidden">
                     <div className="absolute inset-0 border-4 border-brand-cream/20 z-10" />
                     <img 
                       src={tea.stampIllustration} 
                       alt={tea.englishName}
                       className="w-full h-full object-cover"
                       referrerPolicy="no-referrer"
                     />
                   </div>
                   <div className="absolute -bottom-2 -right-4 bg-brand-accent text-white py-3 px-6 text-xl font-bold uppercase tracking-[0.25em] -rotate-3 shadow-2xl z-20">
                      {tea.chineseName.substring(tea.chineseName.length - 2)}
                   </div>
                </motion.div>
                
                {/* Ink Splatter background effect */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-brand-accent/5 rounded-full blur-[80px] -z-10" />
              </div>

              <div className="space-y-8 text-center px-6">
                <p className="text-gray-500 font-light italic text-lg leading-relaxed max-w-lg mx-auto">
                  "{tea.summary}"
                </p>
                <div className="pt-4 flex flex-col items-center gap-5">
                  <button
                    onClick={onComplete}
                    className="px-16 py-6 bg-brand-text text-white text-[10px] font-bold uppercase tracking-[0.4em] hover:bg-black transition-all shadow-xl active:scale-95 w-full max-w-sm"
                  >
                    Collection Board
                  </button>
                  <button
                    onClick={onExit}
                    className="text-[9px] font-bold uppercase tracking-[0.3em] text-brand-accent/60 hover:text-brand-accent transition-colors py-2"
                  >
                    Escape Journey
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helpers for visual states
function getWaterHeight(action: string, isComplete: boolean, isActive: boolean, timer?: number | null, duration?: number): string {
  if (action === 'Warm Vessel') return isComplete ? '0%' : '0%'; // fillLevel handles the visual during filling
  if (action === 'Rinse') {
    if (isComplete) return '0%';
    if (isActive && timer !== undefined && timer !== null && duration) return `${(timer / duration) * 60}%`;
    return isActive ? '60%' : '0%';
  }
  if (action === 'Pour Water' || action === 'Fill Vessel' || action === 'Pour & Brew') return isComplete ? '70%' : '0%';
  if (action === 'Add Tea' || action === 'Shake & Smell') return '0%';
  if (action === 'Steep' || action === 'Swirl' || action === 'Appreciate') return '70%';
  if (action === 'Pour into Fairness Cup' || action === 'Serve') {
    if (isComplete) return '0%';
    return '70%';
  }
  return '0%';
}

function getWaterOpacity(action: string, isComplete: boolean): number {
  if (action === 'Add Tea' || action === 'Shake & Smell') return 0;
  if (action === 'Warm Vessel' && isComplete) return 0;
  if (action === 'Pour into Fairness Cup' && isComplete) return 0;
  if (action === 'Serve' && isComplete) return 0;
  if (action === 'Appreciate') return 0.8;
  return 0.6;
}

function getTeaColor(category: string, isComplete: boolean, timer?: number | null, duration?: number): string {
  const cleanColor = '#E0F2FE';
  let finalColor = cleanColor;

  switch (category) {
    case 'Green': finalColor = '#D9F99D'; break;
    case 'White': finalColor = '#F5F5F4'; break;
    case 'Oolong': finalColor = '#FDE68A'; break;
    case 'Red': finalColor = '#FCA5A5'; break;
    case 'Dark': finalColor = '#78350F'; break;
  }

  if (isComplete) return finalColor;

  // For "Pour & Brew" or "Steep", transition from clean to final
  if (timer !== undefined && timer !== null && duration) {
    const progress = 1 - (timer / duration);
    if (progress > 0.8) return finalColor;
  }

  return cleanColor;
}
