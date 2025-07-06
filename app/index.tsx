import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { useTripStore } from '@/store/tripStore';
import { format, differenceInCalendarDays } from 'date-fns';
import { Link } from 'expo-router';
import { Trip } from '@/types';
import { Feather } from '@expo/vector-icons';

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
        {trip.coverImageUri && (
            <Image source={{ uri: trip.coverImageUri }} style={styles.tripImage} />
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
  const activeTrip = useTripStore((state) => state.getActiveTrip());
  const router = useRouter();

  const handleNewEntry = () => {
    router.push('/journal/new');
  };

  const handleNewTrip = () => {
    router.push('/trips/new');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.appName}>ÖUŦRØAĐƏŘ</Text>
        <Text style={styles.subtitle}>SHADOW BLACK</Text>
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          onPress={handleNewEntry}
          style={[styles.btn, styles.btnPrimary]}
        >
          <View style={styles.btnContent}>
            <Feather name="plus" size={20} color={colors.white} />
            <Text style={styles.btnText}>NEW ENTRY</Text>
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          onPress={() => router.push('/gear')}
          style={[styles.btn, styles.btnSecondary]}
        >
          <View style={styles.btnContent}>
            <Feather name="briefcase" size={18} color={colors.text} />
            <Text style={[styles.btnText, {color: colors.text}]}>GEAR</Text>
          </View>
        </TouchableOpacity>
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
              style={[styles.noTripButton, styles.btnPrimary]}
            >
              <Text style={styles.btnText}>Create New Trip</Text>
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
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnPrimary: {
    backgroundColor: colors.primary,
  },
  btnSecondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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