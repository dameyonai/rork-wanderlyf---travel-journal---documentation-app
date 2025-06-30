import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { TabBar } from '@/components/TabBar';
import { useTripStore } from '@/store/tripStore';
import { MapPin } from 'lucide-react-native';

export default function MapScreen() {
  const { activeTrip, getEntriesForTrip } = useTripStore();
  
  const entries = activeTrip 
    ? getEntriesForTrip(activeTrip.id)
    : [];
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapPlaceholderText}>
            Map View
          </Text>
          <Text style={styles.mapPlaceholderSubtext}>
            (In a real app, this would be an interactive map)
          </Text>
          
          {activeTrip && activeTrip.locations.map((location, index) => (
            <View 
              key={index}
              style={[
                styles.mapPin,
                {
                  left: `${30 + (index * 20)}%`,
                  top: `${20 + (index * 15)}%`,
                }
              ]}
            >
              <MapPin size={24} color={colors.accent.primary} />
            </View>
          ))}
        </View>
      </View>
      
      <ScrollView style={styles.locationsContainer}>
        <Text style={styles.locationsTitle}>Trip Locations</Text>
        
        {activeTrip && activeTrip.locations.length > 0 ? (
          activeTrip.locations.map((location, index) => (
            <View key={index} style={styles.locationItem}>
              <View style={styles.locationIcon}>
                <MapPin size={20} color={colors.accent.primary} />
              </View>
              <View style={styles.locationContent}>
                <Text style={styles.locationName}>{location.name}</Text>
                <Text style={styles.locationCoords}>
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </Text>
              </View>
              <Text style={styles.locationEntries}>
                {entries.filter(e => e.location.name === location.name).length} entries
              </Text>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No locations added to this trip yet.
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
  mapContainer: {
    height: Dimensions.get('window').height * 0.4,
    width: '100%',
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  mapPlaceholderText: {
    ...typography.heading,
    color: colors.text.secondary,
  },
  mapPlaceholderSubtext: {
    ...typography.caption,
    color: colors.text.tertiary,
    marginTop: 8,
  },
  mapPin: {
    position: 'absolute',
    width: 24,
    height: 24,
  },
  locationsContainer: {
    flex: 1,
    padding: 20,
  },
  locationsTitle: {
    ...typography.heading,
    marginBottom: 16,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.accent.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationContent: {
    flex: 1,
    marginLeft: 12,
  },
  locationName: {
    ...typography.subheading,
    fontSize: 16,
  },
  locationCoords: {
    ...typography.small,
    color: colors.text.tertiary,
  },
  locationEntries: {
    ...typography.caption,
    color: colors.accent.primary,
  },
  emptyState: {
    padding: 24,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyStateText: {
    ...typography.body,
    textAlign: 'center',
    color: colors.text.secondary,
  },
});