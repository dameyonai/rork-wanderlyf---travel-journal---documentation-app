export interface GearCategory {
  id: string;
  name: string;
  icon: string;
}

export interface GearItem {
  id: string;
  name: string;
  category: string; // Category ID
  weight: number; // Weight in kg
  isPacked: boolean;
  notes?: string;
  imageUri?: string;
}