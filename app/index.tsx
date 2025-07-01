import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { TripHeader } from '@/components/TripHeader';
import { JournalEntryCard } from '@/components/JournalEntryCard';
import { TabBar } from '@/components/TabBar';
import { useTripStore } from '@/store/tripStore';
import { Plus, Filter } from 'lucide-react-native';
import { formatDateRange } from '@/utils/dateUtils';

export default function HomeScreen() {
  const router = useRouter();
  const { activeTrip, journalEntries, getEntriesForTrip } = useTripStore();
  
  const recentEntries = activeTrip 
    ? getEntriesForTrip(activeTrip.id).slice(0, 3)
    : [];

  // Calculate actual stats based on current data
  const getActualStats = () => {
    if (!activeTrip) return null;
    
    const tripEntries = getEntriesForTrip(activeTrip.id);
    const now = new Date();
    const startDate = new Date(activeTrip.startDate);
    const endDate = new Date(activeTrip.endDate);
    
    // Check if trip hasn't started yet
    if (now < startDate) {
      const daysUntilStart = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        type: 'countdown',
        daysUntilStart,
        totalDays: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
      };
    }
    
    // Trip is in progress or completed
    const photosCount = tripEntries.filter(entry => entry.imageUri).length;
    const uniqueLocations = new Set(tripEntries.map(entry => entry.location.name));
    const placesVisited = uniqueLocations.size;
    
    // Calculate days elapsed
    const daysElapsed = Math.min(
      Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)),
      Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    );
    
    return {
      type: 'active',
      distanceTraveled: activeTrip.stats.distanceTraveled || 0,
      placesVisited,
      photosCount,
      daysElapsed,
      totalDays: Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1,
      isCompleted: now > endDate,
    };
  };

  const stats = getActualStats();
  
  const handleNewEntry = () => {
    router.push('/journal/new');
  };
  
  const handleViewAllEntries = () => {
    router.push('/journal');
  };
  
  const handleNewTrip = () => {
    router.push('/trips/new');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Header />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTrip ? (
          <>
            <View style={styles.actionButtons}>
              <Button 
                title="+ NEW ENTRY" 
                onPress={handleNewEntry}
                style={styles.actionButton}
              />
              <Button 
                title="🔍 FILTER" 
                variant="secondary"
                onPress={handleViewAllEntries}
                style={styles.actionButton}
              />
            </View>
            
            <View style={styles.tripCard}>
              <Text style={styles.tripTitle}>{activeTrip.title}</Text>
              <Text style={styles.tripDates}>
                {formatDateRange(activeTrip.startDate, activeTrip.endDate)}
              </Text>
              <Text style={styles.tripDescription}>{activeTrip.description}</Text>
              <Text style={styles.subtitle}>Project Wayfarer</Text>

              {stats?.type === 'countdown' ? (
                <View style={styles.countdownContainer}>
                  <Text style={styles.countdownTitle}>Trip starts in</Text>
                  <Text style={styles.countdownDays}>{stats.daysUntilStart}</Text>
                  <Text style={styles.countdownLabel}>
                    {stats.daysUntilStart === 1 ? 'day' : 'days'}
                  </Text>
                  <Text style={styles.countdownSubtext}>
                    {stats.totalDays} day trip planned
                  </Text>
                </View>
              ) : (
                <View style={styles.statsGrid}>
                  <StatCard value={stats?.distanceTraveled || 0} label="Kilometers" />
                  <StatCard value={stats?.placesVisited || 0} label="Places Visited" />
                  <StatCard value={stats?.photosCount || 0} label="Photos" />
                  <StatCard value={
                    stats?.isCompleted ? stats.totalDays : `${stats?.daysElapsed || 0}/${stats?.totalDays || 0}`
                  } label={
                    stats?.isCompleted ? 'Total Days' : 'Days Progress'
                  } />
                </View>
              )}
            </View>
            
            <TripHeader trip={activeTrip} />
            
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Entries</Text>
              <TouchableOpacity onPress={handleViewAllEntries}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {recentEntries.length > 0 ? (
              recentEntries.map(entry => (
                <JournalEntryCard key={entry.id} entry={entry} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No journal entries yet. Start documenting your journey!
                </Text>
                <Button 
                  title="Create First Entry" 
                  onPress={handleNewEntry}
                  style={styles.emptyStateButton}
                />
              </View>
            )}
          </>
        ) : (
          <View style={styles.noTripContainer}>
            <Text style={styles.noTripTitle}>Welcome to Wanderlyf</Text>
            <Text style={styles.noTripText}>
              Start by creating your first trip to document your journey.
            </Text>
            <Button 
              title="Create New Trip" 
              onPress={handleNewTrip}
              style={styles.noTripButton}
            />
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
  },
  tripCard: {
    backgroundColor: colors.background.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  tripTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.accent.primary,
    marginBottom: 8,
  },
  tripDates: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  tripDescription: {
    color: colors.text.secondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  subtitle: {
    color: colors.text.secondary,
    fontSize: 14,
    marginTop: 4,
  },
  countdownContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: `${colors.accent.primary}10`,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${colors.accent.primary}30`,
  },
  countdownTitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  countdownDays: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.accent.primary,
    lineHeight: 52,
  },
  countdownLabel: {
    fontSize: 18,
    color: colors.accent.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  countdownSubtext: {
    fontSize: 14,
    color: colors.text.tertiary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: `${colors.accent.primary}10`,
    borderWidth: 1,
    borderColor: `${colors.accent.primary}30`,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.accent.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    ...typography.heading,
    fontSize: 20,
  },
  viewAll: {
    color: colors.accent.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 16,
  },
  emptyStateText: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: 20,
    color: colors.text.secondary,
  },
  emptyStateButton: {
    minWidth: 200,
  },
  noTripContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 40,
  },
  noTripTitle: {
    ...typography.heading,
    marginBottom: 12,
  },
  noTripText: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: 24,
    color: colors.text.secondary,
  },
  noTripButton: {
    minWidth: 200,
  },
});

const StatCard = ({ value, label }: { value: string | number; label: string }) => (
  <View style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);