import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { GearItem } from '@/types/gear';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Card } from './Card';
import { Check, X } from 'lucide-react-native';
import { useGearStore } from '@/store/gearStore';

interface GearItemCardProps {
  item: GearItem;
  onPress?: () => void;
}

export const GearItemCard: React.FC<GearItemCardProps> = ({ 
  item,
  onPress,
}) => {
  const { togglePackedStatus } = useGearStore();
  
  const handleToggle = () => {
    togglePackedStatus(item.id);
  };
  
  return (
    <Card style={styles.card}>
      <TouchableOpacity 
        style={styles.container}
        onPress={onPress}
        activeOpacity={0.7}
      >
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
        
        <View style={styles.content}>
          <Text style={styles.name}>{item.name}</Text>
          
          {item.weight && (
            <Text style={styles.weight}>{item.weight} kg</Text>
          )}
          
          {item.notes && (
            <Text style={styles.notes} numberOfLines={2}>{item.notes}</Text>
          )}
        </View>
        
        <TouchableOpacity 
          style={[
            styles.statusButton,
            item.isPacked ? styles.packedButton : styles.unpackedButton
          ]}
          onPress={handleToggle}
        >
          {item.isPacked ? (
            <Check size={18} color={colors.success} />
          ) : (
            <X size={18} color={colors.error} />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginBottom: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.background.input,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    ...typography.subheading,
    fontSize: 16,
    marginBottom: 4,
  },
  weight: {
    ...typography.caption,
    fontSize: 13,
    marginBottom: 4,
  },
  notes: {
    ...typography.small,
    color: colors.text.tertiary,
  },
  statusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  packedButton: {
    backgroundColor: `${colors.success}20`,
  },
  unpackedButton: {
    backgroundColor: `${colors.error}20`,
  },
});