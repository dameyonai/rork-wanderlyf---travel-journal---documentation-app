import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Header } from '@/components/Header';
import { TabBar } from '@/components/TabBar';
import { PolaroidCard } from '@/components/PolaroidCard';
import { useTripStore } from '@/store/tripStore';
import { formatDateRange } from '@/utils/dateUtils';
import { Plus } from 'lucide-react-native';

export default function PhotosScreen() {
  const router = useRouter();
  const { activeTrip, getPhotosForTrip } = useTripStore();
  
  const photos = activeTrip ? getPhotosForTrip(activeTrip.id) : [];

  const handleAddPhoto = () => {
    router.push('/photos/new');
  };

  if (!activeTrip) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Header />
        <View style={styles.noTripContainer}>
          <Text style={styles.noTripTitle}>No Active Trip</Text>
          <Text style={styles.noTripText}>
            Create a trip to start adding photos to your gallery.
          </Text>
        </View>
        <TabBar />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Trip Header */}
        <View style={styles.tripHeader}>
          <Text style={styles.tripTitle}>{activeTrip.title}</Text>
          <Text style={styles.tripDates}>
            {formatDateRange(activeTrip.startDate, activeTrip.endDate)}
          </Text>
          <Text style={styles.tripDescription}>{activeTrip.description}</Text>
        </View>

        {/* Add Photo Button */}
        <TouchableOpacity style={styles.addPhotoButton} onPress={handleAddPhoto}>
          <Plus size={20} color={colors.text.primary} />
          <Text style={styles.addPhotoText}>Add Photo</Text>
        </TouchableOpacity>

        {/* Photo Grid */}
        {photos.length > 0 ? (
          <View style={styles.photoGrid}>
            {photos.map((photo) => (
              <PolaroidCard key={photo.id} photo={photo} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No photos yet. Start capturing memories from your journey!
            </Text>
          </View>
        )}
      </ScrollView>
      
      <TabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  tripHeader: {
    marginBottom: 24,
    paddingVertical: 20,
    paddingHorizontal: 24,
    backgroundColor: colors.background.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tripTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.accent.primary,
    marginBottom: 8,
    lineHeight: 28,
  },
  tripDates: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 12,
  },
  tripDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  addPhotoText: {
    color: colors.text.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  emptyState: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 40,
  },
  emptyStateText: {
    ...typography.body,
    textAlign: 'center',
    color: colors.text.secondary,
  },
  noTripContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noTripTitle: {
    ...typography.heading,
    marginBottom: 12,
  },
  noTripText: {
    ...typography.body,
    textAlign: 'center',
    color: colors.text.secondary,
  },
});