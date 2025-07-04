import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checklist, ChecklistItem } from '../types';
import { masterChecklist } from '../data/masterChecklist';

interface ChecklistState {
  checklist: Checklist;
  initializeFromMaster: () => void;
  toggleItem: (categoryKey: string, itemId: string) => void;
  addCustomItem: (categoryKey: string, text: string) => void;
  removeItem: (categoryKey: string, itemId: string) => void;
  resetChecklist: () => void;
  getProgress: () => { completed: number; total: number; percentage: number };
  getCategoryProgress: (categoryKey: string) => { completed: number; total: number; percentage: number };
}

export const useChecklistStore = create<ChecklistState>()(
  persist(
    (set, get) => ({
      checklist: {},
      
      initializeFromMaster: () => {
        const currentChecklist = get().checklist;
        // Only initialize if checklist is empty
        if (Object.keys(currentChecklist).length === 0) {
          set({ checklist: JSON.parse(JSON.stringify(masterChecklist)) });
        }
      },

      toggleItem: (categoryKey: string, itemId: string) => {
        set((state) => ({
          checklist: {
            ...state.checklist,
            [categoryKey]: state.checklist[categoryKey]?.map(item =>
              item.id === itemId ? { ...item, checked: !item.checked } : item
            ) || []
          }
        }));
      },

      addCustomItem: (categoryKey: string, text: string) => {
        const newItem: ChecklistItem = {
          id: `custom-${Date.now()}`,
          text,
          checked: false
        };
        
        set((state) => ({
          checklist: {
            ...state.checklist,
            [categoryKey]: [...(state.checklist[categoryKey] || []), newItem]
          }
        }));
      },

      removeItem: (categoryKey: string, itemId: string) => {
        set((state) => ({
          checklist: {
            ...state.checklist,
            [categoryKey]: state.checklist[categoryKey]?.filter(item => item.id !== itemId) || []
          }
        }));
      },

      resetChecklist: () => {
        set({ checklist: JSON.parse(JSON.stringify(masterChecklist)) });
      },

      getProgress: () => {
        const checklist = get().checklist;
        let completed = 0;
        let total = 0;
        
        Object.values(checklist).forEach(items => {
          total += items.length;
          completed += items.filter(item => item.checked).length;
        });
        
        return {
          completed,
          total,
          percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        };
      },

      getCategoryProgress: (categoryKey: string) => {
        const items = get().checklist[categoryKey] || [];
        const completed = items.filter(item => item.checked).length;
        const total = items.length;
        
        return {
          completed,
          total,
          percentage: total > 0 ? Math.round((completed / total) * 100) : 0
        };
      },
    }),
    {
      name: 'shdwblk-checklist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);