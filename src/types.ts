import { DivideIcon as LucideIcon } from 'lucide-react';

export type TeaCategory = 'Green' | 'White' | 'Oolong' | 'Red' | 'Dark';

export interface BrewingStep {
  title: string;
  description: string;
  instruction: string;
  action: string;
  targetTemp?: number;
  duration?: number; // in seconds
}

export interface TeaData {
  id: string;
  chineseName: string;
  englishName: string;
  category: TeaCategory;
  origin: string;
  description: string;
  culturalBackground: string;
  history: string;
  healthBenefits: string[];
  caffeineLevel: 'Low' | 'Medium' | 'High';
  brewingTemp: number;
  steps: BrewingStep[];
  stampImage: string;
  stampIllustration: string;
  heroImage: string;
  cardImage?: string;
  aroma: string[];
  taste: string[];
  summary: string;
  color: string; // Tailwind color class for theme
}

export interface AppState {
  unlockedTeas: string[];
  currentPage: 'welcome' | 'selection' | 'brewing' | 'collection' | 'divination' | 'about' | 'baixi' | 'world';
  selectedTeaId: string | null;
}
