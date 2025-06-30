import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const typography = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text.primary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text.secondary,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text.primary,
  },
  subheading: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text.primary,
    lineHeight: 22,
  },
  caption: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text.secondary,
  },
  small: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text.tertiary,
  },
});