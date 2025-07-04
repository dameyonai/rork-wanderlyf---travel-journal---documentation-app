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

export interface Trip {
  id:string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  journalEntries: JournalEntry[];
  vehicleImageUri?: string; 
  checklist?: Checklist;
  waypoints: Waypoint[];
}

export type GearCategory = 'Camping' | 'Clothing' | 'Electronics' | 'Documents' | 'Toiletries';
export interface GearItem { id: string; name: string; weightKg: number; notes: string; category: GearCategory; packed: boolean; imageUri?: string; }
export interface VehicleMod { id: string; name: string; description: string; }
export interface Vehicle { name: string; photoUri: string; modifications: VehicleMod[]; }
export interface GalleryPhoto { id: string; caption: string; description: string; imageUri: string; }
export interface DigitalAsset { id: string; name: string; type: 'Action Camera' | 'Satellite' | 'Drone' | 'Other'; serialNumber: string; notes: string; imageUri?: string; }
export interface ChecklistItem { id: string; text: string; checked: boolean; }
export interface Checklist { [category: string]: ChecklistItem[]; }
export interface Waypoint { id: string; name: string; latitude: number; longitude: number; }