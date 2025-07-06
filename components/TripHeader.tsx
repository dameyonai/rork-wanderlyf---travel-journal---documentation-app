import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Trip } from '@/types/trip';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Card } from './Card';
import { formatDateRange } from '@/utils/dateUtils';

interface TripHeaderProps {
  trip: Trip;
}

export const TripHeader: React.FC<TripHeaderProps> = ({ trip }) => {
  return (
    <Card>
      <Text style={styles.title}>{trip.title}</Text>
      <Text style={styles.dates}>{formatDateRange(trip.startDate, trip.endDate)}</Text>
      <Text style={styles.description}>{trip.description}</Text>
      
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{trip.stats.distanceTraveled.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Kilometers</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{trip.stats.placesVisited}</Text>
          <Text style={styles.statLabel}>Places Visited</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{trip.stats.photosCount}</Text>
          <Text style={styles.statLabel}>Photos</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{trip.stats.daysOnTrip}</Text>
          <Text style={styles.statLabel}>Days on Trip</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  title: {
    ...typography.heading,
    color: colors.primary,
    marginBottom: 8,
  },
  dates: {
    ...typography.caption,
    marginBottom: 12,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: `${colors.primary}10`,
    borderWidth: 1,
    borderColor: `${colors.primary}30`,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});