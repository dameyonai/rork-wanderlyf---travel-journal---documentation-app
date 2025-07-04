import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '@/constants/colors';
import { DigitalAsset } from '@/types';
import { Camera, Satellite, Zap, Package } from 'lucide-react-native';

interface AssetCardProps {
  asset: DigitalAsset;
  onPress?: () => void;
  compact?: boolean;
}

const AssetTypeIcon = ({ type }: { type: DigitalAsset['type'] }) => {
  const iconProps = { size: 16, color: colors.primary };
  
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

export const AssetCard: React.FC<AssetCardProps> = ({ asset, onPress, compact = false }) => {
  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent style={[styles.card, compact && styles.cardCompact]} onPress={onPress}>
      {asset.imageUri && !compact && (
        <Image source={{ uri: asset.imageUri }} style={styles.assetImage} />
      )}
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <AssetTypeIcon type={asset.type} />
            <Text style={[styles.name, compact && styles.nameCompact]} numberOfLines={compact ? 1 : 2}>
              {asset.name}
            </Text>
          </View>
        </View>
        
        <View style={styles.details}>
          <Text style={styles.type}>{asset.type}</Text>
          {!compact && (
            <Text style={styles.serial}>S/N: {asset.serialNumber}</Text>
          )}
        </View>
        
        {asset.notes && !compact && (
          <Text style={styles.notes} numberOfLines={2}>
            {asset.notes}
          </Text>
        )}
      </View>
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  cardCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  assetImage: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: 16,
    flex: 1,
  },
  header: {
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  nameCompact: {
    fontSize: 14,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  type: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  serial: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: 'monospace',
  },
  notes: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});