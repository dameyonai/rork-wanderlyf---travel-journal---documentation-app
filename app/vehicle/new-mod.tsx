import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  Alert,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVehicleStore } from '@/store/vehicleStore';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Button } from '@/components/Button';

export default function NewModScreen() {
  const router = useRouter();
  const { addModification } = useVehicleStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert("Missing Info", "Please enter a name for the modification.");
      return;
    }
    
    setIsSubmitting(true);
    
    addModification({ 
      name: name.trim(), 
      description: description.trim() 
    });
    
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
        <View style={styles.formGroup}>
          <Text style={styles.label}>Modification Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Rooftop Tent, Lift Kit, Bull Bar"
            placeholderTextColor={colors.text.tertiary}
            value={name}
            onChangeText={setName}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Add details about the modification, brand, model, or installation notes..."
            placeholderTextColor={colors.text.tertiary}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
          />
        </View>
        
        <Button 
          title="Add Modification" 
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
  submitButton: {
    marginTop: 16,
  },
});