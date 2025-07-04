import React from 'react';
import { Tabs } from 'expo-router';
import { colors } from '@/constants/colors';
import { Home, BookOpen, Image, CheckSquare, Map, Settings } from 'lucide-react-native';
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
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={<Home size={24} color={focused ? colors.primary : colors.textMuted} />} name="Home" />,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={<BookOpen size={24} color={focused ? colors.primary : colors.textMuted} />} name="Journal" />,
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Photos',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={<Image size={24} color={focused ? colors.primary : colors.textMuted} />} name="Photos" />,
        }}
      />
      <Tabs.Screen
        name="checklist"
        options={{
          title: 'Checklist',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={<CheckSquare size={24} color={focused ? colors.primary : colors.textMuted} />} name="Checklist" />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={<Map size={24} color={focused ? colors.primary : colors.textMuted} />} name="Map" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={<Settings size={24} color={focused ? colors.primary : colors.textMuted} />} name="Settings" />,
        }}
      />
    </Tabs>
  );
}
