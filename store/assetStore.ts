import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DigitalAsset } from '../types';

const mockAssets: DigitalAsset[] = [
    { id: 'asset-1', name: 'GoPro HERO12 Black', type: 'Action Camera', serialNumber: 'C3421324501234', notes: 'Main action cam for documenting the journey.', imageUri: 'https://images.unsplash.com/photo-1695431495995-5783a3f5561a?w=500' },
    { id: 'asset-2', name: 'Starlink Gen 2', type: 'Satellite', serialNumber: 'KIT0123456789', notes: 'For remote internet connectivity.', imageUri: 'https://images.unsplash.com/photo-1633511920-8875ab965f13?w=500' },
    { id: 'asset-3', name: 'DJI Mini 3 Pro', type: 'Drone', serialNumber: 'DJI001234567', notes: 'Aerial photography and videography.', imageUri: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500' },
];

interface AssetState {
  assets: DigitalAsset[];
  addAsset: (newAssetData: Omit<DigitalAsset, 'id'>) => void;
  updateAsset: (id: string, updates: Partial<Omit<DigitalAsset, 'id'>>) => void;
  deleteAsset: (id: string) => void;
  getAssetsByType: (type: DigitalAsset['type']) => DigitalAsset[];
}

export const useAssetStore = create<AssetState>()(
  persist(
    (set, get) => ({
      assets: mockAssets,
      addAsset: (newAssetData) => {
          const newAsset: DigitalAsset = { ...newAssetData, id: `asset-${Date.now()}` };
          set((state) => ({ assets: [newAsset, ...state.assets] }));
      },
      updateAsset: (id, updates) => {
        set((state) => ({
          assets: state.assets.map((asset) =>
            asset.id === id ? { ...asset, ...updates } : asset
          ),
        }));
      },
      deleteAsset: (id) => {
        set((state) => ({
          assets: state.assets.filter((asset) => asset.id !== id),
        }));
      },
      getAssetsByType: (type) => {
        return get().assets.filter((asset) => asset.type === type);
      },
    }),
    {
      name: 'outroader-asset-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);