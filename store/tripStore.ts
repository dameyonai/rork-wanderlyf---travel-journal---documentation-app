import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trip, JournalEntry, Location, Photo } from '@/types/trip';
import { mockTrips } from '@/mocks/trips';
import { mockJournalEntries } from '@/mocks/journal-entries';
import { mockPhotos } from '@/mocks/photos';

interface TripState {
  trips: Trip[];
  activeTrip: Trip | null;
  journalEntries: JournalEntry[];
  photos: Photo[];
  
  // Actions
  setActiveTrip: (tripId: string) => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (tripId: string, tripData: Partial<Trip>) => void;
  deleteTrip: (tripId: string) => void;
  
  addJournalEntry: (entry: JournalEntry) => void;
  updateJournalEntry: (entryId: string, entryData: Partial<JournalEntry>) => void;
  deleteJournalEntry: (entryId: string) => void;
  
  addPhoto: (photo: Photo) => void;
  updatePhoto: (photoId: string, photoData: Partial<Photo>) => void;
  deletePhoto: (photoId: string) => void;
  
  getEntriesForTrip: (tripId: string) => JournalEntry[];
  getPhotosForTrip: (tripId: string) => Photo[];
  getPhotoById: (photoId: string) => Photo | undefined;
  getActiveTrip: () => Trip | null;
}

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      trips: mockTrips,
      activeTrip: mockTrips.find(trip => trip.isActive) || null,
      journalEntries: mockJournalEntries,
      photos: mockPhotos,
      
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
        set(state => {
          const updatedTrips = state.trips.map(trip => 
            trip.id === tripId ? { ...trip, ...tripData } : trip
          );
          
          return {
            trips: updatedTrips,
            activeTrip: state.activeTrip?.id === tripId 
              ? { ...state.activeTrip, ...tripData } 
              : state.activeTrip,
          };
        });
      },
      
      deleteTrip: (tripId: string) => {
        set(state => ({
          trips: state.trips.filter(trip => trip.id !== tripId),
          activeTrip: state.activeTrip?.id === tripId ? null : state.activeTrip,
          journalEntries: state.journalEntries.filter(entry => entry.tripId !== tripId),
          photos: state.photos.filter(photo => photo.tripId !== tripId),
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
      
      addPhoto: (photo: Photo) => {
        set(state => ({
          photos: [...state.photos, photo],
        }));
      },
      
      updatePhoto: (photoId: string, photoData: Partial<Photo>) => {
        set(state => ({
          photos: state.photos.map(photo => 
            photo.id === photoId ? { ...photo, ...photoData } : photo
          ),
        }));
      },
      
      deletePhoto: (photoId: string) => {
        set(state => ({
          photos: state.photos.filter(photo => photo.id !== photoId),
        }));
      },
      
      getEntriesForTrip: (tripId: string) => {
        return get().journalEntries.filter(entry => entry.tripId === tripId);
      },
      
      getPhotosForTrip: (tripId: string) => {
        return get().photos.filter(photo => photo.tripId === tripId);
      },
      
      getPhotoById: (photoId: string) => {
        return get().photos.find(photo => photo.id === photoId);
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