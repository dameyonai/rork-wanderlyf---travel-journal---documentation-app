import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useAssetStore } from '@/store/assetStore';
import { DigitalAsset } from '@/types';
import { Plus, Camera, Satellite, Zap, Package, Edit3, Trash2 } from 'lucide-react-native';

const AssetTypeIcon = ({ type }: { type: DigitalAsset['type'] }) => {
  const iconProps = { size: 20, color: colors.text };
  
  switch (type) {
    case 'Action Camera':
      return <Camera {...iconProps} />;
    case 'Satellite':
      return <Satellite {...iconProps} />;
    case 'Drone':
      return <Zap {...iconProps} />;
    default:
      return <Package {...iconProps} />;
  }
};

const AssetCard = ({ asset, onEdit, onDelete }: { 
  asset: DigitalAsset; 
  onEdit: () => void;
  onDelete: () => void;
}) => (
  <View style={styles.assetCard}>
    {asset.imageUri && (
      <Image source={{ uri: asset.imageUri }} style={styles.assetImage} />
    )}
    <View style={styles.assetContent}>
      <View style={styles.assetHeader}>
        <View style={styles.assetTitleRow}>
          <AssetTypeIcon type={asset.type} />
          <Text style={styles.assetName}>{asset.name}</Text>
        </View>
        <View style={styles.assetActions}>
          <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
            <Edit3 size={16} color={colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
            <Trash2 size={16} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.assetDetails}>
        <Text style={styles.assetType}>{asset.type}</Text>
        <Text style={styles.assetSerial}>S/N: {asset.serialNumber}</Text>
      </View>
      
      {asset.notes && (
        <Text style={styles.assetNotes}>{asset.notes}</Text>
      )}
    </View>
  </View>
);

export default function AssetsScreen() {
  const router = useRouter();
  const { assets, deleteAsset } = useAssetStore();
  const [selectedType, setSelectedType] = useState<DigitalAsset['type'] | 'All'>('All');

  const assetTypes: (DigitalAsset['type'] | 'All')[] = ['All', 'Action Camera', 'Satellite', 'Drone', 'Other'];

  const filteredAssets = selectedType === 'All' 
    ? assets 
    : assets.filter(asset => asset.type === selectedType);

  const handleDeleteAsset = (asset: DigitalAsset) => {
    Alert.alert(
      'Delete Asset',
      `Are you sure you want to delete "${asset.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => deleteAsset(asset.id) 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Digital Assets</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/assets/new')}
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {assetTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterButton,
              selectedType === type && styles.filterButtonActive
            ]}
            onPress={() => setSelectedType(type)}
          >
            <Text style={[
              styles.filterButtonText,
              selectedType === type && styles.filterButtonTextActive
            ]}>
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredAssets.length === 0 ? (
          <View style={styles.emptyState}>
            <Package size={48} color={colors.textMuted} />
            <Text style={styles.emptyTitle}>No Assets Found</Text>
            <Text style={styles.emptySubtitle}>
              {selectedType === 'All' 
                ? 'Add your first digital asset to get started'
                : `No ${selectedType.toLowerCase()} assets found`
              }
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => router.push('/assets/new')}
            >
              <Text style={styles.emptyButtonText}>Add Asset</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredAssets.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onEdit={() => router.push(`/assets/edit/${asset.id}`)}
              onDelete={() => handleDeleteAsset(asset)}
            />
          ))
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterContent: {
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  assetCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    overflow: 'hidden',
  },
  assetImage: {
    width: '100%',
    height: 160,
  },
  assetContent: {
    padding: 20,
  },
  assetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  assetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  assetName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  assetActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  assetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  assetType: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  assetSerial: {
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: 'monospace',
  },
  assetNotes: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});