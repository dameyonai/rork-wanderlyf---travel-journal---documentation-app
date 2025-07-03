import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useTripStore } from '@/store/tripStore';
import { generateId } from '@/utils/idGenerator';
import * as ImagePicker from 'expo-image-picker';
import { Camera, Image as ImageIcon } from 'lucide-react-native';

export default function NewPhotoScreen() {
  const router = useRouter();
  const { activeTrip, addPhoto } = useTripStore();
  
  const [imageUri, setImageUri] = useState<string>('');
  const [caption, setCaption] = useState('');
  const [locationName, setLocationName] = useState('');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!activeTrip) {
      Alert.alert('Error', 'No active trip found');
      return;
    }

    if (!imageUri) {
      Alert.alert('Missing Photo', 'Please select or take a photo');
      return;
    }

    if (!locationName.trim()) {
      Alert.alert('Missing Location', 'Please enter a location name');
      return;
    }

    const newPhoto = {
      id: generateId(),
      tripId: activeTrip.id,
      imageUri,
      caption: caption.trim(),
      location: {
        name: locationName.trim(),
        latitude: 0, // TODO: Add actual location detection
        longitude: 0,
      },
      date: new Date().toISOString(),
    };

    addPhoto(newPhoto);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView 
        style={styles.keyboardView} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelButton}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Photo</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Image Picker */}
          <View style={styles.imageSection}>
            {imageUri ? (
              <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
                <Image source={{ uri: imageUri }} style={styles.selectedImage} />
              </TouchableOpacity>
            ) : (
              <View style={styles.imagePlaceholder}>
                <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                  <Camera size={24} color={colors.text.secondary} />
                  <Text style={styles.imageButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                  <ImageIcon size={24} color={colors.text.secondary} />
                  <Text style={styles.imageButtonText}>Choose from Library</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <TextInput
              style={styles.input}
              placeholder="Location name"
              placeholderTextColor={colors.text.tertiary}
              value={locationName}
              onChangeText={setLocationName}
            />
            
            <TextInput
              style={[styles.input, styles.captionInput]}
              placeholder="Add a caption (optional)"
              placeholderTextColor={colors.text.tertiary}
              value={caption}
              onChangeText={setCaption}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cancelButton: {
    color: colors.text.secondary,
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  saveButton: {
    color: colors.accent.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  imageSection: {
    marginBottom: 24,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: colors.background.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageButtonText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  formSection: {
    gap: 16,
  },
  input: {
    backgroundColor: colors.background.input,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text.primary,
  },
  captionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
});