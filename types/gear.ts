export interface GearItem {
  id: string;
  name: string;
  category: string;
  weight?: number;
  isPacked: boolean;
  notes?: string;
  imageUri?: string;
}

export interface GearCategory {
  id: string;
  name: string;
  icon: string;
}