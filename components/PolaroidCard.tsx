import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Photo } from '@/types/trip';

interface PolaroidCardProps {
  photo: Photo;
}

export const PolaroidCard: React.FC<PolaroidCardProps> = ({ photo }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/photos/${photo.id}`);
  };

  return (
    <TouchableOpacity style={styles.polaroid} onPress={handlePress}>
      <View style={styles.photoArea}>
        {photo.imageUri ? (
          <Image source={{ uri: photo.imageUri }} style={styles.photo} />
        ) : (
          <View style={styles.placeholderPhoto} />
        )}
      </View>
      <View style={styles.captionArea}>
        <Text style={styles.caption} numberOfLines={2}>
          {photo.caption || photo.location.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  polaroid: {
    backgroundColor: '#FFFFFF',
    width: '31%', // 3 columns with gaps
    aspectRatio: 166 / 242, // Real polaroid proportions
    borderRadius: 4,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 12,
  },
  photoArea: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderPhoto: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1A1A1A',
  },
  captionArea: {
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  caption: {
    color: '#555555',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 12,
  },
});