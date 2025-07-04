import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Image } from 'react-native';
import { colors } from '../../constants/colors';
import { Link } from 'expo-router';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTripStore } from '../../store/tripStore';
import { differenceInCalendarDays } from 'date-fns';

const SettingsItem = ({ title, subtitle, onPress, rightElement }: { title: string, subtitle?: string, onPress?: () => void, rightElement?: React.ReactNode }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={onPress}>
        <View style={{ flex: 1 }}>
            <Text style={styles.itemTitle}>{title}</Text>
            {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
        </View>
        {rightElement}
    </TouchableOpacity>
);

export default function SettingsTabScreen() {
  const [notificationsOn, setNotificationsOn] = React.useState(true);
  const [darkModeOn, setDarkModeOn] = React.useState(true);

  const trips = useTripStore((state) => state.trips);

  const tripCount = trips.length;
  const totalDays = trips.reduce((sum, trip) => {
      const duration = differenceInCalendarDays(new Date(trip.endDate), new Date(trip.startDate)) + 1;
      return sum + duration;
  }, 0);

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Settings</Text>
        </View>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }}>
            {/* Card for the logged-in user */}
            <View style={styles.profileCard}>
                <Image 
                    source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' }} 
                    style={styles.profileImage} 
                />
                <View style={{ flex: 1 }}>
                    <Text style={styles.profileName}>SHDWBLK TRVLR</Text>
                    <Text style={styles.profileStats}>{tripCount} {tripCount === 1 ? 'trip' : 'trips'} • {totalDays} days</Text>
                </View>
                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
            </View>

            {/* Card for creating a new trip */}
            <Link href="/trips/new" asChild>
                <TouchableOpacity style={styles.actionCard}>
                    <View style={styles.actionIconContainer}>
                        <Feather name="plus" size={24} color={colors.textMuted} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.profileName}>Create New Trip</Text>
                        <Text style={styles.profileStats}>Start documenting a new adventure</Text>
                    </View>
                    <Feather name="chevron-right" size={24} color={colors.textMuted} />
                </TouchableOpacity>
            </Link>

            {/* Vehicle card */}
            <Link href="/vehicle/index" asChild>
                <TouchableOpacity style={styles.actionCard}>
                    <View style={styles.actionIconContainer}>
                        <MaterialCommunityIcons name="car-hatchback" size={24} color={colors.textMuted} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.profileName}>My Vehicle</Text>
                        <Text style={styles.profileStats}>Manage photos and modifications</Text>
                    </View>
                    <Feather name="chevron-right" size={24} color={colors.textMuted} />
                </TouchableOpacity>
            </Link>

            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.itemGroup}>
                <SettingsItem 
                    title="Notifications" 
                    subtitle="Receive trip reminders and updates" 
                    rightElement={<Switch value={notificationsOn} onValueChange={setNotificationsOn} trackColor={{ false: colors.surface, true: colors.primary }} />}
                />
                <SettingsItem 
                    title="Dark Mode" 
                    subtitle="Always use dark theme" 
                    rightElement={<Switch value={darkModeOn} onValueChange={setDarkModeOn} trackColor={{ false: colors.surface, true: colors.primary }} />}
                />
            </View>

            <Text style={styles.sectionTitle}>Data & Privacy</Text>
            <View style={styles.itemGroup}>
                <SettingsItem title="Export Data" subtitle="Download all your trip data" rightElement={<Feather name="chevron-right" size={20} color={colors.textMuted} />} />
                <SettingsItem title="Privacy Policy" subtitle="How we handle your data" rightElement={<Feather name="chevron-right" size={20} color={colors.textMuted} />} />
            </View>
            
            <Text style={styles.sectionTitle}>Support</Text>
            <View style={styles.itemGroup}>
                <SettingsItem title="Help & Support" subtitle="Get assistance with the app" rightElement={<Feather name="chevron-right" size={20} color={colors.textMuted} />} />
            </View>

        </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: { paddingTop: 60, paddingBottom: 20, alignItems: 'center' },
    headerTitle: { fontSize: 28, fontWeight: '800', color: colors.text },
    profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 20, borderRadius: 12, marginBottom: 15, gap: 15 },
    profileImage: { width: 50, height: 50, borderRadius: 25 },
    profileName: { color: colors.text, fontSize: 18, fontWeight: 'bold' },
    profileStats: { color: colors.textSecondary, fontSize: 14, marginTop: 4 },
    editButton: { backgroundColor: colors.border, paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
    editButtonText: { color: colors.text, fontWeight: '600' },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.textMuted, marginBottom: 10, paddingHorizontal: 10, marginTop: 20 },
    itemGroup: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        marginBottom: 20,
        overflow: 'hidden',
    },
    itemContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    itemTitle: { color: colors.text, fontSize: 16 },
    itemSubtitle: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        gap: 15,
    },
    actionIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.border,
        justifyContent: 'center',
        alignItems: 'center',
    },
});