import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useTripStore } from '@/store/tripStore';
import { colors } from '@/constants/colors';
import { format, differenceInCalendarDays } from 'date-fns';
import { Link } from 'expo-router';
import { Trip } from '@/types';

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
  const trips = useTripStore((state) => state.trips);

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.appName}>SHDWBLK OUTBACK</Text>
            <Text style={styles.subtitle}>Project Wayfarer</Text>
        </View>

        <View style={styles.actionsContainer}>
            <Link href="/journal/new" asChild>
                <TouchableOpacity style={styles.btnPrimary}>
                    <Text style={styles.btnText}>+ NEW ENTRY</Text>
                </TouchableOpacity>
            </Link>
            <TouchableOpacity style={styles.btnSecondary}>
                <Text style={styles.btnText}>🔍 FILTER</Text>
            </TouchableOpacity>
        </View>

        <FlatList
            data={trips}
            renderItem={({ item }) => <TripCard trip={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
        />
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 },
    header: { alignItems: 'center', marginVertical: 20, paddingTop: 20 },
    appName: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: 1.5, textAlign: 'center' },
    subtitle: { color: colors.textSecondary, marginTop: 8, fontSize: 16 },
    actionsContainer: { flexDirection: 'row', gap: 12, marginBottom: 20 },
    btnPrimary: { flex: 1, backgroundColor: colors.primary, padding: 16, borderRadius: 12, alignItems: 'center' },
    btnSecondary: { flex: 1, backgroundColor: colors.surface, padding: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
    btnText: { color: colors.text, fontWeight: '600' },
    tripCard: { 
        backgroundColor: colors.surface, 
        borderRadius: 16, 
        borderWidth: 1, 
        borderColor: colors.border,
        marginBottom: 20,
        overflow: 'hidden',
    },
    tripImage: {
        width: '100%',
        height: 200,
    },
    tripContent: {
        padding: 24,
    },
    tripHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    tripTitle: { fontSize: 24, fontWeight: '700', color: colors.primary, marginBottom: 8, flex: 1 },
    editButton: { color: colors.primary, fontWeight: '600', fontSize: 16 },
    tripDates: { color: colors.textSecondary, marginBottom: 16 },
    tripDescription: { color: colors.textSecondary, lineHeight: 22, marginBottom: 24 },
    countdownCard: { backgroundColor: colors.primaryMuted, borderRadius: 12, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: colors.primary + '40' },
    countdownLabel: { color: colors.textSecondary, fontSize: 14 },
    countdownValue: { color: colors.primary, fontSize: 64, fontWeight: 'bold', marginVertical: 4 },
    countdownDays: { color: colors.primary, fontSize: 20, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
    countdownSublabel: { color: colors.textSecondary, fontSize: 12, marginTop: 8 },
});
