import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { JournalEntry } from '@/types/trip';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Card } from './Card';
import { formatDate } from '@/utils/dateUtils';
import { Edit, Camera } from 'lucide-react-native';
import { Feather } from '@expo/vector-icons';

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
  
  const handleEdit = (e: any) => {
    e.stopPropagation(); // Prevent card press
    router.push(`/journal/edit/${entry.id}`);
  };
  
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Card style={styles.card}>
        {entry.imageUri ? (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: entry.imageUri }} 
              style={compact ? styles.compactImage : styles.image}
              resizeMode="cover"
            />
            <TouchableOpacity 
              style={styles.editOverlay}
              onPress={handleEdit}
            >
              <Edit size={16} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.photoIndicator}
              onPress={handleEdit}
            >
              <Camera size={14} color="white" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={[
            compact ? styles.compactImagePlaceholder : styles.imagePlaceholder,
            styles.imagePlaceholderContent
          ]}>
            <Camera size={32} color={colors.textMuted} />
            <Text style={styles.imagePlaceholderText}>Tap to add photo</Text>
            <TouchableOpacity 
              style={styles.editOverlay}
              onPress={handleEdit}
            >
              <Edit size={16} color="white" />
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.content}>
          <View style={styles.header}>
            <View>
              <Text style={styles.date}>{formatDate(entry.date)}</Text>
              <View style={styles.locationContainer}>
                <Feather name="map-pin" size={12} color={colors.textMuted} />
                <Text style={styles.location}>{entry.location.name}</Text>
              </View>
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
    backgroundColor: colors.surface,
  },
  compactImagePlaceholder: {
    width: '100%',
    height: 120,
    backgroundColor: colors.surface,
  },
  imagePlaceholderContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: colors.textMuted,
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
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  location: {
    color: colors.textMuted,
    fontSize: 13,
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  categoryContainer: {
    backgroundColor: `${colors.primary}20`,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  category: {
    color: colors.primary,
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
    color: colors.textSecondary,
    lineHeight: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  editOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    padding: 8,
  },
  photoIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    padding: 6,
  },
});