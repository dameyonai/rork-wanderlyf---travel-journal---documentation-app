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
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { format } from 'date-fns';
import { colors } from '../../constants/colors';
import { useTripStore } from '../../store/tripStore';
import { Camera, X, ChevronLeft } from 'lucide-react-native';

export default function NewTripScreen() {
  const router = useRouter();
  const { addTrip } = useTripStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  
  const handlePickImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to add photos.');
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
    setImageUri(null);
  };
  
  const handleSubmit = () => {
    if (!title || !description) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    
    // Validate that end date is after start date
    if (endDate <= startDate) {
      Alert.alert('Invalid Dates', 'End date must be after start date');
      return;
    }
    
    setIsSubmitting(true);
    
    // Create new trip using the store's addTrip method
    const newTripData = {
      title,
      description,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      vehicleImageUri: imageUri || undefined,
    };
    
    addTrip(newTripData);
    
    // Navigate back to home
    router.replace('/');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Trip</Text>
          <TouchableOpacity 
            onPress={handleSubmit} 
            disabled={isSubmitting || !title || !description}
            style={[styles.saveButton, (!title || !description) && styles.saveButtonDisabled]}
          >
            <Text style={[styles.saveButtonText, (!title || !description) && styles.saveButtonTextDisabled]}>
              {isSubmitting ? 'Creating...' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Cover Image */}
          <View style={styles.imageContainer}>
            {imageUri ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={handleRemoveImage}
                >
                  <X size={20} color={colors.white} />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={styles.imagePicker}
                onPress={handlePickImage}
              >
                <View style={styles.imagePickerContent}>
                  <Camera size={32} color={colors.textMuted} />
                  <Text style={styles.imagePickerText}>Add Vehicle Photo</Text>
                  <Text style={styles.imagePickerSubtext}>Optional</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Trip Title */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Trip Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. NT Outback Adventure"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          
          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={styles.textArea}
              value={description}
              onChangeText={setDescription}
              placeholder="Tell us about your upcoming adventure..."
              placeholderTextColor={colors.textMuted}
              multiline
              textAlignVertical="top"
            />
          </View>
          
          {/* Dates */}
          <View style={styles.dateContainer}>
            <View style={styles.dateField}>
              <Text style={styles.label}>Start Date</Text>
              <Text style={styles.dateDisplay}>
                {format(startDate, 'MMM dd, yyyy')}
              </Text>
            </View>
            
            <View style={styles.dateField}>
              <Text style={styles.label}>End Date</Text>
              <Text style={styles.dateDisplay}>
                {format(endDate, 'MMM dd, yyyy')}
              </Text>
            </View>
          </View>
          
          <Text style={styles.dateNote}>
            💡 You can adjust dates later in trip settings
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: colors.surface,
  },
  saveButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 16,
  },
  saveButtonTextDisabled: {
    color: colors.textMuted,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  imageContainer: {
    marginBottom: 32,
  },
  imagePicker: {
    height: 200,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  imagePickerContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
    marginTop: 12,
  },
  imagePickerSubtext: {
    color: colors.textMuted,
    fontSize: 14,
    marginTop: 4,
  },
  imagePreviewContainer: {
    position: 'relative',
    height: 200,
    borderRadius: 16,
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: colors.text,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: colors.text,
    fontSize: 16,
    minHeight: 120,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  dateContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  dateField: {
    flex: 1,
  },
  dateDisplay: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: colors.text,
    fontSize: 16,
  },
  dateNote: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
});