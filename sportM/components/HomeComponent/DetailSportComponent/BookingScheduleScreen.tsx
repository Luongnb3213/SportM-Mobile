// BookingScheduleScreen.tsx
import React, { useMemo } from 'react';
import { View, Text, FlatList, ScrollView, ActivityIndicator } from 'react-native'; // Import ActivityIndicator
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card, CardContent } from '@/components/Card';
import TimeColumn from './TimeColumn';
import CourtsGrid from './CourtsGrid';
import DayPill from './DayPill';

type DayItem = {
  id: string;        // YYYY-MM-DD
  date: Date;
  day: string;       // "05"
  month: number;     // 1..12
  weekdayShort: string; // "T2".."T7" | "CN"

};

// Slot now has an ID like '0100-0200'
type Slot = { id: string; label: string }; 

const courts = [
  { id: 'am', name: 'AM' },
  { id: 'pm', name: 'PM' },
];

function formatVNDate(d: Date) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export default function BookingScheduleScreen({
  days,
  activeDayId,
  setActiveDayId,
  timeSlots, // Now receives a single set of generic time slots
  selected,
  onToggle,
  pricePerHour,
  sportType,
  lockedSlots,
  loadingLockedSlots // Receive loading state
}: {
  days: DayItem[];
  activeDayId: string;
  setActiveDayId: (id: string) => void;
    timeSlots: Slot[]; // Generic time slots for display
    // selected chứa key dạng "am_slot-0700-0800" | "pm_slot-0700-0800"...
  selected: Set<string>;
  // toggle theo cột
    onToggle: (courtId: 'am' | 'pm', timeSlotId: string) => void; // timeSlotId is like '0700-0800'
  pricePerHour: number;
  sportType?: { typeName?: string };
    lockedSlots: Set<string>;
    loadingLockedSlots: boolean; // Added
}) {
  const activeDay = useMemo(() => days.find(d => d.id === activeDayId) || days[0], [days, activeDayId]);

  return (
    <View className="flex-1 bg-white">
      {/* Header: Thứ (trái) & Ngày (phải) */}
      <View className="flex-row items-center justify-between px-6 mt-4 mb-2">
        <Text className="text-[14px] font-bold text-gray-900">{activeDay.weekdayShort}</Text>
        <Text className="text-[14px] font-semibold text-gray-500">{formatVNDate(activeDay.date)}</Text>
      </View>
      <View className="h-1 mx-6 bg-gray-200" />

      {/* Giá/giờ */}
      <View className="flex-row items-center justify-between px-6 mt-3 mb-2">
        <Text className="text-lg font-semibold text-gray-900">
          Sân: <Text className="font-medium">{sportType?.typeName}</Text>
        </Text>
        <Text className="text-sm text-gray-600">
          {pricePerHour.toLocaleString('vi-VN')} / giờ
        </Text>
      </View>

      {/* Date selector – pill style cũ */}
      <Card className="mx-3 rounded-2xl" style={{ borderWidth: 0 }}>
        <CardContent className="px-3 py-3">
          <FlatList
            data={days}
            keyExtractor={(d) => d.id}
            horizontal
            contentContainerStyle={{ paddingVertical: 6 }}
            ItemSeparatorComponent={() => <View className="w-3" />}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <DayPill
                monthText={`TH ${item.month}`}
                dayText={item.day}
                weekdayText={item.weekdayShort}
                active={item.id === activeDayId}
                onPress={() => setActiveDayId(item.id)}
              />
            )}
          />
        </CardContent>
      </Card>

      {/* Grid – chọn theo cột AM/PM */}
      <Card className="m-3 rounded-2xl" style={{ borderWidth: 0 }}>
        <CardContent className="px-3 py-3">
          <View className="px-4 pr-0">
            {loadingLockedSlots ? (
              <View className="items-center justify-center py-10">
                <ActivityIndicator size="large" color="#0000ff" />
                <Text className="mt-2 text-gray-500">Đang tải lịch trống...</Text>
              </View>
            ) : (
                <View className="flex-row">
                  {/* TimeColumn now only needs the generic time slots */}
                  <TimeColumn timeSlots={timeSlots} />
                  <CourtsGrid
                    courts={courts}
                    timeSlots={timeSlots} // Pass generic time slots to CourtsGrid
                    selected={selected}
                    locked={lockedSlots}
                    onToggle={(courtId, timeSlotId) => onToggle(courtId as 'am' | 'pm', timeSlotId)}
                    iconPack={MaterialCommunityIcons}
                  />
                </View>
            )}
          </View>
        </CardContent>
      </Card>
    </View>
  );
}