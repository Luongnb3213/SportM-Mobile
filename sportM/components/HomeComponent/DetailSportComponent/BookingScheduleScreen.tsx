import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Court, Day, Slot } from './types';
import { Card, CardContent } from '@/components/Card';
import DayPill from './DayPill';
import TimeColumn from './TimeColumn';
import CourtsGrid from './CourtsGrid';

export const SLOT_HEIGHT = 38;

const DAYS: Day[] = Array.from({ length: 8 }, (_, i) => ({
  id: `2025-09-${10 + i}`,
  thu: 'TH 9',
  day: String(36),
  suffix: 'CN',
  isActive: i === 3,
}));

const courts: Court[] = [
  { id: 'am', name: 'AM' },
  { id: 'pm', name: 'PM' },
];

export default function BookingScheduleScreen() {
  const [activeDayId, setActiveDayId] = useState(
    DAYS.find((d) => d.isActive)?.id ?? DAYS[0].id
  );

  const slots: Slot[] = useMemo(() => {
    const startHour = 5; // bắt đầu từ 5h
    const rows = 7;
    const fmt = (h: number) => `${String(h).padStart(2, '0')}:00`;

    return Array.from({ length: rows }, (_, i) => {
      const s = startHour + i;
      const e = s + 1;
      return { id: `t${i}`, label: `${fmt(s)} - ${fmt(e)}` };
    });
  }, []);
  // quản lý các ô được chọn (key = `${courtId}_${slotId}`)
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggle = (courtId: string, slotId: string) => {
    const k = `${courtId}_${slotId}`;
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });
  };

  // ví dụ ô khóa (slot 0 của sân 1)
  const locked = new Set<string>(['am_t0']);
  return (
    <View className="flex-1 bg-white">
      {/* Filters */}
      <View className="flex-row items-center justify-between px-6 mt-4 mb-2">
        <Text className="text-lg font-semibold text-gray-900">
          Sân: <Text className='font-medium'>Pickleball</Text>
        </Text>
      </View>
      <View className='h-1 mx-6 bg-gray-200'></View>
      {/* Date selector */}
      <Card className="mx-3 rounded-2xl" style={{ borderWidth: 0 }}>
        <CardContent className="px-3 py-3">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-[14px] font-bold text-gray-900">Thứ 7</Text>
            <Text className="text-[14px] font-semibold text-gray-500">
              13/9/2025
            </Text>
          </View>

          <FlatList
            data={DAYS}
            keyExtractor={(d) => d.id}
            horizontal
            contentContainerStyle={{ paddingVertical: 6 }}
            ItemSeparatorComponent={() => <View className="w-3" />}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <DayPill
                thu={item.thu}
                day={item.day}
                suffix={item.suffix}
                active={item.id === activeDayId}
                onPress={() => setActiveDayId(item.id)}
              />
            )}
          />
        </CardContent>
      </Card>

      {/* Grid */}
      <Card className="m-3 rounded-2xl" style={{ borderWidth: 0 }}>
        <CardContent className="px-3 py-3">
          <ScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          >
            <View className="px-4 pr-0">
              <View className="flex-row">
                <TimeColumn slots={slots} />
                <CourtsGrid
                  courts={courts}
                  slots={slots}
                  selected={selected}
                  locked={locked}
                  onToggle={toggle}
                  iconPack={MaterialCommunityIcons}
                />
              </View>
            </View>
          </ScrollView>
        </CardContent>
      </Card>
    </View>
  );
}
