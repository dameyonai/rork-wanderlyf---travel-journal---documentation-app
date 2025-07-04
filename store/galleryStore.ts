import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GalleryPhoto } from '../types/trip';

// Mock data for the gallery
const mockGalleryPhotos: GalleryPhoto[] = [
    { id: '1', caption: 'Darwin Sunset', description: 'The sky was on fire tonight over the water.', imageUri: 'https://images.unsplash.com/photo-1565530919137-3401586552e5?w=500' },
    { id: '2', caption: 'Litchfield NP', description: 'Exploring the magnetic termite mounds.', imageUri: 'https://images.unsplash.com/photo-1547036234-a8c626514144?w=500' },
    { id: '3', caption: 'Kakadu Crocs', description: 'Saw a few big ones on the Yellow Water cruise.', imageUri: 'https://images.unsplash.com/photo-1594586365393-3dedb66060c4?w=500' },
    { id: '4', caption: 'Katherine Gorge', description: 'Paddling through the ancient rock formations.', imageUri: 'https://images.unsplash.com/photo-1621495533139-3619929d833a?w=500' },
    { id: '5', caption: 'Mataranka', description: 'The thermal pools were incredible.', imageUri: 'https://images.unsplash.com/photo-1617531322438-288543a3036d?w=500' },
    { id: '6', caption: 'Daly Waters Pub', description: 'A classic outback pub experience.', imageUri: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500' },
    { id: '7', caption: 'Devil\'s Marbles', description: 'These giant boulders are otherworldly.', imageUri: 'https://images.unsplash.com/photo-1528575628285-3531db61e683?w=500' },
    { id: '8', caption: 'Alice Springs', description: 'The heart of the Red Centre.', imageUri: 'https://images.unsplash.com/photo-1594917409015-209a1a4c4e36?w=500' },
    { id: '9', caption: 'West Macs', description: 'Hiking through Ormiston Gorge.', imageUri: 'https://images.unsplash.com/photo-1547842683-04ab648cb42c?w=500' },
    { id: '10', caption: 'Kings Canyon', description: 'The rim walk was breathtaking.', imageUri: 'https://images.unsplash.com/photo-1557676757-b4539b98628b?w=500' },
    { id: '11', caption: 'Uluru Sunrise', description: 'A truly magical moment.', imageUri: 'https://images.unsplash.com/photo-1596491732643-9b8d7814a1a0?w=500' },
    { id: '12', caption: 'Kata Tjuta', description: 'Valley of the Winds walk.', imageUri: 'https://images.unsplash.com/photo-1594154378713-d0216715f55c?w=500' },
];

interface GalleryState {
  galleryPhotos: GalleryPhoto[];
  updatePhotoDetails: (photoId: string, newDetails: { caption: string; description: string }) => void;
}

export const useGalleryStore = create<GalleryState>()(
  persist(
    (set) => ({
      galleryPhotos: mockGalleryPhotos,
      updatePhotoDetails: (photoId, newDetails) => {
        set((state) => ({
          galleryPhotos: state.galleryPhotos.map((photo) =>
            photo.id === photoId ? { ...photo, ...newDetails } : photo
          ),
        }));
      },
    }),
    {
      name: 'shdwblk-gallery-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);