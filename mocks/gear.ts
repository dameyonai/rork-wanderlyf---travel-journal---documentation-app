import { GearCategory, GearItem } from '@/types/gear';

export const mockGearCategories: GearCategory[] = [
  {
    id: '1',
    name: 'Camping',
    icon: 'tent',
  },
  {
    id: '2',
    name: 'Clothing',
    icon: 'shirt',
  },
  {
    id: '3',
    name: 'Electronics',
    icon: 'smartphone',
  },
  {
    id: '4',
    name: 'Cooking',
    icon: 'utensils',
  },
  {
    id: '5',
    name: 'First Aid',
    icon: 'first-aid',
  },
];

export const mockGearItems: GearItem[] = [
  {
    id: '1',
    name: 'Tent - 3 Person',
    category: '1',
    weight: 2.5,
    isPacked: true,
    notes: 'Check for tears before packing',
    imageUri: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    id: '2',
    name: 'Sleeping Bag',
    category: '1',
    weight: 1.2,
    isPacked: true,
    notes: 'Rated for -5°C',
    imageUri: 'https://images.unsplash.com/photo-1520645521318-f03a712f0e67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    id: '3',
    name: 'Hiking Boots',
    category: '2',
    weight: 0.9,
    isPacked: true,
    notes: 'Waterproof',
    imageUri: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    id: '4',
    name: 'Camera',
    category: '3',
    weight: 0.7,
    isPacked: true,
    notes: 'Bring extra batteries',
    imageUri: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    id: '5',
    name: 'Portable Stove',
    category: '4',
    weight: 0.5,
    isPacked: false,
    notes: 'Need to buy fuel',
    imageUri: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
];