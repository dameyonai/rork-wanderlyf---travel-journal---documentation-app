import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Button } from '@/components/Button';
import { useTripStore } from '@/store/tripStore';
import { generateId } from '@/utils/idGenerator';
import { Camera, MapPin, Calendar, Tag, X } from 'lucide-react-native';
import type { JournalEntry, Location } from '@/types/trip';

const categories = [
  "Today's Drive",
  "Adventure",
  "Wildlife",
  "Food",
  "Scenery",
  "People",
  "Accommodation",
];

export default function EditJournalEntryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string, locationName?: string, latitude?: string, longitude?: string }>();
  
  const { journalEntries, updateJournalEntry } = useTripStore();
  
  const entry = journalEntries.find(e => e.id === params.id);

  const [title, setTitle] = useState('');
  const [location, setLocation] = useState<Location | undefined>();
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [imageUri, setImageUri] = useState<string | undefined>();
  
  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setLocation(entry.location); 
      setCategory(entry.category);
      setContent(entry.content);
      setImageUri(entry.imageUri);
    }
  }, [entry]);

  useEffect(() => {
    if (params.locationName && params.latitude && params.longitude) {
      const newLocation: Location = {
        name: params.locationName,
        latitude: parseFloat(params.latitude),
        longitude: parseFloat(params.longitude),
      };
      setLocation(newLocation);
    }
  }, [params.locationName, params.latitude, params.longitude]);

  const pickImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
          return;
        }
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSave = () => {
    if (!entry) {
        Alert.alert("Error", "Could not find the entry to update.");
        return;
    }
    if (!title || !content || !location) {
        Alert.alert("Validation Error", "Please fill in all fields and select a location.");
        return;
    }

    const updatedEntry: JournalEntry = {
        ...entry,
        title,
        location,
        category,
        content,
        imageUri,
    }

    updateJournalEntry(entry.id, updatedEntry);
    router.back();
  };

  if (!entry) {
      return (
          <SafeAreaView style={styles.container}>
              <Text style={{color: colors.text.primary, textAlign: 'center', marginTop: 50}}>Entry not found.</Text>
          </SafeAreaView>
      )
  }

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
                onPress={() => setImageUri(undefined)}
              >
                <X size={20} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.imagePicker}
              onPress={pickImage}
            >
              <Camera size={32} color={colors.text.secondary} />
              <Text style={styles.imagePickerText}>+ Change Photo</Text>
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
          <TouchableOpacity 
            style={styles.inputWithIcon}
            onPress={() => router.push('/map/picker')}
          >
            <MapPin size={18} color={colors.text.secondary} style={styles.inputIcon} />
            <Text style={[
              styles.inputText,
              !location && styles.placeholderText
            ]}>
              {location ? location.name : 'Select location on map'}
            </Text>
          </TouchableOpacity>
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
          title="Save Changes" 
          onPress={handleSave}
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
    color: colors.text.secondary,
    fontSize: 18,
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
  placeholderText: {
    color: colors.text.tertiary,
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
  submitButton: {
    marginTop: 16,
  },
});