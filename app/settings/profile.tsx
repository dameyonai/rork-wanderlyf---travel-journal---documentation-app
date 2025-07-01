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
import { useProfileStore } from '@/store/profileStore';
import { Camera, User, X } from 'lucide-react-native';

export default function ProfileEditScreen() {
  const router = useRouter();
  const { name, email, bio, updateProfile } = useProfileStore();
  
  const [profileName, setProfileName] = useState(name);
  const [profileEmail, setProfileEmail] = useState(email || '');
  const [profileBio, setProfileBio] = useState(bio || '');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handlePickImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to change your avatar.');
          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setAvatarUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error('Image picker error:', error);
    }
  };
  
  const handleRemoveImage = () => {
    setAvatarUri(null);
  };
  
  const handleSave = () => {
    if (!profileName.trim()) {
      Alert.alert('Validation Error', 'Please enter your name');
      return;
    }
    
    setIsSubmitting(true);
    
    // Update profile in store
    updateProfile({
      name: profileName.trim(),
      email: profileEmail.trim() || undefined,
      bio: profileBio.trim() || undefined,
    });
    
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
        <View style={styles.avatarContainer}>
          {avatarUri ? (
            <View style={styles.avatarImageContainer}>
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              <TouchableOpacity 
                style={styles.removeAvatarButton}
                onPress={handleRemoveImage}
              >
                <X size={16} color="white" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.avatarPlaceholder}
              onPress={handlePickImage}
            >
              <User size={32} color={colors.text.primary} />
              <TouchableOpacity 
                style={styles.cameraButton}
                onPress={handlePickImage}
              >
                <Camera size={16} color="white" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          <Text style={styles.avatarHint}>Tap to change photo</Text>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Name *</Text>
          <TextInput
            style={styles.input}
            value={profileName}
            onChangeText={setProfileName}
            placeholder="Enter your name"
            placeholderTextColor={colors.text.tertiary}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={profileEmail}
            onChangeText={setProfileEmail}
            placeholder="Enter your email (optional)"
            placeholderTextColor={colors.text.tertiary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={styles.textArea}
            value={profileBio}
            onChangeText={setProfileBio}
            placeholder="Tell us about yourself..."
            placeholderTextColor={colors.text.tertiary}
            multiline
            textAlignVertical="top"
          />
        </View>
        
        <Button 
          title="Save Changes" 
          onPress={handleSave}
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: `${colors.accent.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  avatarImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.accent.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
  removeAvatarButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarHint: {
    ...typography.small,
    color: colors.text.tertiary,
    marginTop: 8,
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
    minHeight: 100,
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