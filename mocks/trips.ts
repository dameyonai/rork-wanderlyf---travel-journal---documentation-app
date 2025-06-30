import { Trip } from '@/types/trip';

export const mockTrips: Trip[] = [
  {
    id: '1',
    title: 'NT Outback Journey 2025',
    description: 'Documenting the road trip across the Northern Territory, visiting remote communities and capturing the raw beauty of the Australian outback.',
    startDate: '2025-06-26',
    endDate: '2025-07-15',
    coverImageUri: 'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    stats: {
      distanceTraveled: 2891,
      placesVisited: 12,
      photosCount: 159,
      daysOnTrip: 19,
    },
    locations: [
      {
        latitude: -12.4634,
        longitude: 130.8456,
        name: 'Darwin',
      },
      {
        latitude: -14.4652,
        longitude: 132.2664,
        name: 'Katherine',
      },
      {
        latitude: -23.6980,
        longitude: 133.8807,
        name: 'Alice Springs',
      },
    ],
    isActive: true,
  },
  {
    id: '2',
    title: 'Tasmania Wilderness Trek',
    description: 'Exploring the pristine wilderness of Tasmania, hiking through ancient forests and along rugged coastlines.',
    startDate: '2025-03-10',
    endDate: '2025-03-25',
    coverImageUri: 'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    stats: {
      distanceTraveled: 450,
      placesVisited: 8,
      photosCount: 223,
      daysOnTrip: 15,
    },
    locations: [
      {
        latitude: -42.8821,
        longitude: 147.3272,
        name: 'Hobart',
      },
      {
        latitude: -41.4419,
        longitude: 146.4132,
        name: 'Cradle Mountain',
      },
    ],
    isActive: false,
  },
];