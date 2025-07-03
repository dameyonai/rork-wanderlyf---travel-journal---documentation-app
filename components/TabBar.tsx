import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Home, BookOpen, Map, Camera, Settings } from 'lucide-react-native';

export const TabBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  const tabs = [
    {
      name: 'Home',
      path: '/',
      icon: (active: boolean) => <Home size={20} color={active ? colors.accent.primary : colors.text.tertiary} />,
    },
    {
      name: 'Journal',
      path: '/journal',
      icon: (active: boolean) => <BookOpen size={20} color={active ? colors.accent.primary : colors.text.tertiary} />,
    },
    {
      name: 'Photos',
      path: '/photos',
      icon: (active: boolean) => <Camera size={20} color={active ? colors.accent.primary : colors.text.tertiary} />,
    },
    {
      name: 'Map',
      path: '/map',
      icon: (active: boolean) => <Map size={20} color={active ? colors.accent.primary : colors.text.tertiary} />,
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: (active: boolean) => <Settings size={20} color={active ? colors.accent.primary : colors.text.tertiary} />,
    },
  ];
  
  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };
  
  return (
    <View style={[
      styles.container,
      Platform.OS === 'ios' && styles.iosShadow
    ]}>
      {tabs.map((tab) => {
        const active = isActive(tab.path);
        
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => router.push(tab.path)}
          >
            {tab.icon(active)}
            <Text style={[
              styles.tabText,
              active && styles.activeTabText
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background.primary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    paddingTop: 12,
  },
  iosShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    ...typography.small,
    marginTop: 4,
    fontSize: 10,
  },
  activeTabText: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
});