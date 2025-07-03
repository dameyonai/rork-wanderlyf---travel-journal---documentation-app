export interface VehicleMod {
  id: string;
  name: string;
  description: string;
  dateAdded: string;
}

export interface Vehicle {
  name: string;
  photoUri?: string;
  modifications: VehicleMod[];
}