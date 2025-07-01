import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { LinearGradient } from 'expo-linear-gradient';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = "SHDWBLK OUTBACK", 
  subtitle = "Project Wayfarer" 
}) => {
  return (
    <LinearGradient
      colors={[colors.background.secondary, colors.background.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    ...typography.title,
    fontSize: 32,
    marginBottom: 8,
    // Create gradient text effect
    color: colors.accent.primary,
  },
  subtitle: {
    ...typography.subtitle,
    opacity: 0.9,
  },
});