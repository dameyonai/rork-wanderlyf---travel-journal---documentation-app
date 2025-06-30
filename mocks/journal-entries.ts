import { JournalEntry } from '@/types/trip';

export const mockJournalEntries: JournalEntry[] = [
  {
    id: '1',
    tripId: '1',
    title: 'Day 1. Leaving Darwin.',
    content: "Finally hitting the road! Darwin's looking beautiful this morning. Vehicle's loaded up with gear and ready for three weeks across the Territory. The journey begins - first destination: Katherine for fuel and supplies. Can't wait to see what adventures await in the outback.",
    date: '2025-06-26',
    location: {
      latitude: -12.4634,
      longitude: 130.8456,
      name: 'Darwin',
    },
    category: "Today's Drive",
    imageUri: 'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    weather: 'Sunny, 32°C',
    mood: 'Excited',
  },
  {
    id: '2',
    tripId: '1',
    title: 'Katherine Gorge Sunset',
    content: 'Spent the afternoon kayaking through Katherine Gorge. The ancient rock formations are breathtaking, especially as the sun sets and bathes everything in golden light. Spotted several freshwater crocodiles sunning themselves on the rocks.',
    date: '2025-06-27',
    location: {
      latitude: -14.4652,
      longitude: 132.2664,
      name: 'Katherine',
    },
    category: 'Adventure',
    imageUri: 'https://images.unsplash.com/photo-1600255821058-c4f89958d700?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    weather: 'Clear, 30°C',
    mood: 'Peaceful',
  },
  {
    id: '3',
    tripId: '1',
    title: 'Roadside Encounter',
    content: 'Had to stop for a family of kangaroos crossing the Stuart Highway this morning. Counted at least 15 of them hopping across. The little joeys were adorable! Reminded me why I love road trips through the outback.',
    date: '2025-06-28',
    location: {
      latitude: -15.6252,
      longitude: 131.8347,
      name: 'Stuart Highway',
    },
    category: 'Wildlife',
    imageUri: 'https://images.unsplash.com/photo-1526095179574-86e545346ae6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    weather: 'Partly Cloudy, 29°C',
    mood: 'Amused',
  },
];