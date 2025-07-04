import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Link } from 'expo-router';
import { colors } from '../../constants/colors';
import { useTripStore } from '../../store/tripStore';
import { MapPin, Navigation, Plus } from 'lucide-react-native';

export default function MapTabScreen() {
  const { journalEntries } = useTripStore();
  
  // Get unique locations from journal entries
  const locations = journalEntries.reduce((acc, entry) => {
    const existing = acc.find(loc => loc.name === entry.location.name);
    if (!existing) {
      acc.push({
        ...entry.location,
        entryCount: 1,
        lastVisited: entry.date,
      });
    } else {
      existing.entryCount += 1;
      if (new Date(entry.date) > new Date(existing.lastVisited)) {
        existing.lastVisited = entry.date;
      }
    }
    return acc;
  }, [] as any[]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trip Map</Text>
        <Link href="/map/picker" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color={colors.white} />
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.mapPlaceholder}>
        <Navigation size={48} color={colors.textMuted} />
        <Text style={styles.mapPlaceholderText}>Interactive Map</Text>
        <Text style={styles.mapPlaceholderSubtext}>
          Map functionality would be implemented here with a mapping library
        </Text>
      </View>

      <View style={styles.locationsSection}>
        <Text style={styles.sectionTitle}>Visited Locations</Text>
        
        {locations.length > 0 ? (
          <ScrollView style={styles.locationsList} showsVerticalScrollIndicator={false}>
            {locations.map((location, index) => (
              <View key={index} style={styles.locationCard}>
                <View style={styles.locationHeader}>
                  <MapPin size={20} color={colors.primary} />
                  <Text style={styles.locationName}>{location.name}</Text>
                </View>
                <Text style={styles.locationDetails}>
                  {location.entryCount} {location.entryCount === 1 ? 'entry' : 'entries'}
                </Text>
                <Text style={styles.locationCoords}>
                  {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                </Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyLocations}>
            <MapPin size={32} color={colors.textMuted} />
            <Text style={styles.emptyLocationsText}>
              No locations recorded yet. Add journal entries with locations to see them here.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholder: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    height: 200,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 40,
  },
  locationsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  locationsList: {
    flex: 1,
  },
  locationCard: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  locationDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  locationCoords: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'monospace',
  },
  emptyLocations: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyLocationsText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: 16,
  },
});