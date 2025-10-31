// DetailInfoOwnerCourtCard.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/Card';
import { Button } from '@/components/Button';
import { router } from 'expo-router';
import InfoSport from './InfoSport';
import RatingCard from './RatingCard';
import { useAuth } from '@/providers/AuthProvider';

type TabItem = { key: string; label: string };

const TABS: TabItem[] = [
  { key: 'info', label: 'Thông tin' },
  { key: 'review', label: 'Đánh giá' },
];

type CourtDTO = {
  courtId: string;
  courtName: string;
  courtImages: string[];
  address: string;
  description: string;
  subService: string;
  isActive: boolean;
  pricePerHour: number;
  sportType?: { typeName?: string };
  avgRating: number;
  lat?: number;
  lng?: number;
  owner?: {
    fullName?: string;
    phoneNumber?: string;
    avatarUrl?: string;
  };
};

export default function DetailInfoCard({
  courtID,
  court,
}: {
  courtID: string;
  court?: CourtDTO;
}) {
  const [active, setActive] = useState('info');
  const { user } = useAuth();
  return (
    <Card className="mx-3 my-3 overflow-hidden rounded-2xl bg-white ">
      {/* HEADER tabs */}
      <CardHeader className="p-0">
        <View className={`flex-row justify-center mt-3 mx-4 rounded-lg overflow-hidden`}>
          {TABS.map((item) => {
            const focused = item.key === active;
            return (
              <TouchableOpacity
                onPress={() => setActive(item.key)}
                className={`text-center py-3  ${focused ? 'bg-[#fce82f]' : 'bg-[#fef18b]'} flex-1 `}
                key={item.key}
              >
                <View className={`rounded-full ${focused ? 'text-white' : ''}`}>
                  <Text
                    className={`text-lg text-center font-semibold ${focused ? '' : ''}`}
                  >
                    {item.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </CardHeader>

      {/* BODY */}
      <CardContent className="px-3 py-4 bg-white">
        {active === 'review' && (
          <View>
            <RatingCard courtID={courtID} title={court?.courtName} currentUserId={user?.userId} />
          </View>
        )}

        {['info', 'price', 'policy'].includes(active) && (
          <ScrollView
            style={{ maxHeight: 400 }}
            contentContainerStyle={{ paddingBottom: 16 }}
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
          >
            {active === 'info' && <InfoSport court={court} />}
          </ScrollView>
        )}
      </CardContent>

      {/* FOOTER */}
      <CardFooter className="px-3 pb-4 bg-white">
        {['info', 'price'].includes(active) && (
          <View className="flex-col items-center gap-4 w-full">
            <Button
              onPress={() => {
                if (!user) {
                  router.replace('/authentication')
                  return
                }
                router.push({
                  pathname: '/(tabs)/home/DetailSport/bookingSchedule',
                  params: { courtID },
                });
              }}
              className="h-12 flex-1 w-full rounded-xl"
            >
              <Text className="text-base text-white font-semibold">Đặt lịch</Text>
            </Button>
          </View>
        )}
      </CardFooter>
    </Card>
  );
}
