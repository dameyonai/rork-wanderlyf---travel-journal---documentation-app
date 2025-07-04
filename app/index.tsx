import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { useTripStore } from '../store/tripStore';
import { format, differenceInCalendarDays } from 'date-fns';
import { Link } from 'expo-router';
import { Trip } from '../types';

// --- Reusable Components ---

const CountdownCard = ({ trip }: { trip: Trip }) => {
    const today = new Date();
    const startDate = new Date(trip.startDate);
    const endDate = new Date(trip.endDate);
    const daysUntilStart = differenceInCalendarDays(startDate, today);
    const tripDuration = differenceInCalendarDays(endDate, startDate) + 1;

    if (daysUntilStart > 0) {
        return (
            <View style={styles.countdownCard}>
                <Text style={styles.countdownLabel}>Trip starts in</Text>
                <Text style={styles.countdownValue}>{daysUntilStart}</Text>
                <Text style={styles.countdownDays}>days</Text>
                <Text style={styles.countdownSublabel}>{tripDuration} day trip planned</Text>
            </View>
        );
    }
    return null;
};

const TripCard = ({ trip }: { trip: Trip }) => (
    <View style={styles.tripCard}>
        {trip.vehicleImageUri && (
            <Image source={{ uri: trip.vehicleImageUri }} style={styles.tripImage} />
        )}
        <View style={styles.tripContent}>
            <View style={styles.tripHeaderRow}>
                <Text style={styles.tripTitle}>{trip.title}</Text>
                <Link href={`/trips/edit/${trip.id}`} asChild>
                    <TouchableOpacity>
                        <Text style={styles.editButton}>Edit</Text>
                    </TouchableOpacity>
                </Link>
            </View>
            <Text style={styles.tripDates}>
                {format(new Date(trip.startDate), 'MMM dd')} - {format(new Date(trip.endDate), 'MMM dd, yyyy')}
            </Text>
            <Text style={styles.tripDescription}>{trip.description}</Text>
            <CountdownCard trip={trip} />
        </View>
    </View>
);

// --- Main Screen ---

export default function DashboardScreen() {
  const trips = useTripStore((state) => state.trips);
  const router = useRouter();

  const handleNewTrip = () => {
    router.push('/trips/new');
  };

  const handleNewEntry = () => {
    router.push('/journal/new');
  };

  const handleViewAllEntries = () => {
    router.push('/journal');
  };

  const activeTrip = trips.find(trip => trip.isActive) || trips[0];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.appName}>Wanderlyf</Text>
        <Text style={styles.subtitle}>Your Journey, Your Story</Text>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTrip ? (
          <>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                onPress={handleNewEntry}
                style={[styles.actionButton, styles.primaryButton]}
              >
                <Text style={styles.buttonText}>+ NEW ENTRY</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleViewAllEntries}
                style={[styles.actionButton, styles.secondaryButton]}
              >
                <Text style={[styles.buttonText, { color: colors.text }]}>🔍 FILTER</Text>
              </TouchableOpacity>
            </View>
            
            <TripCard trip={activeTrip} />
            
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Entries</Text>
              <TouchableOpacity onPress={handleViewAllEntries}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No journal entries yet. Start documenting your journey!
              </Text>
              <TouchableOpacity 
                onPress={handleNewEntry}
                style={[styles.emptyStateButton, styles.primaryButton]}
              >
                <Text style={styles.buttonText}>Create First Entry</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.noTripContainer}>
            <Text style={styles.noTripTitle}>Welcome to Wanderlyf</Text>
            <Text style={styles.noTripText}>
              Start by creating your first trip to document your journey.
            </Text>
            <TouchableOpacity 
              onPress={handleNewTrip}
              style={[styles.noTripButton, styles.primaryButton]}
            >
              <Text style={styles.buttonText}>Create New Trip</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
    paddingTop: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    marginTop: 8,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tripCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    overflow: 'hidden',
  },
  tripImage: {
    width: '100%',
    height: 200,
  },
  tripContent: {
    padding: 20,
  },
  tripHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    flex: 1,
  },
  editButton: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  tripDates: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  tripDescription: {
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  countdownCard: {
    backgroundColor: colors.primaryMuted,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  countdownLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  countdownValue: {
    color: colors.primary,
    fontSize: 64,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  countdownDays: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  countdownSublabel: {
    color: colors.textSecondary,
    fontSize: 12,
    marginTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  viewAll: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 16,
  },
  emptyStateText: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  emptyStateButton: {
    minWidth: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  noTripContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 40,
  },
  noTripTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  noTripText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: colors.textSecondary,
  },
  noTripButton: {
    minWidth: 200,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
});