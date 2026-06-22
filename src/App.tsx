/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Map, 
  Sparkles, 
  Trophy, 
  Info, 
  ArrowLeft
} from 'lucide-react';
import { AppState } from './types';
import { TEAS } from './constants';

// Pages (to be implemented)
import Welcome from './components/Welcome';
import TeaSelection from './components/TeaSelection';
import BrewingSimulation from './components/BrewingSimulation';
import CollectionBoard from './components/CollectionBoard';
import Tasseography from './components/Tasseography';
import TeaBaiXi from './components/TeaBaiXi';
import ChinaOfTea from './components/ChinaOfTea';
import About from './components/About';

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('tea_journey_state');
    return saved ? JSON.parse(saved) : {
      unlockedTeas: [],
      currentPage: 'welcome',
      selectedTeaId: null
    };
  });

  useEffect(() => {
    localStorage.setItem('tea_journey_state', JSON.stringify(state));
  }, [state]);

  const navigate = (page: AppState['currentPage'], teaId: string | null = null) => {
    setState(prev => ({ ...prev, currentPage: page, selectedTeaId: teaId }));
  };

  const unlockTea = (teaId: string) => {
    if (!state.unlockedTeas.includes(teaId)) {
      setState(prev => ({ ...prev, unlockedTeas: [...prev.unlockedTeas, teaId] }));
    }
  };

  const clearJourney = () => {
    setState(prev => ({ ...prev, unlockedTeas: [], currentPage: 'selection' }));
  };

  const renderPage = () => {
    switch (state.currentPage) {
      case 'welcome':
        return <Welcome onBegin={() => navigate('selection')} onCollection={() => navigate('collection')} onAbout={() => navigate('about')} />;
      case 'selection':
        return (
          <TeaSelection 
            teas={TEAS} 
            unlockedTeas={state.unlockedTeas} 
            onSelect={(id) => navigate('brewing', id)} 
            onCollection={() => navigate('collection')}
          />
        );
      case 'brewing':
        const selectedTea = TEAS.find(t => t.id === state.selectedTeaId);
        if (!selectedTea) return <div id="error-tea" className="p-10">Tea not found</div>;
        return (
          <BrewingSimulation 
            tea={selectedTea} 
            onComplete={() => {
              unlockTea(selectedTea.id);
              navigate('collection');
            }}
            onExit={() => navigate('selection')}
            onHome={() => navigate('selection')}
          />
        );
      case 'collection':
        return <CollectionBoard unlockedTeas={state.unlockedTeas} onClearJourney={clearJourney} onBack={() => navigate('selection')} />;
      case 'divination':
        return <Tasseography onBack={() => navigate('selection')} />;
      case 'baixi':
        return <TeaBaiXi onBack={() => navigate('selection')} />;
      case 'world':
        return <ChinaOfTea onBack={() => navigate('selection')} />;
      case 'about':
        return <About onBack={() => navigate('welcome')} />;
      default:
        return <Welcome onBegin={() => navigate('selection')} onCollection={() => navigate('collection')} onAbout={() => navigate('about')} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-[#DED9D0] flex items-center justify-center overflow-hidden">
      {/* Aspect-ratio restricted container for perfect 11" iPad fit (1194x834 points) */}
      <div className="w-full h-full lg:aspect-[1194/834] lg:h-auto lg:max-h-screen bg-brand-cream text-brand-text font-serif overflow-hidden flex selection:bg-brand-accent/20 shadow-[0_0_100px_rgba(0,0,0,0.1)] relative">
        
        {/* Vertical Navigation Sidebar */}
        <AnimatePresence>
          {state.currentPage !== 'welcome' && (
            <motion.nav 
              initial={{ x: -110 }}
              animate={{ x: 0 }}
              exit={{ x: -110 }}
              className="w-24 border-r border-brand-border flex flex-col items-center py-6 bg-brand-sidebar z-30 shrink-0 overflow-y-auto overflow-x-hidden transition-all"
            >
              <div className="mb-8 shrink-0">
                <button 
                  onClick={() => navigate('welcome')}
                  className="w-12 h-12 border-2 border-brand-accent rounded-full flex items-center justify-center font-bold text-brand-accent hover:bg-white transition-colors text-xl"
                >
                  茶
                </button>
              </div>
              
              <div className="flex flex-col gap-8 flex-1 py-4">
                <SidebarLink 
                  active={state.currentPage === 'selection' || state.currentPage === 'brewing'} 
                  onClick={() => navigate('selection')}
                  labelEn="Home"
                  labelCn="首頁"
                />
                <SidebarLink 
                  active={state.currentPage === 'divination'} 
                  onClick={() => navigate('divination')}
                  labelEn="TASSEOGRAPHY"
                  labelCn="茶占卜"
                />
                <SidebarLink 
                  active={state.currentPage === 'baixi'} 
                  onClick={() => navigate('baixi')}
                  labelEn="TEA FOAM ART"
                  labelCn="茶百戲"
                />
                <SidebarLink 
                  active={state.currentPage === 'world'} 
                  onClick={() => navigate('world')}
                  labelEn="CULTURE"
                  labelCn="中國之茶"
                />
                <SidebarLink 
                  active={state.currentPage === 'collection'} 
                  onClick={() => navigate('collection')}
                  labelEn="Collection"
                  labelCn="收藏"
                />
                <SidebarLink 
                  active={state.currentPage === 'about'} 
                  onClick={() => navigate('about')}
                  labelEn="History"
                  labelCn="歷史"
                />
              </div>

              <div className="mt-8 shrink-0 pb-4">
                <button className="w-10 h-10 rounded-full border border-brand-border flex items-center justify-center cursor-pointer hover:bg-white transition-all active:scale-90">
                  <span className="text-xs opacity-40">⚙︎</span>
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-brand-cream">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentPage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="h-full w-full"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ active, onClick, labelEn, labelCn }: { active: boolean, onClick: () => void, labelEn: string, labelCn: string }) {
  return (
    <button 
      onClick={onClick}
      className={`relative group flex flex-col items-center w-full px-1 transition-all ${active ? 'opacity-100' : 'opacity-30 hover:opacity-60'}`}
    >
      <span className={`text-[7px] uppercase font-bold tracking-[0.1em] mb-2 font-sans w-full text-center leading-tight ${active ? 'text-brand-accent' : ''}`}>
        {labelEn}
      </span>
      <div className="[writing-mode:vertical-rl] text-lg font-medium tracking-[0.2em] mb-1">
        {labelCn}
      </div>
      {active && (
        <motion.div 
          layoutId="sidebar-indicator"
          className="absolute -left-4 top-1/2 -translate-y-1/2 w-[2px] h-8 bg-brand-accent shadow-[0_0_8px_rgba(166,124,82,0.3)]" 
        />
      )}
    </button>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-xl flex items-center gap-2 transition-all duration-300
        ${active 
          ? 'bg-emerald-900 text-white shadow-lg shadow-emerald-900/20' 
          : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800'}
      `}
    >
      {icon}
      <span className="font-medium text-sm hidden md:inline">{label}</span>
      {active && (
        <motion.div
          layoutId="nav-pill"
          className="absolute inset-0 bg-emerald-900 rounded-xl -z-10"
        />
      )}
    </button>
  );
}
