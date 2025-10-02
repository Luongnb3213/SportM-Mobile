// detailCourt.tsx
import DetailInfoOwnerCourtCard from '@/components/OwnerComponent/DetailInfoOwnerCourtCard';
import HeaderUser from '@/components/ui/HeaderUser';
import { useAxios } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import DetailCourtSkeleton from '@/components/Skeleton/DetailCourtSkeleton';

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

const DetailCourt = () => {
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get('window');
  const { courtID } = useLocalSearchParams<{ courtID: string }>();

  const [court, setCourt] = useState<CourtDTO | null>(null);

  useEffect(() => {
    (async () => {
      if (!courtID) return;
      try {
        const { data } = await useAxios.get(`courts/${courtID}`);
        setCourt(data.data);
      } catch (error) {
        console.log('Fetch error', error);
      }
    })();
  }, [courtID]);

  const images = court?.courtImages?.length ? court.courtImages : [
    'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600',
  ];

  if (!court) return <DetailCourtSkeleton />;

  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          extraKeyboardSpace={0}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 50,
            flexGrow: 1,
          }}
        >
          <View className="px-4">
            <HeaderUser />
          </View>

          {/* header back */}
          <View className="px-4">
            <TouchableOpacity
              className="flex-row items-center gap-2 py-2"
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={20} />
              <Text className="text-base text-primary font-medium">Trở về trang trước</Text>
            </TouchableOpacity>
          </View>

          {/* HERO carousel */}
          <View>
            <View className="w-full" style={{ aspectRatio: 16 / 12 }}>
              <Carousel
                loop={false}
                width={width}
                height={(width * 12) / 16}
                data={images}
                scrollAnimationDuration={600}
                renderItem={({ item }) => (
                  <ImageBackground
                    source={{ uri: item }}
                    resizeMode="cover"
                    className="w-full h-full"
                  >
                    <View className="absolute inset-0 bg-black/25" />
                    {/* texts overlay — bind từ data */}
                    <View className="px-4 mt-2">
                      <Text className="text-lg text-gray-200">
                        {court?.address || '—'}
                      </Text>

                      <Text
                        style={{ color: '#FFF200' }}
                        className="mt-2 text-4xl font-medium leading-tight"
                        numberOfLines={2}
                      >
                        {court?.courtName?.toUpperCase?.() || '—'}
                      </Text>

                      <View className="mt-3 flex-row items-center">
                        <View className="flex-row items-center gap-1 rounded-full bg-black/60 px-3 py-1.5">
                          <Text className="text-white text-base font-semibold">
                            {typeof court?.avgRating === 'number'
                              ? court.avgRating.toFixed(1)
                              : '0.0'}
                          </Text>
                          <Ionicons name="star" size={14} color="#FFD54F" />
                        </View>
                      </View>
                    </View>
                  </ImageBackground>
                )}
              />
            </View>
          </View>

          <View className="shadow-2xl">
            <DetailInfoOwnerCourtCard courtID={courtID} court={court || undefined} />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardProvider>
  );
};

export default DetailCourt;
