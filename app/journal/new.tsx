import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Button } from '@/components/Button';
import { useTripStore } from '@/store/tripStore';
import { generateId } from '@/utils/idGenerator';
import { Camera, MapPin, Tag, X } from 'lucide-react-native';

const categories = [
  "Today's Drive",
  "Adventure",
  "Wildlife",
  "Food",
  "Scenery",
  "People",
  "Accommodation",
];

export default function NewJournalEntryScreen() {
  const router = useRouter();
  const { activeTrip, addJournalEntry } = useTripStore();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error('Image picker error:', error);
    }
  };
  
  const handleRemoveImage = () => {
    setImageUri(null);
  };
  
  const handleSubmit = () => {
    if (!title || !content || !location || !category) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }
    
    if (!activeTrip) {
      Alert.alert('Error', 'No active trip found');
      return;
    }
    
    setIsSubmitting(true);
    
    // Create new journal entry
    const newEntry = {
      id: generateId(),
      tripId: activeTrip.id,
      title,
      content,
      date: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
      location: {
        latitude: 0, // In a real app, we would get actual coordinates
        longitude: 0,
        name: location,
      },
      category,
      imageUri: imageUri || undefined,
    };
    
    // Add to store
    addJournalEntry(newEntry);
    
    // Navigate back
    router.back();
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.imageContainer}>
          {imageUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={handleRemoveImage}
              >
                <X size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.imagePicker}
              onPress={handlePickImage}
            >
              <Camera size={32} color={colors.text.secondary} />
              <Text style={styles.imagePickerText}>Add Photo</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Entry title"
            placeholderTextColor={colors.text.tertiary}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Location</Text>
          <View style={styles.inputWithIcon}>
            <MapPin size={18} color={colors.text.secondary} style={styles.inputIcon} />
            <TextInput
              style={styles.inputText}
              value={location}
              onChangeText={setLocation}
              placeholder="Where are you?"
              placeholderTextColor={colors.text.tertiary}
            />
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoriesContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryButton,
                  category === cat && styles.selectedCategoryButton,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text 
                  style={[
                    styles.categoryButtonText,
                    category === cat && styles.selectedCategoryButtonText,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Journal Entry</Text>
          <TextInput
            style={styles.textArea}
            value={content}
            onChangeText={setContent}
            placeholder="Write about your experience..."
            placeholderTextColor={colors.text.tertiary}
            multiline
            textAlignVertical="top"
          />
        </View>
        
        <Button 
          title="Save Entry" 
          onPress={handleSubmit}
          loading={isSubmitting}
          style={styles.submitButton}
        />
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
    padding: 20,
    paddingBottom: 40,
  },
  imageContainer: {
    marginBottom: 24,
  },
  imagePicker: {
    height: 200,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerText: {
    ...typography.caption,
    marginTop: 8,
  },
  imagePreviewContainer: {
    position: 'relative',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    ...typography.caption,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.background.input,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text.primary,
    fontSize: 16,
  },
  inputWithIcon: {
    backgroundColor: colors.background.input,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: 12,
  },
  inputText: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 16,
    padding: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  textArea: {
    backgroundColor: colors.background.input,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text.primary,
    fontSize: 16,
    minHeight: 150,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    backgroundColor: colors.background.input,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  selectedCategoryButton: {
    backgroundColor: `${colors.accent.primary}20`,
    borderColor: colors.accent.primary,
  },
  categoryButtonText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryButtonText: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 16,
  },
});