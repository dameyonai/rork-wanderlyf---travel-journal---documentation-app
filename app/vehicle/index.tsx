import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  Alert,
  Platform,
  TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useVehicleStore } from '@/store/vehicleStore';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { formatDate } from '@/utils/dateUtils';
import { Camera, Plus, Edit, Trash, Car } from 'lucide-react-native';

export default function VehicleScreen() {
  const router = useRouter();
  const { vehicle, updateVehiclePhoto, updateVehicleName, deleteModification } = useVehicleStore();
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(vehicle.name);

  const pickImage = async () => {
    try {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to change the vehicle photo.');
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
        updateVehiclePhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error('Image picker error:', error);
    }
  };

  const handleNameEdit = () => {
    if (isEditingName) {
      updateVehicleName(tempName.trim() || 'My Vehicle');
      setIsEditingName(false);
    } else {
      setTempName(vehicle.name);
      setIsEditingName(true);
    }
  };

  const handleDeleteMod = (modId: string, modName: string) => {
    Alert.alert(
      "Delete Modification",
      `Are you sure you want to delete "${modName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => deleteModification(modId)
        }
      ]
    );
  };

  const handleNewMod = () => {
    router.push('/vehicle/new-mod');
  };

  const renderModification = ({ item }: { item: any }) => (
    <Card style={styles.modCard}>
      <View style={styles.modHeader}>
        <View style={styles.modInfo}>
          <Text style={styles.modName}>{item.name}</Text>
          <Text style={styles.modDate}>Added {formatDate(item.dateAdded)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDeleteMod(item.id, item.name)}
        >
          <Trash size={18} color={colors.error} />
        </TouchableOpacity>
      </View>
      {item.description && (
        <Text style={styles.modDescription}>{item.description}</Text>
      )}
    </Card>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Button 
          title="New Modification" 
          onPress={handleNewMod}
          icon={<Plus size={18} color="white" />}
        />
      </View>

      <FlatList
        data={vehicle.modifications}
        keyExtractor={(item) => item.id}
        renderItem={renderModification}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.vehicleSection}>
            <View style={styles.vehicleHeader}>
              {isEditingName ? (
                <View style={styles.nameEditContainer}>
                  <TextInput
                    style={styles.nameInput}
                    value={tempName}
                    onChangeText={setTempName}
                    placeholder="Vehicle name"
                    placeholderTextColor={colors.text.tertiary}
                    autoFocus
                    selectTextOnFocus
                  />
                  <View style={styles.nameEditButtons}>
                    <TouchableOpacity 
                      onPress={() => {
                        setTempName(vehicle.name);
                        setIsEditingName(false);
                      }}
                      style={styles.cancelButton}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleNameEdit} style={styles.saveButton}>
                      <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <TouchableOpacity onPress={handleNameEdit} style={styles.nameContainer}>
                  <Text style={styles.vehicleName}>{vehicle.name}</Text>
                  <Edit size={16} color={colors.text.secondary} style={styles.editIcon} />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
              {vehicle.photoUri ? (
                <Image source={{ uri: vehicle.photoUri }} style={styles.vehicleImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Car size={48} color={colors.text.tertiary} />
                  <Text style={styles.imagePlaceholderText}>Tap to add vehicle photo</Text>
                </View>
              )}
              <View style={styles.cameraOverlay}>
                <Camera size={16} color="white" />
              </View>
            </TouchableOpacity>

            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{vehicle.modifications.length}</Text>
                <Text style={styles.statLabel}>Modifications</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Modifications</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Modifications Yet</Text>
            <Text style={styles.emptyStateText}>
              Start documenting your vehicle modifications and upgrades.
            </Text>
            <Button 
              title="Add First Modification" 
              onPress={handleNewMod}
              style={styles.emptyStateButton}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  vehicleSection: {
    marginBottom: 24,
  },
  vehicleHeader: {
    marginBottom: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleName: {
    ...typography.title,
    fontSize: 24,
    textAlign: 'center',
  },
  editIcon: {
    marginLeft: 8,
  },
  nameEditContainer: {
    alignItems: 'center',
  },
  nameInput: {
    backgroundColor: colors.background.input,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    minWidth: 200,
  },
  nameEditButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.accent.primary,
    borderRadius: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  vehicleImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: colors.background.secondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: colors.text.tertiary,
    marginTop: 8,
    fontSize: 16,
  },
  cameraOverlay: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    justifyContent: 'center',
  },
  statCard: {
    backgroundColor: `${colors.accent.primary}10`,
    borderWidth: 1,
    borderColor: `${colors.accent.primary}30`,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minWidth: 120,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.accent.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  sectionTitle: {
    ...typography.heading,
    marginBottom: 16,
  },
  modCard: {
    marginBottom: 12,
  },
  modHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  modInfo: {
    flex: 1,
  },
  modName: {
    ...typography.subheading,
    fontSize: 16,
    marginBottom: 4,
  },
  modDate: {
    ...typography.small,
    color: colors.text.tertiary,
  },
  modDescription: {
    ...typography.body,
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: `${colors.error}15`,
    borderRadius: 8,
    marginLeft: 12,
  },
  emptyState: {
    backgroundColor: colors.background.secondary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 20,
  },
  emptyStateTitle: {
    ...typography.heading,
    marginBottom: 12,
  },
  emptyStateText: {
    ...typography.body,
    textAlign: 'center',
    marginBottom: 24,
    color: colors.text.secondary,
  },
  emptyStateButton: {
    minWidth: 200,
  },
});