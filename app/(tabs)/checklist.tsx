import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { colors } from '../../constants/colors';
import { useChecklistStore } from '../../store/checklistStore';
import { ChecklistItemCard } from '../../components/ChecklistItemCard';
import { Plus, CheckSquare, RotateCcw, Settings } from 'lucide-react-native';

export default function ChecklistTabScreen() {
  const {
    checklist,
    initializeFromMaster,
    toggleItem,
    addCustomItem,
    removeItem,
    resetChecklist,
    getProgress,
    getCategoryProgress
  } = useChecklistStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    initializeFromMaster();
  }, []);

  const progress = getProgress();

  const handleAddItem = () => {
    if (!newItemText.trim()) {
      Alert.alert('Error', 'Please enter item text');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    addCustomItem(selectedCategory, newItemText.trim());
    setNewItemText('');
    setShowAddModal(false);
  };

  const handleRemoveItem = (categoryKey: string, itemId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeItem(categoryKey, itemId) }
      ]
    );
  };

  const handleResetChecklist = () => {
    Alert.alert(
      'Reset Checklist',
      'This will reset all items to unchecked and remove custom items. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetChecklist }
      ]
    );
  };

  const sectionData = Object.entries(checklist).map(([categoryKey, items]) => {
    const categoryProgress = getCategoryProgress(categoryKey);
    return {
      title: categoryKey,
      data: items,
      progress: categoryProgress
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trip Checklist</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setShowAddModal(true)}
          >
            <Plus size={20} color={colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleResetChecklist}
          >
            <RotateCcw size={20} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {progress.total > 0 && (
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <CheckSquare size={24} color={colors.primary} />
            <Text style={styles.progressTitle}>Overall Progress</Text>
          </View>
          <Text style={styles.progressText}>
            {progress.completed} of {progress.total} items completed
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress.percentage}%` }]} />
          </View>
          <Text style={styles.progressPercentage}>{progress.percentage}%</Text>
        </View>
      )}

      <SectionList
        sections={sectionData}
        keyExtractor={(item) => item.id}
        renderItem={({ item, section }) => (
          <ChecklistItemCard
            item={item}
            onToggle={() => toggleItem(section.title, item.id)}
            onRemove={item.id.startsWith('custom-') ? () => handleRemoveItem(section.title, item.id) : undefined}
            showRemove={item.id.startsWith('custom-')}
          />
        )}
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionProgress}>
              <Text style={styles.sectionProgressText}>
                {section.progress.completed}/{section.progress.total}
              </Text>
              <View style={styles.miniProgressBar}>
                <View style={[styles.miniProgressFill, { width: `${section.progress.percentage}%` }]} />
              </View>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />

      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Custom Item</Text>
            
            <TextInput
              style={styles.modalInput}
              placeholder="Enter item description..."
              placeholderTextColor={colors.textMuted}
              value={newItemText}
              onChangeText={setNewItemText}
              multiline
            />
            
            <Text style={styles.modalLabel}>Select Category:</Text>
            <View style={styles.categoryGrid}>
              {Object.keys(checklist).map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.selectedCategoryButton
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.selectedCategoryButtonText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowAddModal(false);
                  setNewItemText('');
                  setSelectedCategory('');
                }}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalAddButton}
                onPress={handleAddItem}
              >
                <Text style={styles.modalAddText}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  sectionProgress: {
    alignItems: 'flex-end',
    gap: 4,
  },
  sectionProgressText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  miniProgressBar: {
    width: 60,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: colors.background,
    color: colors.text,
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  categoryButton: {
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedCategoryButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryButtonText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  selectedCategoryButtonText: {
    color: colors.white,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: colors.background,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalCancelText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  modalAddButton: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalAddText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});