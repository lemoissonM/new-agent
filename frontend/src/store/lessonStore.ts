import { create } from 'zustand';
import { Fiche, StepDefinition, FicheStep } from '../types/fiche.types';

interface LessonState {
  currentFiche: Fiche | null;
  steps: StepDefinition[];
  currentStepIndex: number;
  isGenerating: boolean;
  error: string | null;
  
  setFiche: (fiche: Fiche) => void;
  setSteps: (steps: StepDefinition[]) => void;
  setCurrentStepIndex: (index: number) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setError: (error: string | null) => void;
  updateFicheField: (field: keyof Fiche, value: any) => void;
  reset: () => void;
}

export const useLessonStore = create<LessonState>((set) => ({
  currentFiche: null,
  steps: [],
  currentStepIndex: 0,
  isGenerating: false,
  error: null,

  setFiche: (fiche) => set({ currentFiche: fiche }),
  setSteps: (steps) => set({ steps }),
  setCurrentStepIndex: (index) => set({ currentStepIndex: index }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setError: (error) => set({ error }),
  
  updateFicheField: (field, value) =>
    set((state) => ({
      currentFiche: state.currentFiche
        ? { ...state.currentFiche, [field]: value }
        : null,
    })),

  reset: () =>
    set({
      currentFiche: null,
      steps: [],
      currentStepIndex: 0,
      isGenerating: false,
      error: null,
    }),
}));