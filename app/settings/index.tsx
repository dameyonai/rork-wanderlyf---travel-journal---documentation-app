import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { TabBar } from '@/components/TabBar';
import { useTripStore } from '@/store/tripStore';
import { useProfileStore } from '@/store/profileStore';
import { useRouter } from 'expo-router';
import { User, Bell, Moon, Database, Shield, HelpCircle, ChevronRight } from 'lucide-react-native';

export default function SettingsScreen() {
  const { trips } = useTripStore();
  const { name, updateProfile } = useProfileStore();
  const router = useRouter();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(name);
  
  const handleEditProfile = () => {
    router.push('/settings/profile');
  };

  const handleNameEdit = () => {
    if (isEditingName) {
      // Save the name
      updateProfile({ name: tempName.trim() || 'Traveler' });
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
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.profileAvatar}>
            <User size={32} color={colors.text.primary} />
          </View>
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
                <Text style={styles.profileName}>{name}</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.profileStats}>
              {trips.length} trips • {trips.reduce((total, trip) => total + trip.stats.daysOnTrip, 0)} days
            </Text>
          </View>
          {!isEditingName && (
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          )}
        </View>
        
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
    marginBottom: 24,
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
});