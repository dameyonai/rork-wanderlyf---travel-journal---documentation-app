import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Card } from '@/components/Card';
import { TabBar } from '@/components/TabBar';
import { useGearStore } from '@/store/gearStore';
import { GearItemCard } from '@/components/GearItemCard';
import { Tent, Shirt, Smartphone, Utensils, Heart } from 'lucide-react-native';
import { Plus } from 'lucide-react-native';

export default function GearScreen() {
  const router = useRouter();
  const { gearCategories, gearItems, getItemsByCategory, getTotalWeight, getPackedWeight, getPackingProgress } = useGearStore();
  
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'tent':
        return <Tent size={24} color={colors.text} />;
      case 'shirt':
        return <Shirt size={24} color={colors.text} />;
      case 'smartphone':
        return <Smartphone size={24} color={colors.text} />;
      case 'utensils':
        return <Utensils size={24} color={colors.text} />;
      default:
        return <Heart size={24} color={colors.text} />;
    }
  };
  
  const handleCategoryPress = (categoryId: string) => {
    router.push(`/gear/${categoryId}`);
  };
  
  const handleAddNewItem = () => {
    router.push('/gear/new');
  };
  
  const renderCategory = ({ item }: { item: any }) => {
    const itemsInCategory = getItemsByCategory(item.id);
    const packedItems = itemsInCategory.filter(i => i.isPacked).length;
    
    return (
      <TouchableOpacity 
        style={styles.categoryCard}
        onPress={() => handleCategoryPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.categoryIcon}>
          {getCategoryIcon(item.icon)}
        </View>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryCount}>
          {packedItems}/{itemsInCategory.length} packed
        </Text>
      </TouchableOpacity>
    );
  };
  
  const renderRecentItem = ({ item }: { item: any }) => {
    return <GearItemCard item={item} />;
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Gear</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddNewItem}
        >
          <Plus size={18} color="white" />
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Categories</Text>
        
        <FlatList
          data={gearCategories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {getPackingProgress().packed}
            </Text>
            <Text style={styles.statLabel}>Items Packed</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {getPackingProgress().total - getPackingProgress().packed}
            </Text>
            <Text style={styles.statLabel}>Items Remaining</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>
              {getTotalWeight().toFixed(1)}
            </Text>
            <Text style={styles.statLabel}>Total Weight (kg)</Text>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Recent Items</Text>
        
        <FlatList
          data={gearItems.slice(0, 5)}
          renderItem={renderRecentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.itemsContainer}
        />
      </View>
      
      <TabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  sectionTitle: {
    ...typography.heading,
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingRight: 20,
  },
  categoryCard: {
    width: 120,
    height: 120,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${colors.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    ...typography.subheading,
    fontSize: 16,
    textAlign: 'center',
  },
  categoryCount: {
    ...typography.small,
    color: colors.textMuted,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    marginVertical: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
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
    textAlign: 'center',
  },
  itemsContainer: {
    paddingBottom: 100,
  },
});