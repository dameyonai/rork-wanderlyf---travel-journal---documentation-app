export interface Location {
  latitude: number;
  longitude: number;
  name: string;
}

export interface JournalEntry {
  id: string;
  tripId: string;
  title: string;
  content: string;
  date: string;
  location: Location;
  category: string;
  imageUri?: string;
  weather?: string;
  mood?: string;
}

export interface TripStats {
  distanceTraveled: number;
  placesVisited: number;
  photosCount: number;
  daysOnTrip: number;
}

export interface Trip {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  coverImageUri?: string;
  stats: TripStats;
  locations: Location[];
  isActive: boolean;
}

export interface Photo {
  id: string;
  tripId: string;
  imageUri: string;
  caption?: string;
  location: Location;
  date: string;
}