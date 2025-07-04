import { useEffect } from 'react';
import { Platform, View } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { colors } from '@/constants/colors';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: '/',
};

export default function RootLayout() {
  useEffect(() => {
    // Hide the splash screen after a delay
    const hideSplash = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      await SplashScreen.hideAsync();
    };
    
    hideSplash();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background.primary }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background.primary,
          },
          headerTintColor: colors.text.primary,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background.primary,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        <Stack.Screen 
          name="journal/[id]" 
          options={{ 
            title: 'Entry Details',
            headerBackTitle: 'Journal',
          }} 
        />
        <Stack.Screen 
          name="journal/new" 
          options={{ 
            title: 'New Entry',
            headerBackTitle: 'Journal',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="journal/edit/[id]" 
          options={{ 
            title: 'Edit Entry',
            headerBackTitle: 'Details',
            presentation: 'modal',
          }} 
        />

        <Stack.Screen 
          name="photos/[id]" 
          options={{ 
            title: 'Photo',
            headerBackTitle: 'Photos',
          }} 
        />
        <Stack.Screen 
          name="photos/new" 
          options={{ 
            title: 'Add Photo',
            headerBackTitle: 'Photos',
            presentation: 'modal',
          }} 
        />

        <Stack.Screen 
          name="gallery/edit/[id]" 
          options={{ 
            title: 'Edit Photo',
            headerBackTitle: 'Gallery',
            presentation: 'modal',
          }} 
        />


        <Stack.Screen 
          name="gear/[category]" 
          options={{ 
            title: 'Category',
            headerBackTitle: 'Gear',
          }} 
        />
        <Stack.Screen 
          name="gear/new" 
          options={{ 
            title: 'Add Gear Item',
            headerBackTitle: 'Gear',
            presentation: 'modal',
          }} 
        />

        <Stack.Screen 
          name="settings/profile" 
          options={{ 
            title: 'Edit Profile',
            headerBackTitle: 'Settings',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="trips/new" 
          options={{ 
            title: 'New Trip',
            headerBackTitle: 'Home',
            presentation: 'modal',
          }} 
        />
        <Stack.Screen 
          name="vehicle/index" 
          options={{ 
            title: 'My Vehicle',
            headerBackTitle: 'Settings',
          }} 
        />
        <Stack.Screen 
          name="vehicle/new-mod" 
          options={{ 
            title: 'Add Modification',
            headerBackTitle: 'Vehicle',
            presentation: 'modal',
          }} 
        />
      </Stack>
    </View>
  );
}