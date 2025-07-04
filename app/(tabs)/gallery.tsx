import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { colors } from '../../constants/colors';
import { useGalleryStore } from '../../store/galleryStore';
import { Plus } from 'lucide-react-native';

const PolaroidCard = ({ photo }: { photo: any }) => (
  <Link href={`/gallery/edit/${photo.id}`} asChild>
    <TouchableOpacity style={styles.polaroid}>
      <Image source={{ uri: photo.imageUri }} style={styles.polaroidPhotoArea} />
      <Text style={styles.polaroidCaption}>{photo.caption}</Text>
    </TouchableOpacity>
  </Link>
);

export default function GalleryTabScreen() {
  const { galleryPhotos } = useGalleryStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gallery</Text>
        <Link href="/photos/new" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={24} color={colors.white} />
          </TouchableOpacity>
        </Link>
      </View>

      {galleryPhotos.length > 0 ? (
        <FlatList
          data={galleryPhotos}
          numColumns={3}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PolaroidCard photo={item} />}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No Photos</Text>
          <Text style={styles.emptyStateText}>
            Start capturing memories by adding your first photo.
          </Text>
          <Link href="/photos/new" asChild>
            <TouchableOpacity style={styles.createButton}>
              <Text style={styles.createButtonText}>Add First Photo</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  addButton: {
    backgroundColor: colors.primary,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  polaroid: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    padding: 8,
    width: '31%',
    aspectRatio: 166 / 242,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  polaroidPhotoArea: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    marginBottom: 8,
  },
  polaroidCaption: {
    color: '#555',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});