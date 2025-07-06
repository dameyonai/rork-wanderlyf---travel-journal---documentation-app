export interface Location {
  latitude: number;
  longitude: number;
  name: string;
}

export interface JournalEntry {
  id: string;
  tripId: string;
  title: string;
  date: string; 
  location: Location;
  category: string;
  content: string;
  imageUri?: string;
  photoTimestamp?: string;
  photoLocation?: Location;
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
  vehicleImageUri?: string;
  stats: TripStats;
  locations: Location[];
  isActive: boolean;
  journalEntries?: JournalEntry[];
  checklist?: Checklist;
  waypoints?: Waypoint[];
}


export type GearCategory = 'Camping' | 'Clothing' | 'Electronics' | 'Documents' | 'Toiletries';

export interface Photo {
  id: string;
  tripId: string;
  imageUri: string;
  caption?: string;
  location: Location;
  date: string;
}

export interface VehicleMod { id: string; name: string; description: string; }
export interface Vehicle { name: string; photoUri: string; modifications: VehicleMod[]; }
export interface GalleryPhoto { id: string; caption: string; description: string; imageUri: string; }
export interface DigitalAsset { id: string; name: string; type: 'Action Camera' | 'Satellite' | 'Drone' | 'Other'; serialNumber: string; notes: string; imageUri?: string; }
export interface ChecklistItem { id: string; text: string; checked: boolean; }
export interface Checklist { [category: string]: ChecklistItem[]; }
export interface Waypoint { id: string; name: string; latitude: number; longitude: number; }