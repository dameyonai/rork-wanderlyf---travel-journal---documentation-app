import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GearItem, GearCategory } from '@/types/gear';
import { mockGearItems, mockGearCategories } from '@/mocks/gear';

interface GearState {
  gearItems: GearItem[];
  gearCategories: GearCategory[];
  
  // Actions
  addGearItem: (item: GearItem) => void;
  updateGearItem: (itemId: string, itemData: Partial<GearItem>) => void;
  deleteGearItem: (itemId: string) => void;
  togglePackedStatus: (itemId: string) => void;
  
  addGearCategory: (category: GearCategory) => void;
  updateGearCategory: (categoryId: string, categoryData: Partial<GearCategory>) => void;
  deleteGearCategory: (categoryId: string) => void;
  
  getItemsByCategory: (categoryId: string) => GearItem[];
  getTotalWeight: () => number;
  getPackedWeight: () => number;
  getPackingProgress: () => { packed: number; total: number; percentage: number };
}

export const useGearStore = create<GearState>()(
  persist(
    (set, get) => ({
      gearItems: mockGearItems,
      gearCategories: mockGearCategories,
      
      addGearItem: (item: GearItem) => {
        set(state => ({
          gearItems: [...state.gearItems, item],
        }));
      },
      
      updateGearItem: (itemId: string, itemData: Partial<GearItem>) => {
        set(state => ({
          gearItems: state.gearItems.map(item => 
            item.id === itemId ? { ...item, ...itemData } : item
          ),
        }));
      },
      
      deleteGearItem: (itemId: string) => {
        set(state => ({
          gearItems: state.gearItems.filter(item => item.id !== itemId),
        }));
      },
      
      togglePackedStatus: (itemId: string) => {
        set(state => ({
          gearItems: state.gearItems.map(item => 
            item.id === itemId ? { ...item, isPacked: !item.isPacked } : item
          ),
        }));
      },
      
      addGearCategory: (category: GearCategory) => {
        set(state => ({
          gearCategories: [...state.gearCategories, category],
        }));
      },
      
      updateGearCategory: (categoryId: string, categoryData: Partial<GearCategory>) => {
        set(state => ({
          gearCategories: state.gearCategories.map(category => 
            category.id === categoryId ? { ...category, ...categoryData } : category
          ),
        }));
      },
      
      deleteGearCategory: (categoryId: string) => {
        set(state => ({
          gearCategories: state.gearCategories.filter(category => category.id !== categoryId),
        }));
      },
      
      getItemsByCategory: (categoryId: string) => {
        return get().gearItems.filter(item => item.category === categoryId);
      },
      
      getTotalWeight: () => {
        return get().gearItems.reduce((total, item) => total + item.weight, 0);
      },
      
      getPackedWeight: () => {
        return get().gearItems
          .filter(item => item.isPacked)
          .reduce((total, item) => total + item.weight, 0);
      },
      
      getPackingProgress: () => {
        const items = get().gearItems;
        const packed = items.filter(item => item.isPacked).length;
        const total = items.length;
        const percentage = total > 0 ? Math.round((packed / total) * 100) : 0;
        return { packed, total, percentage };
      },
    }),
    {
      name: 'gear-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);