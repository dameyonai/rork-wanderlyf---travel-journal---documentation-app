import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProfileState {
  name: string;
  email?: string;
  bio?: string;
  
  // Actions
  updateProfile: (profileData: Partial<ProfileState>) => void;
  resetProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      name: 'SHDWBLK TRVLR',
      email: undefined,
      bio: undefined,
      
      updateProfile: (profileData: Partial<ProfileState>) => {
        set(state => ({
          ...state,
          ...profileData,
        }));
      },
      
      resetProfile: () => {
        set({
          name: 'SHDWBLK TRVLR',
          email: undefined,
          bio: undefined,
        });
      },
    }),
    {
      name: 'profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);