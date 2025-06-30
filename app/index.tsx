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

export default function HomeScreen() {
  const router = useRouter();
  const { activeTrip, journalEntries, getEntriesForTrip } = useTripStore();
  
  const recentEntries = activeTrip 
    ? getEntriesForTrip(activeTrip.id).slice(0, 3)
    : [];
  
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