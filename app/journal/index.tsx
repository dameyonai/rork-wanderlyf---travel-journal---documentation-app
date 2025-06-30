import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Button } from '@/components/Button';
import { JournalEntryCard } from '@/components/JournalEntryCard';
import { TabBar } from '@/components/TabBar';
import { useTripStore } from '@/store/tripStore';
import { Plus, Filter, Calendar, MapPin, Tag } from 'lucide-react-native';

export default function JournalScreen() {
  const router = useRouter();
  const { activeTrip, getEntriesForTrip } = useTripStore();
  const [filterType, setFilterType] = useState<string | null>(null);
  
  const entries = activeTrip 
    ? getEntriesForTrip(activeTrip.id)
    : [];
  
  const handleNewEntry = () => {
    router.push('/journal/new');
  };
  
  const handleFilter = (type: string) => {
    setFilterType(type === filterType ? null : type);
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Button 
          title="New Entry" 
          onPress={handleNewEntry}
          icon={<Plus size={18} color="white" />}
        />
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            filterType === 'date' && styles.activeFilterButton
          ]}
          onPress={() => handleFilter('date')}
        >
          <Calendar size={16} color={filterType === 'date' ? colors.accent.primary : colors.text.secondary} />
          <Text style={[
            styles.filterText,
            filterType === 'date' && styles.activeFilterText
          ]}>Date</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton,
            filterType === 'location' && styles.activeFilterButton
          ]}
          onPress={() => handleFilter('location')}
        >
          <MapPin size={16} color={filterType === 'location' ? colors.accent.primary : colors.text.secondary} />
          <Text style={[
            styles.filterText,
            filterType === 'location' && styles.activeFilterText
          ]}>Location</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.filterButton,
            filterType === 'category' && styles.activeFilterButton
          ]}
          onPress={() => handleFilter('category')}
        >
          <Tag size={16} color={filterType === 'category' ? colors.accent.primary : colors.text.secondary} />
          <Text style={[
            styles.filterText,
            filterType === 'category' && styles.activeFilterText
          ]}>Category</Text>
        </TouchableOpacity>
      </View>
      
      {entries.length > 0 ? (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.entryContainer}>
              <JournalEntryCard entry={item} />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No Entries Yet</Text>
          <Text style={styles.emptyStateText}>
            Start documenting your journey by creating your first journal entry.
          </Text>
          <Button 
            title="Create First Entry" 
            onPress={handleNewEntry}
            style={styles.emptyStateButton}
          />
        </View>
      )}
      
      <TabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeFilterButton: {
    backgroundColor: `${colors.accent.primary}15`,
    borderColor: `${colors.accent.primary}30`,
  },
  filterText: {
    ...typography.small,
    marginLeft: 6,
  },
  activeFilterText: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 16,
  },
  entryContainer: {
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    ...typography.heading,
    marginBottom: 12,
  },
  emptyStateText: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: 24,
    color: colors.text.secondary,
  },
  emptyStateButton: {
    minWidth: 200,
  },
});