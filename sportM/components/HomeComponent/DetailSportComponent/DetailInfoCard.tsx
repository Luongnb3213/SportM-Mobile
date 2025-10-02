// DetailInfoOwnerCourtCard.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/Card';
import { Button } from '@/components/Button';
import { router } from 'expo-router';
import RatingCourtCard from '@/components/OwnerComponent/RatingCourtCard';
import InfoSport from './InfoSport';

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

  return (
    <Card className="mx-3 my-3 overflow-hidden rounded-2xl ">
      {/* HEADER tabs */}
      <CardHeader className="p-0">
        <View className="bg-yellow-300 py-3 flex-row px-3 justify-center gap-8">
          {TABS.map((item) => {
            const focused = item.key === active;
            return (
              <TouchableOpacity
                onPress={() => setActive(item.key)}
                className="text-center"
                key={item.key}
              >
                <View className={`rounded-full ${focused ? 'text-white' : ''}`}>
                  <Text
                    className={`text-lg ${focused ? 'font-semibold text-primary' : 'font-medium'}`}
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
            <RatingCourtCard courtID={courtID} /> 
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
