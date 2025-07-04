import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '@/constants/colors';
import { useAssetStore } from '@/store/assetStore';
import { DigitalAsset } from '@/types';
import { ArrowLeft, Camera, Check } from 'lucide-react-native';

const assetTypes: DigitalAsset['type'][] = ['Action Camera', 'Satellite', 'Drone', 'Other'];

export default function NewAssetScreen() {
  const router = useRouter();
  const { addAsset } = useAssetStore();
  
  const [name, setName] = useState('');
  const [type, setType] = useState<DigitalAsset['type']>('Action Camera');
  const [serialNumber, setSerialNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [imageUri, setImageUri] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please grant camera roll permissions to add photos.');
        return;
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
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an asset name');
      return;
    }

    if (!serialNumber.trim()) {
      Alert.alert('Error', 'Please enter a serial number');
      return;
    }

    setIsSubmitting(true);

    try {
      addAsset({
        name: name.trim(),
        type,
        serialNumber: serialNumber.trim(),
        notes: notes.trim(),
        imageUri,
      });

      router.back();
    } catch (error) {
      console.error('Error adding asset:', error);
      Alert.alert('Error', 'Failed to add asset');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Asset</Text>
        <TouchableOpacity 
          onPress={handleSubmit} 
          style={[styles.saveButton, isSubmitting && styles.saveButtonDisabled]}
          disabled={isSubmitting}
        >
          <Check size={20} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.imageContainer} onPress={handleImagePicker}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.assetImage} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Camera size={32} color={colors.textMuted} />
              <Text style={styles.imagePlaceholderText}>Add Photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Asset Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g., GoPro HERO12 Black"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.typeGrid}>
              {assetTypes.map((assetType) => (
                <TouchableOpacity
                  key={assetType}
                  style={[
                    styles.typeButton,
                    type === assetType && styles.typeButtonActive
                  ]}
                  onPress={() => setType(assetType)}
                >
                  <Text style={[
                    styles.typeButtonText,
                    type === assetType && styles.typeButtonTextActive
                  ]}>
                    {assetType}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Serial Number</Text>
            <TextInput
              style={[styles.input, styles.serialInput]}
              value={serialNumber}
              onChangeText={setSerialNumber}
              placeholder="Enter serial number"
              placeholderTextColor={colors.textMuted}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, styles.notesInput]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any additional notes..."
              placeholderTextColor={colors.textMuted}
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  saveButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  imageContainer: {
    marginBottom: 24,
  },
  assetImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  imagePlaceholderText: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '500',
  },
  form: {
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  serialInput: {
    fontFamily: 'monospace',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  typeButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  typeButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
});