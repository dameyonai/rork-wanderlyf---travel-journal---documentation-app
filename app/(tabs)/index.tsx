import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useTripStore } from '@/store/tripStore';
import { format, differenceInCalendarDays } from 'date-fns';
import { Link } from 'expo-router';
import { Trip } from '@/types';
import { Plus, MapPin, Settings, Camera } from 'lucide-react-native';

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
                <Link href={`/trips/new`} asChild>
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
  const activeTrip = useTripStore((state) => state.getActiveTrip());
  const router = useRouter();

  const handleNewTrip = () => {
    router.push('/trips/new');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>SHDWBLK OUTBACK</Text>
        <Text style={styles.subtitle}>Project Wayfarer</Text>
      </View>
      
      {/* Four buttons in 2x2 grid */}
      <View style={styles.buttonGrid}>
        <View style={styles.buttonRow}>
          <Link href="/journal/new" asChild>
            <TouchableOpacity style={[styles.button, styles.primaryButton]}>
              <Plus color="white" size={24} />
              <Text style={[styles.buttonText, styles.primaryButtonText]}>NEW ENTRY</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/(tabs)/map" asChild>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
              <MapPin color="#E5E7EB" size={24} />
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>MAP</Text>
            </TouchableOpacity>
          </Link>
        </View>
        
        <View style={styles.buttonRow}>
          <Link href="/gear" asChild>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
              <Settings color="#E5E7EB" size={24} />
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>GEAR</Text>
            </TouchableOpacity>
          </Link>
          
          <Link href="/(tabs)/gallery" asChild>
            <TouchableOpacity style={[styles.button, styles.secondaryButton]}>
              <Camera color="#E5E7EB" size={24} />
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>GALLERY</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTrip ? (
          <TripCard trip={activeTrip} />
        ) : (
          <View style={styles.noTripContainer}>
            <Text style={styles.noTripTitle}>No Active Trip</Text>
            <Text style={styles.noTripText}>
              Create a new trip from the Settings tab to start your journey.
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
    </View>
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
    fontSize: 32,
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
  
  // NEW: 4-button grid styles
  buttonGrid: {
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
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
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  primaryButtonText: {
    color: colors.white,
  },
  secondaryButtonText: {
    color: '#E5E7EB',
  },
  
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
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
    backgroundColor: colors.chocolate.muted,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.chocolate.border,
  },
  countdownLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  countdownValue: {
    color: colors.chocolate.DEFAULT,
    fontSize: 64,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  countdownDays: {
    color: colors.chocolate.DEFAULT,
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