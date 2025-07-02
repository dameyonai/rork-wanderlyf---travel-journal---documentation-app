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
import { DatePicker } from '@/components/DatePicker';
import { useTripStore } from '@/store/tripStore';
import { generateId } from '@/utils/idGenerator';
import { calculateDaysBetween } from '@/utils/dateUtils';
import { Camera, X } from 'lucide-react-native';

export default function NewTripScreen() {
  const router = useRouter();
  const { addTrip, setActiveTrip } = useTripStore();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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
    if (!title || !description || !startDate || !endDate) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }
    
    // Validate that end date is after start date
    if (new Date(endDate) <= new Date(startDate)) {
      Alert.alert('Invalid Dates', 'End date must be after start date');
      return;
    }
    
    setIsSubmitting(true);
    
    // Create new trip
    const tripId = generateId();
    const newTrip = {
      id: tripId,
      title,
      description,
      startDate,
      endDate,
      coverImageUri: imageUri || undefined,
      stats: {
        distanceTraveled: 0,
        placesVisited: 0,
        photosCount: 0,
        daysOnTrip: calculateDaysBetween(startDate, endDate),
      },
      locations: [],
      isActive: true,
    };
    
    // Add to store and set as active
    addTrip(newTrip);
    setActiveTrip(tripId);
    
    // Navigate back to home
    router.push('/');
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
              <View style={styles.imagePickerContent}>
                <Camera size={32} color={colors.text.secondary} />
                <Text style={styles.imagePickerText}>Add Cover Photo</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Trip Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Give your trip a name"
            placeholderTextColor={colors.text.tertiary}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="What's this trip about?"
            placeholderTextColor={colors.text.tertiary}
            multiline
            textAlignVertical="top"
          />
        </View>
        
        <View style={styles.dateContainer}>
          <View style={styles.dateField}>
            <DatePicker
              label="Start Date"
              value={startDate}
              onDateChange={setStartDate}
              placeholder="Select start date"
            />
          </View>
          
          <View style={styles.dateField}>
            <DatePicker
              label="End Date"
              value={endDate}
              onDateChange={setEndDate}
              placeholder="Select end date"
            />
          </View>
        </View>
        
        <Button 
          title="Create Trip" 
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
    overflow: 'hidden',
  },
  imagePickerContent: {
    width: '100%',
    height: '100%',
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
  textArea: {
    backgroundColor: colors.background.input,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text.primary,
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
    gap: 12,
    marginBottom: 24,
  },
  dateField: {
    flex: 1,
  },
  submitButton: {
    marginTop: 16,
  },
});