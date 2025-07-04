import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ChecklistItem } from '../types';
import { colors } from '../constants/colors';
import { Check, X } from 'lucide-react-native';

interface ChecklistItemCardProps {
  item: ChecklistItem;
  onToggle: () => void;
  onRemove?: () => void;
  showRemove?: boolean;
}

export const ChecklistItemCard: React.FC<ChecklistItemCardProps> = ({
  item,
  onToggle,
  onRemove,
  showRemove = false
}) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    // Add a subtle animation when toggling
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    onToggle();
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity
        style={[styles.itemContainer, item.checked && styles.checkedContainer]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, item.checked && styles.checkedCheckbox]}>
          {item.checked && <Check size={16} color={colors.white} strokeWidth={3} />}
        </View>
        
        <Text style={[styles.itemText, item.checked && styles.checkedText]}>
          {item.text}
        </Text>
        
        {showRemove && onRemove && (
          <TouchableOpacity
            style={styles.removeButton}
            onPress={onRemove}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  checkedContainer: {
    backgroundColor: colors.primaryMuted,
    borderColor: colors.primary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  checkedCheckbox: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
  },
  checkedText: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  removeButton: {
    padding: 4,
  },
});