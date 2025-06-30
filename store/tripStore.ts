import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trip, JournalEntry, Location } from '@/types/trip';
import { mockTrips } from '@/mocks/trips';
import { mockJournalEntries } from '@/mocks/journal-entries';

interface TripState {
  trips: Trip[];
  activeTrip: Trip | null;
  journalEntries: JournalEntry[];
  
  // Actions
  setActiveTrip: (tripId: string) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (tripId: string, tripData: Partial<Trip>) => void;
  deleteTrip: (tripId: string) => void;
  
  addJournalEntry: (entry: JournalEntry) => void;
  updateJournalEntry: (entryId: string, entryData: Partial<JournalEntry>) => void;
  deleteJournalEntry: (entryId: string) => void;
  
  getEntriesForTrip: (tripId: string) => JournalEntry[];
  getActiveTrip: () => Trip | null;
}

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      trips: mockTrips,
      activeTrip: mockTrips.find(trip => trip.isActive) || null,
      journalEntries: mockJournalEntries,
      
      setActiveTrip: (tripId: string) => {
        set(state => ({
          trips: state.trips.map(trip => ({
            ...trip,
            isActive: trip.id === tripId,
          })),
          activeTrip: state.trips.find(trip => trip.id === tripId) || null,
        }));
      },
      
      addTrip: (trip: Trip) => {
        set(state => ({
          trips: [...state.trips, trip],
        }));
      },
      
      updateTrip: (tripId: string, tripData: Partial<Trip>) => {
        set(state => ({
          trips: state.trips.map(trip => 
            trip.id === tripId ? { ...trip, ...tripData } : trip
          ),
          activeTrip: state.activeTrip?.id === tripId 
            ? { ...state.activeTrip, ...tripData } 
            : state.activeTrip,
        }));
      },
      
      deleteTrip: (tripId: string) => {
        set(state => ({
          trips: state.trips.filter(trip => trip.id !== tripId),
          activeTrip: state.activeTrip?.id === tripId ? null : state.activeTrip,
        }));
      },
      
      addJournalEntry: (entry: JournalEntry) => {
        set(state => ({
          journalEntries: [...state.journalEntries, entry],
        }));
      },
      
      updateJournalEntry: (entryId: string, entryData: Partial<JournalEntry>) => {
        set(state => ({
          journalEntries: state.journalEntries.map(entry => 
            entry.id === entryId ? { ...entry, ...entryData } : entry
          ),
        }));
      },
      
      deleteJournalEntry: (entryId: string) => {
        set(state => ({
          journalEntries: state.journalEntries.filter(entry => entry.id !== entryId),
        }));
      },
      
      getEntriesForTrip: (tripId: string) => {
        return get().journalEntries.filter(entry => entry.tripId === tripId);
      },
      
      getActiveTrip: () => {
        return get().activeTrip;
      },
    }),
    {
      name: 'trip-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);