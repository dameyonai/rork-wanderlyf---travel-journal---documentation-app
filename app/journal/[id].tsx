import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { useTripStore } from '@/store/tripStore';
import { formatDate } from '@/utils/dateUtils';
import { MapPin, Calendar, CloudSun, Heart, Edit, Trash } from 'lucide-react-native';

export default function JournalEntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { journalEntries, deleteJournalEntry } = useTripStore();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const entry = journalEntries.find(entry => entry.id === id);
  
  if (!entry) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Entry not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  const handleEdit = () => {
    router.push(`/journal/edit/${entry.id}`);
  };
  
  const handleDelete = () => {
    Alert.alert(
      "Delete Entry",
      "Are you sure you want to delete this journal entry? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            setIsDeleting(true);
            deleteJournalEntry(entry.id);
            router.back();
          }
        }
      ]
    );
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {entry.imageUri && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: entry.imageUri }} 
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        )}
        
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.categoryContainer}>
              <Text style={styles.category}>{entry.category}</Text>
            </View>
            <Text style={styles.title}>{entry.title}</Text>
          </View>
          
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Calendar size={16} color={colors.text.secondary} />
              <Text style={styles.metaText}>{formatDate(entry.date)}</Text>
            </View>
            
            <View style={styles.metaItem}>
              <MapPin size={16} color={colors.text.secondary} />
              <Text style={styles.metaText}>{entry.location.name}</Text>
            </View>
            
            {entry.weather && (
              <View style={styles.metaItem}>
                <CloudSun size={16} color={colors.text.secondary} />
                <Text style={styles.metaText}>{entry.weather}</Text>
              </View>
            )}
            
            {entry.mood && (
              <View style={styles.metaItem}>
                <Heart size={16} color={colors.text.secondary} />
                <Text style={styles.metaText}>{entry.mood}</Text>
              </View>
            )}
          </View>
          
          <Text style={styles.contentText}>{entry.content}</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]}
              onPress={handleEdit}
              disabled={isDeleting}
            >
              <Edit size={18} color={colors.text.primary} />
              <Text style={styles.actionButtonText}>Edit Entry</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
              disabled={isDeleting}
            >
              <Trash size={18} color={colors.error} />
              <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 16,
  },
  categoryContainer: {
    backgroundColor: `${colors.accent.primary}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  category: {
    color: colors.accent.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    ...typography.title,
    fontSize: 24,
  },
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  metaText: {
    ...typography.small,
    marginLeft: 6,
  },
  contentText: {
    ...typography.body,
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    ...typography.heading,
    marginBottom: 16,
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.accent.primary,
    borderRadius: 8,
  },
  backButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40,
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  editButton: {
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  deleteButton: {
    backgroundColor: `${colors.error}15`,
    borderWidth: 1,
    borderColor: `${colors.error}30`,
  },
  actionButtonText: {
    fontWeight: '600',
    marginLeft: 8,
    color: colors.text.primary,
  },
  deleteButtonText: {
    color: colors.error,
  },
});