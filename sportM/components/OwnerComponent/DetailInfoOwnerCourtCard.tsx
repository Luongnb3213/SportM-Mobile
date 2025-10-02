// app/(tabs)/home/DetailSport/detail.tsx  (đặt chỗ bạn muốn)
import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card, CardHeader, CardContent, CardFooter } from '@/components/Card'; // :contentReference[oaicite:2]{index=2}
import { Button } from '@/components/Button'; // :contentReference[oaicite:3]{index=3}
import InfoSport from './InfoOwnerSport';
import { router } from 'expo-router';
import RatingCourtCard from './RatingCourtCard';

type TabItem = { key: string; label: string };

const TABS: TabItem[] = [
  { key: 'info', label: 'Thông tin' },
  { key: 'review', label: 'Đánh giá' },
];

export default function DetailInfoOwnerCourtCard({ courtID }: { courtID: string }) {
  const [active, setActive] = useState('info');

  return (
    <Card className="mx-3 my-3 overflow-hidden rounded-2xl ">
      {/* HEADER: tab scroll ngang bằng FlatList */}
      <CardHeader className="p-0">
        <View className="bg-yellow-300 py-3 flex-row px-3 justify-center gap-8">
          {TABS.map((item, index) => {
            const focused = item.key === active;
            return (
              <TouchableOpacity
                onPress={() => setActive(item.key)}
                className="text-center"
                key={index}
              >
                <View className={`rounded-full ${focused ? 'text-white' : ''}`}>
                  <Text
                    className={`text-lg ${
                      focused ? 'font-semibold text-primary' : 'font-medium'
                    }`}
                  >
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </CardHeader>

      {/* BODY: nội dung cuộn dọc */}
      <CardContent className="px-3 py-4 bg-white">
        {active === 'review' && <RatingCourtCard courtID={courtID} />}
        {['info', 'price', 'policy'].includes(active) && (
          <ScrollView
            style={{ maxHeight: 400 }}
            contentContainerStyle={{ paddingBottom: 16 }}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            {active === 'info' && <InfoSport />}
          </ScrollView>
        )}
      </CardContent>

      {/* FOOTER: nút đặt lịch */}
      <CardFooter className="px-3 pb-4 bg-white">
        {['info', 'price'].includes(active) && (
          <View className="flex-col items-center gap-4 w-full">
            <Button
              onPress={() => {
                router.push({
                   pathname: '/home/DetailSport/bookingSchedule',
                   params: { courtID },
                });
              }}
              className="h-12 flex-1 w-full rounded-xl"
            >
              <Text className="text-base text-white font-semibold">
                Chỉnh sửa
              </Text>
            </Button>
          </View>
        )}
      </CardFooter>
    </Card>
  );
}
