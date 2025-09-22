import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Court, Day, Slot } from './types';
import { Card, CardContent } from '@/components/Card';
import { Badge } from '@/components/Badge';
import SegmentedTwoOptions from './SegmentedTwoOptions';
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
  { id: 'c1', name: 'Sân 1' },
  { id: 'c2', name: 'Sân 2' },
  { id: 'c3', name: 'Sân 3' },
  { id: 'c4', name: 'Sân 4' },
  { id: 'c5', name: 'Sân 5' },
  { id: 'c6', name: 'Sân 6' },
];

export default function BookingScheduleScreen() {
  const [activeDayId, setActiveDayId] = useState(
    DAYS.find((d) => d.isActive)?.id ?? DAYS[0].id
  );

const slots: Slot[] = useMemo(() => {
  const startHour = 5;   // bắt đầu từ 5h
  const rows = 14;       // bao nhiêu dòng giờ
  const fmt = (h: number) => `${String(h).padStart(2, "0")}:00`;

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
  const locked = new Set<string>(['c1_t0']);
  return (
    <View className="flex-1 bg-white">
      {/* Filters */}
      <Card className="m-3 rounded-2xl bg-white">
        <CardContent className="p-4">
          <Text className="text-[14px] font-bold text-gray-900">Bộ môn</Text>
          <View className="mt-2 flex-row gap-2">
            <Badge variant="secondary" label="Pickleball" />
          </View>
          <View className="h-3" />
          <Text className="text-[14px] font-bold text-gray-900">Loại sân</Text>
          <View className="mt-2">
            <SegmentedTwoOptions
              leftLabel="Ngoài trời"
              rightLabel="Trong nhà"
            />
          </View>
        </CardContent>
      </Card>
      {/* Date selector */}
      <Card className="mx-3 rounded-2xl">
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
      <Card className="m-3 rounded-2xl">
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
