'use client';

import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
  StyleSheet,
} from 'react-native';
import Button from '@/components/Button';
import { Card } from '@/components/Card';
import { useAppTheme } from '@/styles/theme';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import TrustStatsSection from '../../../components/HomeComponent/TrustStatsSection';
import EmailSubscribeSection from '../../../components/HomeComponent/EmailSubscribeSection';
import {
  KeyboardAwareScrollView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import GolfDealCard from '../../../components/HomeComponent/GolfDealCard';
import GolfCourseCard from '@/components/HomeComponent/GolfCourseCard';
import HeaderUser from '@/components/ui/HeaderUser';
import { router } from 'expo-router';
import { NearByYardSkeleton } from '@/components/Skeleton/NearByYardSkeleton';
import { GolfCourseCardSkeleton } from '@/components/Skeleton/GolfCourseCardSkeleton';
import { socket } from '@/lib/socket';
import NotificationTester from '@/components/NotificationComponent/NotificationTester';
import { useAxios } from '@/lib/api';
import EmptyState from '@/components/ui/EmptyState';
import { formatPriceVND } from '@/lib/utils';
import AdsHomeSection from '@/components/HomeComponent/AdsHomeSection';

export default function HomeScreen() {
  const t = useAppTheme();
  const insets = useSafeAreaInsets();
  const [bookingCourt, setBookingCourt] = useState<any[]>();

  useEffect(() => {
    (async () => {
      // fetch data from API
      try {
        const { data } = await useAxios.get('/courts/my-booked-courts?page=1&limit=12')
        setBookingCourt(data.data.items);
      } catch (error) {
        console.log('Error fetching booked courts:', error);
      }
    })()
  }, [])

  useEffect(() => {
    (async () => {
      await socket.connect();

      const onConnect = () => console.log('✅ connected', socket.socket?.id);
      const onDisconnect = (r: any) => console.log('🔌 disconnected', r);

      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
    })();
  }, [])



  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 150 }}
          extraKeyboardSpace={0}
        >
          <View style={{ backgroundColor: t.background }}>
            <View className="bg-background px-4">
              <HeaderUser />
            </View>

            {/* Row 1: search input */}
            <TouchableOpacity onPress={() => {
              router.push('/(tabs)/home/search');
            }} className="flex-row px-4 items-center bg-[#EEEEEE] rounded-xl h-14 mx-4 mt-4">
              <Feather name="search" size={25} color="#0a0a0a" />
              <View
                className="flex-1 text-lg text-black px-2"
              >
                <Text className="text-black text-lg">Nhập địa điểm</Text>
              </View>
            </TouchableOpacity>


            <View className="gap-5 px-2 mt-4 flex-col">
              <View className="flex-row items-center justify-between px-4 bg-white">
                <Text className="text-3xl font-bold leading-snug text-primary">Sự kiện nổi bật</Text>
                <TouchableOpacity onPress={() => {
                  router.push('/(tabs)/home/ads-page');
                }} className="flex-row items-center">
                  <Text className="text-base mr-1">Xem tất cả</Text>
                  <Ionicons name="chevron-forward" size={18} color="black" />
                </TouchableOpacity>
              </View>

              <AdsHomeSection />

              <View className="items-center py-3">
                <Button onPress={() => {
                  router.push('/(tabs)/home/ads-page');
                }} variant="ghost" className="px-3 py-2">
                  <Text className="mr-1">Xem thêm</Text>
                  <Ionicons name="chevron-down" size={16} />
                </Button>
              </View>
            </View>


            <View className="gap-5 px-4 mt-4 flex-col">
              <View className="flex-row items-center justify-between px-4 bg-white">
                <Text className="text-3xl font-bold leading-snug text-primary">Sân đã đặt</Text>
                <TouchableOpacity onPress={() => {
                  router.push('/(tabs)/home/booking');
                }} className="flex-row items-center">
                  <Text className="text-base mr-1">Xem tất cả</Text>
                  <Ionicons name="chevron-forward" size={18} color="black" />
                </TouchableOpacity>
              </View>

              {Array.isArray(bookingCourt) ? (
                bookingCourt?.length === 0 ? (
                  <EmptyState
                    icon="people-outline"
                    title="Không có sân nào được đặt"
                    description="Hiện chưa có sân nào được đặt."
                  />
                ) : (
                  bookingCourt?.map((court: any) => (
                    <GolfCourseCard
                      key={court?.courtId}
                      title={court?.courtName}
                      pricePerHour={formatPriceVND(court?.pricePerHour)}
                      rating={court?.avgRating || 0}
                      imageUri={court?.courtImages[0] || 'https://sportm.vn/static/meda/san1.2f6f5f5f.jpg'}
                      onPress={() =>
                        router.push({
                          pathname: '/(tabs)/home/DetailSport',
                          params: { courtID: court?.courtId },
                        })
                      }
                    />
                  ))
                  )
              ) : (
                  Array.from({ length: 3 }).map((_, idx) => <GolfCourseCardSkeleton key={idx} />)
              )}
              <View className="items-center py-3">
                <Button onPress={() => {
                  router.push('/(tabs)/home/booking');
                }} variant="ghost" className="px-3 py-2">
                  <Text className="mr-1">Xem thêm</Text>
                  <Ionicons name="chevron-down" size={16} />
                </Button>
              </View>
            </View>

            {/* Golf deal card */}
            <View className="mt-4">
              <GolfDealCard title="Sân quanh đây" />
            </View>

            {/* trust stats section */}
            <View className="mt-4">
              <TrustStatsSection
                heading1="Sẻ chia sự"
                heading2="tin tưởng khi sử dụng"
                paragraph={`Mỗi một đồng bạn đặt xuống là một đồng tôi nhận được. Fact thôi nhưng tôi sẽ cân bạn sâu vcl.
Everybody knows that but who gives a fuck`}
                ctaLabel="Đăng ký chủ sân"
                onPressCTA={() => console.log('Đăng ký hội viên')}
                stat1Value="360+"
                stat1Desc="Hơn 360 sân được liệt kê trong hệ thống"
                stat2Value="22k+"
                stat2Desc="Người chủ sân đã tin tưởng chúng tôi"
                hashtags="#sportmlove #ilovenemchua"
              />
            </View>

            <View className="mt-3">
              <EmailSubscribeSection
                defaultEmail="iamgay@gmail.com"
                privacyUrl="https://sportm.vn/privacy"
                onSubmit={async (email) => {
                  // TODO: call API ở đây
                  console.log('subscribe:', email);
                }}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardProvider>
  );
}
