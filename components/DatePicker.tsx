import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';
import { Calendar } from 'lucide-react-native';

interface DatePickerProps {
  value: string;
  onDateChange: (date: string) => void;
  placeholder?: string;
  label?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onDateChange,
  placeholder = 'Select date',
  label,
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return placeholder;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDateSelect = (selectedDate: string) => {
    onDateChange(selectedDate);
    setShowPicker(false);
  };

  // Generate date options for the next 2 years
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    const endDate = new Date();
    endDate.setFullYear(today.getFullYear() + 2);

    for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  };

  const dateOptions = generateDateOptions();

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowPicker(!showPicker)}
      >
        <Calendar size={18} color={colors.text.secondary} style={styles.icon} />
        <Text style={[
          styles.dateText,
          !value && styles.placeholderText
        ]}>
          {formatDisplayDate(value)}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <View style={styles.pickerContainer}>
          <View style={styles.pickerHeader}>
            <Text style={styles.pickerTitle}>Select Date</Text>
            <TouchableOpacity onPress={() => setShowPicker(false)}>
              <Text style={styles.closeButton}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.dateGrid}>
            {dateOptions.slice(0, 30).map((date, index) => {
              const dateString = date.toISOString().split('T')[0];
              const isSelected = value === dateString;
              const isToday = dateString === new Date().toISOString().split('T')[0];
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateOption,
                    isSelected && styles.selectedDateOption,
                    isToday && styles.todayDateOption,
                  ]}
                  onPress={() => handleDateSelect(dateString)}
                >
                  <Text style={[
                    styles.dateOptionText,
                    isSelected && styles.selectedDateOptionText,
                    isToday && styles.todayDateOptionText,
                  ]}>
                    {date.getDate()}
                  </Text>
                  <Text style={[
                    styles.dateOptionMonth,
                    isSelected && styles.selectedDateOptionText,
                  ]}>
                    {date.toLocaleDateString('en-US', { month: 'short' })}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...typography.caption,
    marginBottom: 8,
  },
  dateButton: {
    backgroundColor: colors.background.input,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  dateText: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 16,
  },
  placeholderText: {
    color: colors.text.tertiary,
  },
  pickerContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.background.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
    zIndex: 1000,
    maxHeight: 300,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerTitle: {
    ...typography.subheading,
    fontSize: 16,
  },
  closeButton: {
    color: colors.accent.primary,
    fontWeight: '600',
  },
  dateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 8,
  },
  dateOption: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedDateOption: {
    backgroundColor: colors.accent.primary,
    borderColor: colors.accent.primary,
  },
  todayDateOption: {
    borderColor: colors.accent.secondary,
    borderWidth: 2,
  },
  dateOptionText: {
    ...typography.subheading,
    fontSize: 16,
    color: colors.text.primary,
  },
  dateOptionMonth: {
    ...typography.small,
    fontSize: 10,
    color: colors.text.secondary,
  },
  selectedDateOptionText: {
    color: 'white',
  },
  todayDateOptionText: {
    color: colors.accent.primary,
    fontWeight: '700',
  },
});