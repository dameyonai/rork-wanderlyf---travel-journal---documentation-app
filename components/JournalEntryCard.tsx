import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { JournalEntry } from '@/types/trip';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Card } from './Card';
import { formatDate } from '@/utils/dateUtils';

interface JournalEntryCardProps {
  entry: JournalEntry;
  compact?: boolean;
}

export const JournalEntryCard: React.FC<JournalEntryCardProps> = ({ 
  entry,
  compact = false,
}) => {
  const router = useRouter();
  
  const handlePress = () => {
    router.push(`/journal/${entry.id}`);
  };
  
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Card style={styles.card}>
        {entry.imageUri ? (
          <Image 
            source={{ uri: entry.imageUri }} 
            style={compact ? styles.compactImage : styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={[
            compact ? styles.compactImagePlaceholder : styles.imagePlaceholder,
            styles.imagePlaceholderContent
          ]}>
            <Text style={styles.imagePlaceholderText}>No Image</Text>
          </View>
        )}
        
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.date}>{formatDate(entry.date)}</Text>
              <Text style={styles.location}>{entry.location.name}</Text>
            </View>
            <View style={styles.categoryContainer}>
              <Text style={styles.category}>{entry.category}</Text>
            </View>
          </View>
          
          <Text style={styles.title}>{entry.title}</Text>
          
          {!compact && (
            <Text 
              style={styles.text} 
              numberOfLines={3}
            >
              {entry.content}
            </Text>
          )}
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  compactImage: {
    width: '100%',
    height: 120,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: colors.background.secondary,
  },
  compactImagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: colors.background.secondary,
  },
  imagePlaceholderContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: colors.text.tertiary,
    fontSize: 14,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  date: {
    color: colors.accent.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  location: {
    color: colors.text.tertiary,
    fontSize: 13,
    marginTop: 2,
  },
  categoryContainer: {
    backgroundColor: `${colors.accent.primary}20`,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  category: {
    color: colors.accent.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    ...typography.subheading,
    marginBottom: 8,
  },
  text: {
    ...typography.body,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});