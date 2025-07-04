import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const TabIcon = ({ focused, icon, name }: { focused: boolean; icon: React.ReactNode; name: string }) => (
  <View style={styles.tabIconContainer}>
    {icon}
    <Text style={[styles.tabLabel, { color: focused ? colors.primary : colors.textMuted }]}>{name}</Text>
  </View>
);

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: styles.tabBar,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={<Feather name="home" size={24} color={focused ? colors.primary : colors.textMuted} />}
                name="Home"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="journal"
          options={{
            title: 'Journal',
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={<Feather name="book-open" size={24} color={focused ? colors.primary : colors.textMuted} />}
                name="Journal"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="gallery"
          options={{
            title: 'Photos',
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={<Feather name="image" size={24} color={focused ? colors.primary : colors.textMuted} />}
                name="Photos"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="checklist"
          options={{
            title: 'Checklist',
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={<Feather name="check-square" size={24} color={focused ? colors.primary : colors.textMuted} />}
                name="Checklist"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="map"
          options={{
            title: 'Map',
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={<Feather name="map" size={24} color={focused ? colors.primary : colors.textMuted} />}
                name="Map"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={<Feather name="settings" size={24} color={focused ? colors.primary : colors.textMuted} />}
                name="Settings"
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingTop: Platform.OS === 'ios' ? 10 : 5,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: Platform.OS === 'ios' ? 85 : 70,
    paddingBottom: Platform.OS === 'ios' ? 20 : 5,
  },
});