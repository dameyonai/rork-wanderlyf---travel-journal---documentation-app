import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { colors } from '../../constants/colors';
import { useGearStore } from '../../store/gearStore';
import { GearItemCard } from '../../components/GearItemCard';
import { Plus, Package } from 'lucide-react-native';

export default function ChecklistTabScreen() {
  const { gearItems } = useGearStore();
  const packedItems = gearItems.filter(item => item.packed);
  const unpackedItems = gearItems.filter(item => !item.packed);

  const packingProgress = gearItems.length > 0 ? (packedItems.length / gearItems.length) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Checklist</Text>
        <Link href="/gear/new" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color={colors.white} />
          </TouchableOpacity>
        </Link>
      </View>

      {gearItems.length > 0 ? (
        <>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Package size={24} color={colors.primary} />
              <Text style={styles.progressTitle}>Packing Progress</Text>
            </View>
            <Text style={styles.progressText}>
              {packedItems.length} of {gearItems.length} items packed
            </Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${packingProgress}%` }]} />
            </View>
            <Text style={styles.progressPercentage}>{Math.round(packingProgress)}%</Text>
          </View>

          <FlatList
            data={gearItems}
            renderItem={({ item }) => <GearItemCard item={item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <View style={styles.emptyState}>
          <Package size={64} color={colors.textMuted} />
          <Text style={styles.emptyStateTitle}>No Gear Items</Text>
          <Text style={styles.emptyStateText}>
            Start building your packing checklist by adding gear items.
          </Text>
          <Link href="/gear/new" asChild>
            <TouchableOpacity style={styles.createButton}>
              <Text style={styles.createButtonText}>Add First Item</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});