import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Button } from '@/components/Button';
import { Check, MapPin } from 'lucide-react-native';

// ... keep existing imports ...

// Web fallback component
const WebMapFallback = ({ onLocationSelect }: { onLocationSelect: (location: any) => void }) => (
  <View style={styles.webFallback}>
    <MapPin size={48} color={colors.text.secondary} />
    <Text style={styles.webFallbackTitle}>Map not available on web</Text>
    <Text style={styles.webFallbackText}>
      Please enter location manually or use the mobile app for map selection.
    </Text>
    <Button 
      title="Use Current Location" 
      onPress={() => onLocationSelect({
        name: 'Current Location',
        latitude: -12.4634,
        longitude: 130.8456
      })}
      style={styles.fallbackButton}
    />
  </View>
);

// Default location (Darwin, NT) if permissions are denied
const DARWIN_COORDS = {
  latitude: -12.4634,
  longitude: 130.8456,
};

export default function MapPickerScreen() {
  const router = useRouter();
  const [markerLocation, setMarkerLocation] = useState(DARWIN_COORDS);
  const [locationName, setLocationName] = useState('');

  // ... keep existing location logic ...

  const handleConfirmLocation = async () => {
    try {
      if (Platform.OS !== 'web') {
        // Use expo-location for reverse geocoding on native
        const Location = require('expo-location');
        const reverseGeocoded = await Location.reverseGeocodeAsync(markerLocation);
        const firstResult = reverseGeocoded[0];
        const name = `${firstResult.name || ''}, ${firstResult.city || ''}, ${firstResult.region || ''}`;
        setLocationName(name.replace(/, ,/g, ',').replace(/^,|,$/g, ''));
      } else {
        setLocationName('Selected Location');
      }
      
      // Navigate back with location data
      router.back();
      // Pass location data via router params
      router.setParams({ 
        locationName: locationName || 'Selected Location',
        latitude: markerLocation.latitude.toString(), 
        longitude: markerLocation.longitude.toString() 
      });
    } catch (error) {
      console.error("Location selection failed", error);
      Alert.alert("Error", "Could not determine location name. Please try again.");
    }
  };

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <WebMapFallback onLocationSelect={handleConfirmLocation} />
      </SafeAreaView>
    );
  }

  // Native map implementation would go here
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.mapPlaceholder}>
        <MapPin size={48} color={colors.accent.primary} />
        <Text style={styles.mapPlaceholderTitle}>Map View</Text>
        <Text style={styles.mapPlaceholderText}>
          Interactive map would be displayed here on native platforms
        </Text>
      </View>
      
      <View style={styles.confirmButtonContainer}>
        <Button
          title="Confirm Location"
          onPress={handleConfirmLocation}
          icon={<Check size={20} color="white" />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    margin: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mapPlaceholderTitle: {
    ...typography.heading,
    marginTop: 16,
    marginBottom: 8,
  },
  mapPlaceholderText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  confirmButtonContainer: {
    padding: 20,
  },
  webFallback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  webFallbackTitle: {
    ...typography.heading,
    marginTop: 16,
    marginBottom: 8,
  },
  webFallbackText: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  fallbackButton: {
    minWidth: 200,
  },
});