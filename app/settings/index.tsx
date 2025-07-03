import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { TabBar } from '@/components/TabBar';
import { useTripStore } from '@/store/tripStore';
import { useProfileStore } from '@/store/profileStore';
import { useRouter } from 'expo-router';
import { User, Bell, Moon, Database, Shield, HelpCircle, ChevronRight, Camera, Plus, Car, Image as ImageIcon } from 'lucide-react-native';
import { calculateDaysBetween } from '@/utils/dateUtils';

export default function SettingsScreen() {
  const { trips } = useTripStore();
  const { name, updateProfile } = useProfileStore();
  const router = useRouter();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [photoUri, setPhotoUri] = useState<string>();
  
  useEffect(() => {
    (async () => {
      const savedName = await AsyncStorage.getItem('profile:name');
      const savedPhotoUri = await AsyncStorage.getItem('profile:photoUri');
      if (savedName) setTempName(savedName);
      if (savedPhotoUri) setPhotoUri(savedPhotoUri);
    })();
  }, []);

  // Calculate dynamic trip stats
  const tripCount = trips.length;
  const totalDays = trips.reduce((sum, trip) => {
    const duration = calculateDaysBetween(trip.startDate, trip.endDate);
    return sum + duration;
  }, 0);

  const handleEditProfile = () => {
    router.push('/settings/profile');
  };

  const handleNameEdit = async () => {
    if (isEditingName) {
      // Save the name
      const finalName = tempName.trim() || 'SHDWBLK TRVLR';
      updateProfile({ name: finalName });
      await AsyncStorage.setItem('profile:name', finalName);
      setIsEditingName(false);
    } else {
      // Start editing
      setTempName(name);
      setIsEditingName(true);
    }
  };

  const handleNameCancel = () => {
    setTempName(name);
    setIsEditingName(false);
  };

  const handleNewTrip = () => {
    router.push('/trips/new');
  };

  const handleVehicle = () => {
    router.push('/vehicle');
  };

  const handleGallery = () => {
    router.push('/gallery');
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.profileAvatar} onPress={async () => {
            try {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') return;
              
              const result = await ImagePicker.launchImageLibraryAsync({
                quality: 0.7,
                allowsEditing: true,
                aspect: [1, 1],
              });
              
              if (!result.canceled) {
                setPhotoUri(result.assets[0].uri);
                await AsyncStorage.setItem('profile:photoUri', result.assets[0].uri);
              }
            } catch (error) {
              console.error('Error selecting photo:', error);
            }
          }}>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={styles.avatarImage} />
            ) : (
              <User size={32} color={colors.text.primary} />
            )}
            <View style={styles.cameraOverlay}>
              <Camera size={16} color="white" />
            </View>
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            {isEditingName ? (
              <View style={styles.nameEditContainer}>
                <TextInput
                  style={styles.nameInput}
                  value={tempName}
                  onChangeText={setTempName}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.text.tertiary}
                  autoFocus
                  selectTextOnFocus
                />
                <View style={styles.nameEditButtons}>
                  <TouchableOpacity onPress={handleNameCancel} style={styles.cancelButton}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleNameEdit} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity onPress={handleNameEdit}>
                <Text style={styles.profileName}>{name === 'Traveler' ? 'SHDWBLK TRVLR' : name}</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.profileStats}>
              {tripCount} {tripCount === 1 ? 'trip' : 'trips'} • {totalDays} days
            </Text>
          </View>
          {!isEditingName && (
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.newTripSection} onPress={handleNewTrip}>
          <View style={styles.newTripIcon}>
            <Plus size={24} color={colors.text.primary} />
          </View>
          <View style={styles.newTripInfo}>
            <Text style={styles.newTripTitle}>Create New Trip</Text>
            <Text style={styles.newTripSubtitle}>Start documenting a new adventure</Text>
          </View>
          <ChevronRight size={20} color={colors.text.tertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.newTripSection} onPress={handleVehicle}>
          <View style={styles.newTripIcon}>
            <Car size={24} color={colors.text.primary} />
          </View>
          <View style={styles.newTripInfo}>
            <Text style={styles.newTripTitle}>My Vehicle</Text>
            <Text style={styles.newTripSubtitle}>Manage photos and modifications</Text>
          </View>
          <ChevronRight size={20} color={colors.text.tertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.newTripSection} onPress={handleGallery}>
          <View style={styles.newTripIcon}>
            <ImageIcon size={24} color={colors.text.primary} />
          </View>
          <View style={styles.newTripInfo}>
            <Text style={styles.newTripTitle}>Photo Gallery</Text>
            <Text style={styles.newTripSubtitle}>Browse and edit your travel photos</Text>
          </View>
          <ChevronRight size={20} color={colors.text.tertiary} />
        </TouchableOpacity>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Bell size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Notifications</Text>
              <Text style={styles.settingDescription}>
                Receive trip reminders and updates
              </Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: colors.border, true: `${colors.accent.primary}80` }}
              thumbColor={colors.accent.primary}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Moon size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingDescription}>
                Always use dark theme
              </Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{ false: colors.border, true: `${colors.accent.primary}80` }}
              thumbColor={colors.accent.primary}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Database size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Export Data</Text>
              <Text style={styles.settingDescription}>
                Download all your trip data
              </Text>
            </View>
            <ChevronRight size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <Shield size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
              <Text style={styles.settingDescription}>
                How we handle your data
              </Text>
            </View>
            <ChevronRight size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingIcon}>
              <HelpCircle size={20} color={colors.text.primary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Help & Support</Text>
              <Text style={styles.settingDescription}>
                Get assistance with the app
              </Text>
            </View>
            <ChevronRight size={20} color={colors.text.tertiary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.version}>Wanderlyf v1.0.0</Text>
          <TouchableOpacity>
            <Text style={styles.logoutButton}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <TabBar />
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
    paddingBottom: 100,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${colors.accent.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    ...typography.heading,
    fontSize: 20,
    marginBottom: 4,
  },
  profileStats: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.background.input,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editButtonText: {
    ...typography.caption,
    color: colors.text.primary,
  },
  newTripSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  newTripIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${colors.accent.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newTripInfo: {
    flex: 1,
    marginLeft: 16,
  },
  newTripTitle: {
    ...typography.heading,
    fontSize: 20,
    marginBottom: 4,
  },
  newTripSubtitle: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.heading,
    fontSize: 18,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.accent.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingContent: {
    flex: 1,
    marginLeft: 16,
  },
  settingTitle: {
    ...typography.subheading,
    fontSize: 16,
    marginBottom: 2,
  },
  settingDescription: {
    ...typography.small,
    color: colors.text.tertiary,
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  version: {
    ...typography.small,
    color: colors.text.tertiary,
    marginBottom: 16,
  },
  logoutButton: {
    ...typography.body,
    color: colors.error,
    fontWeight: '600',
  },
  nameEditContainer: {
    width: '100%',
  },
  nameInput: {
    backgroundColor: colors.background.input,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  nameEditButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.background.input,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: '500',
  },
  saveButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.accent.primary,
    borderRadius: 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.accent.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background.primary,
  },
});