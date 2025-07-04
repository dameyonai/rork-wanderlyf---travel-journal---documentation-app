import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '@/constants/colors';
import { Feather } from '@expo/vector-icons';
import { View, Text } from 'react-native';

const TabIcon = ({ focused, icon, name }: { focused: boolean; icon: React.ReactNode; name: string }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center', gap: 4, top: 5 }}>
    {icon}
    <Text style={{ color: focused ? colors.primary : colors.textMuted, fontSize: 10 }}>{name}</Text>
  </View>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 90,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={<Feather name="home" size={24} color={focused ? colors.primary : colors.textMuted} />} name="Home" />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={<Feather name="book-open" size={24} color={focused ? colors.primary : colors.textMuted} />} name="Journal" />,
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Photos',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={<Feather name="image" size={24} color={focused ? colors.primary : colors.textMuted} />} name="Photos" />,
        }}
      />
      <Tabs.Screen
        name="checklist"
        options={{
          title: 'Checklist',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={<Feather name="check-square" size={24} color={focused ? colors.primary : colors.textMuted} />} name="Checklist" />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={<Feather name="map" size={24} color={focused ? colors.primary : colors.textMuted} />} name="Map" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={<Feather name="settings" size={24} color={focused ? colors.primary : colors.textMuted} />} name="Settings" />,
        }}
      />
    </Tabs>
  );
}
