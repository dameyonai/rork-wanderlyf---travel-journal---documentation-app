import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GearItem, GearCategory } from '@/types';
import { mockGearItems, mockGearCategories } from '@/mocks/gear';

interface GearCategoryData {
  id: string;
  name: string;
  icon: string;
}

interface GearState {
  gearItems: GearItem[];
  gearCategories: GearCategoryData[];
  
  // Actions
  addGearItem: (item: GearItem) => void;
  updateGearItem: (itemId: string, itemData: Partial<GearItem>) => void;
  deleteGearItem: (itemId: string) => void;
  togglePackedStatus: (itemId: string) => void;
  
  addGearCategory: (category: GearCategoryData) => void;
  updateGearCategory: (categoryId: string, categoryData: Partial<GearCategoryData>) => void;
  deleteGearCategory: (categoryId: string) => void;
  
  getItemsByCategory: (categoryId: string) => GearItem[];
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
      
      addGearCategory: (category: GearCategoryData) => {
        set(state => ({
          gearCategories: [...state.gearCategories, category],
        }));
      },
      
      updateGearCategory: (categoryId: string, categoryData: Partial<GearCategoryData>) => {
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
    }),
    {
      name: 'gear-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);