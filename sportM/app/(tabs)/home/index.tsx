import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import Button from '@/components/Button';
import HeaderUser from '@/components/ui/HeaderUser';
import TrustStatsSection from '@/components/HomeComponent/TrustStatsSection';
import EmailSubscribeSection from '@/components/HomeComponent/EmailSubscribeSection';
import GolfDealCard from '@/components/HomeComponent/GolfDealCard';
import GolfCourseCard from '@/components/HomeComponent/GolfCourseCard';
import { GolfCourseCardSkeleton } from '@/components/Skeleton/GolfCourseCardSkeleton';
import EmptyState from '@/components/ui/EmptyState';

import { useAxios } from '@/lib/api';
import { formatPriceVND } from '@/lib/utils';
import AdsHomeSection from '@/components/HomeComponent/AdsHomeSection';
import { useAuth } from '@/providers/AuthProvider';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = typeof useBottomTabBarHeight === 'function' ? useBottomTabBarHeight() : 0;

  const [bookingCourt, setBookingCourt] = useState<any[]>();
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await useAxios.get('/courts/my-booked-courts?page=1&limit=12');
        setBookingCourt(data.data.items);
      } catch (error) {
        console.log('Error fetching booked courts:', error);
      }
    })();
  }, []);


  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={insets.top}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          contentInsetAdjustmentBehavior="always"
          contentContainerStyle={{
            paddingBottom: (insets?.bottom ?? 0) + (tabBarHeight ?? 0) + 24, 
          }}
        >
          <View style={{ backgroundColor: 'white' }}>
            {/* Header */}
            <View className="bg-white px-4">
              <HeaderUser />
            </View>

            {/* Ads / Sự kiện */}
            <View className="gap-5 px-2 mt-4 flex-col">
              <View className="flex-row items-center justify-between px-4 bg-white">
                <Text className="text-3xl font-bold leading-snug text-primary">Sự kiện nổi bật</Text>
                <TouchableOpacity
                  onPress={() => router.push('/(tabs)/home/ads-page')}
                  className="flex-row items-center"
                >
                  <Text className="text-base mr-1">Xem tất cả</Text>
                  <Ionicons name="chevron-forward" size={18} color="black" />
                </TouchableOpacity>
              </View>

              <AdsHomeSection />
            </View>

            {/* Sân đã đặt */}
            {user && (
              <View className="gap-5 px-4 mt-4 flex-col">
                <View className="flex-row items-center justify-between px-4 bg-white">
                  <Text className="text-3xl font-bold leading-snug text-primary">Sân đã đặt</Text>
                  <TouchableOpacity
                    onPress={() => router.push('/(tabs)/home/booking')}
                    className="flex-row items-center"
                  >
                    <Text className="text-base mr-1">Xem tất cả</Text>
                    <Ionicons name="chevron-forward" size={18} color="black" />
                  </TouchableOpacity>
                </View>

                {Array.isArray(bookingCourt) ? (
                  bookingCourt.length === 0 ? (
                    <EmptyState
                      icon="people-outline"
                      title="Không có sân nào được đặt"
                      description="Hiện chưa có sân nào được đặt."
                    />
                  ) : (
                    <>
                        {bookingCourt.map((court: any) => (
                          <GolfCourseCard
                            key={court?.courtId}
                            title={court?.courtName}
                            pricePerHour={formatPriceVND(court?.pricePerHour)}
                            rating={court?.avgRating || 0}
                          imageUri={
                            court?.courtImages?.[0] ||
                            'https://sportm.vn/static/meda/san1.2f6f5f5f.jpg'
                          }
                          onPress={() =>
                            router.push({
                              pathname: '/(tabs)/home/DetailSport',
                              params: { courtID: court?.courtId },
                            })
                          }
                        />
                      ))}
                      <View className="items-center py-3">
                          <Button
                            onPress={() => router.push('/(tabs)/home/booking')}
                            variant="ghost"
                            className="px-3 py-2"
                          >
                          <Text className="mr-1">Xem thêm</Text>
                          <Ionicons name="chevron-down" size={16} />
                        </Button>
                      </View>
                      </>
                    )
                ) : (
                  Array.from({ length: 3 }).map((_, idx) => <GolfCourseCardSkeleton key={idx} />)
                )}
              </View>
            )}

            {/* Sân quanh đây */}
            <View className="mt-4">
              <GolfDealCard title="Sân quanh đây" />
            </View>

            {/* Trust stats */}
            <View className="mt-4">
              <TrustStatsSection
                heading1="Sẻ chia sự"
                heading2="tin tưởng khi sử dụng"
                paragraph={`Mỗi một đồng bạn đặt xuống là một đồng tôi nhận được. Fact thôi nhưng tôi sẽ cân bạn sâu vcl.
Everybody knows that but who gives a fuck`}
                ctaLabel="Đăng ký chủ sân"
                onPressCTA={() =>
                  Linking.openURL('https://www.sportm.site/bang-gia').catch((err) =>
                    console.error('Error opening maps', err)
                  )
                }
                stat1Value="360+"
                stat1Desc="Hơn 360 sân được liệt kê trong hệ thống"
                stat2Value="22k+"
                stat2Desc="Người chủ sân đã tin tưởng chúng tôi"
              />
            </View>

            {/* Subscribe */}
            <View className="mt-3">
              <EmailSubscribeSection
                defaultEmail="example@gmail.com"
                privacyUrl="https://www.sportm.site/about-us"
                onSubmit={async (email) => {
                  console.log('subscribe:', email);
                }}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
