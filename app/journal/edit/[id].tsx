import React, { useState, useEffect } from 'react';
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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Button } from '@/components/Button';
import { useTripStore } from '@/store/tripStore';
import { Camera, MapPin, Tag, X, Trash2 } from 'lucide-react-native';

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
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { journalEntries, updateJournalEntry } = useTripStore();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [category, setCategory] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Find the entry to edit
  const entry = journalEntries.find(entry => entry.id === id);
  
  // Load entry data when component mounts
  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
      setLocation(entry.location.name);
      setSelectedLocation(entry.location);
      setCategory(entry.category);
      setImageUri(entry.imageUri || null);
    } else {
      Alert.alert('Error', 'Entry not found');
      router.back();
    }
  }, [entry]);

  // Handle location selection from map picker
  useEffect(() => {
    const params = router.params as any;
    if (params?.locationName && params?.latitude && params?.longitude) {
      const locationData: Location = {
        name: params.locationName,
        latitude: parseFloat(params.latitude),
        longitude: parseFloat(params.longitude),
      };
      setSelectedLocation(locationData);
      setLocation(params.locationName);
    }
  }, [router.params]);

  const handlePickImage = async () => {
    try {
      // Request permissions for non-web platforms
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to change photos.');
          return;
        }
      }

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
    Alert.alert(
      'Remove Photo',
      'Are you sure you want to remove this photo?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => setImageUri(null) }
      ]
    );
  };
  
  const handleLocationPicker = () => {
    router.push('/map/picker');
  };
  
  const handleSubmit = () => {
    if (!title || !content || !location || !category) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }
    
    if (!entry) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Update journal entry
    const updatedEntry = {
      title,
      content,
      category,
      imageUri: imageUri || undefined,
      location: selectedLocation || {
        ...entry.location,
        name: location,
      },
    };
    
    updateJournalEntry(entry.id, updatedEntry);
    router.back();
  };
  
  if (!entry) {
    return null; // Will redirect in useEffect
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
          <TouchableOpacity 
            style={styles.inputWithIcon}
            onPress={handleLocationPicker}
          >
            <MapPin size={18} color={colors.text.secondary} style={styles.inputIcon} />
            <Text style={[
              styles.inputText,
              !location && styles.placeholderText
            ]}>
              {location || 'Select location on map'}
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
          onPress={handleSubmit}
          loading={isSubmitting}
          style={styles.submitButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  cancelButton: { color: colors.primary, fontSize: 16 },
  headerTitle: { color: colors.text, fontSize: 18, fontWeight: '600' },
  saveButton: { color: colors.primary, fontSize: 16, fontWeight: 'bold' },
  formContainer: { padding: 20 },
  imagePicker: { height: 200, backgroundColor: colors.surface, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  imagePickerText: { color: colors.textMuted, fontSize: 18 },
  imagePreview: { width: '100%', height: '100%', borderRadius: 12 },
  input: { backgroundColor: colors.surface, color: colors.text, padding: 15, borderRadius: 8, fontSize: 16, marginBottom: 15, borderWidth: 1, borderColor: colors.border },
  contentInput: { height: 150, textAlignVertical: 'top' },
  locationPicker: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: colors.border, gap: 10 },
  locationText: { color: colors.text, fontSize: 16 }
});