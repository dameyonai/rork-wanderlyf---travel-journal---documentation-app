import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Vehicle, VehicleMod } from '@/types';
import { generateId } from '@/utils/idGenerator';

// Mock data for the vehicle
const mockVehicle: Vehicle = {
  name: 'Toyota Land Cruiser',
  photoUri: 'https://images.unsplash.com/photo-1617531322438-288543a3036d?w=600',
  modifications: [
    { 
      id: 'mod-1', 
      name: 'Rooftop Tent', 
      description: '23ZERO Walkabout 62 - Perfect for outback camping',
    },
    { 
      id: 'mod-2', 
      name: 'Suspension Lift', 
      description: '2-inch lift with Bilstein shocks for better ground clearance',
    },
    { 
      id: 'mod-3', 
      name: 'All-Terrain Tires', 
      description: 'BFGoodrich KO2 - Excellent grip on sand and rocks',
    },
  ]
};

interface VehicleState {
  vehicle: Vehicle;
  
  // Actions
  addModification: (newModData: Omit<VehicleMod, 'id'>) => void;
  updateModification: (modId: string, modData: Partial<VehicleMod>) => void;
  deleteModification: (modId: string) => void;
  updateVehiclePhoto: (uri: string) => void;
  updateVehicleName: (name: string) => void;
}

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set) => ({
      vehicle: mockVehicle,
      
      addModification: (newModData) => {
        const newMod: VehicleMod = {
          ...newModData,
          id: generateId(),
        };
        set((state) => ({
          vehicle: {
            ...state.vehicle,
            modifications: [newMod, ...state.vehicle.modifications],
          }
        }));
      },
      
      updateModification: (modId: string, modData: Partial<VehicleMod>) => {
        set((state) => ({
          vehicle: {
            ...state.vehicle,
            modifications: state.vehicle.modifications.map(mod =>
              mod.id === modId ? { ...mod, ...modData } : mod
            ),
          }
        }));
      },
      
      deleteModification: (modId: string) => {
        set((state) => ({
          vehicle: {
            ...state.vehicle,
            modifications: state.vehicle.modifications.filter(mod => mod.id !== modId),
          }
        }));
      },
      
      updateVehiclePhoto: (uri: string) => {
        set((state) => ({
          vehicle: {
            ...state.vehicle,
            photoUri: uri,
          }
        }));
      },
      
      updateVehicleName: (name: string) => {
        set((state) => ({
          vehicle: {
            ...state.vehicle,
            name,
          }
        }));
      },
    }),
    {
      name: 'vehicle-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);