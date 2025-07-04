import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useGearStore } from '@/store/gearStore';
import { GearItemCard } from '@/components/GearItemCard';
import { Button } from '@/components/Button';
import { Plus } from 'lucide-react-native';

export default function CategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { gearCategories, getItemsByCategory } = useGearStore();
  
  const categoryData = gearCategories.find(cat => cat.id === category);
  const items = getItemsByCategory(category);
  
  const packedItems = items.filter(item => item.packed);
  const unpackedItems = items.filter(item => !item.packed);
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen 
        options={{ 
          title: categoryData?.name || 'Category',
        }} 
      />
      
      <View style={styles.header}>
        <Button 
          title="Add Item" 
          icon={<Plus size={18} color="white" />}
          onPress={() => {}}
        />
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{packedItems.length}</Text>
          <Text style={styles.statLabel}>Packed</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{unpackedItems.length}</Text>
          <Text style={styles.statLabel}>Remaining</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {items.reduce((total, item) => total + (item.weightKg || 0), 0).toFixed(1)}
          </Text>
          <Text style={styles.statLabel}>Weight (kg)</Text>
        </View>
      </View>
      
      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={({ item }) => <GearItemCard item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={() => (
            <Text style={styles.sectionTitle}>{categoryData?.name} Items</Text>
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No Items Yet</Text>
          <Text style={styles.emptyStateText}>
            Start adding items to your {categoryData?.name} category.
          </Text>
          <Button 
            title="Add First Item" 
            icon={<Plus size={18} color="white" />}
            style={styles.emptyStateButton}
            onPress={() => {}}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
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
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  sectionTitle: {
    ...typography.heading,
    marginBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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