import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import FriendCardSkeleton from '@/components/Skeleton/FriendCardSkeleton';
import { useAxios } from '@/lib/api';
import EmptyState from '@/components/ui/EmptyState';
import Toast from 'react-native-toast-message';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useAuth } from '@/providers/AuthProvider';
import { Avatar, AvatarFallback } from '@/components/Avatar';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

type FeedItem = {
  avatarUrl: string;
  bio: string;
  birthDate: string;
  fullName: string;
  gender: boolean;
  userId: string
};

const FLOAT_GAP = 12;

export default function FeedScreen() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const inflightRef = useRef(false);
  const { user } = useAuth();
  const carouselRef = useRef<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const bottomGap = Math.max(insets.bottom, 8) + tabBarHeight + FLOAT_GAP;

  useEffect(() => {
    if (!user) {
      router.replace('/authentication')
    }
  }, [])

  // Fake seed data
  useEffect(() => {
    (async () => {
      try {
        setInitialLoading(true);
        const { data } = await useAxios.get('friend/available');
        const { data: dataItem } = await useAxios.get('/friend/get-one');
        console.log(dataItem.data)
        setItems(dataItem.data)
        setInitialLoading(false);
      } catch (error) {
        console.log('error while fetching friend', error)
        setInitialLoading(false);
      }
    })()
  }, []);

  // Fake fetch /fiend/get-one (commented)
  const fetchOneAndAppend = useCallback(async () => {
    if (inflightRef.current) return;
    inflightRef.current = true;
    setLoadingMore(true);
    try {
      const { data } = await useAxios.get('/friend/get-one');
      setItems(prev => [...prev, ...data.data]);
    } catch (e) {
      console.log('Fake fetch error', e);
    } finally {
      setLoadingMore(false);
      inflightRef.current = false;
    }
  }, [items]);

  const handleSnap = useCallback(
    (index: number) => {
      setActiveIndex(index);
      if (index >= items.length - 2) {
        fetchOneAndAppend();
      }
    },
    [items.length, fetchOneAndAppend]
  );

  const handleSkip = () => {
    const next = Math.min(activeIndex + 1, items.length - 1);
    if (next !== activeIndex) {
      carouselRef.current?.scrollTo({ index: next, animated: true });
    }
  }

  const handleSendRequest = async () => {
    try {
      const current = items[activeIndex];
      if (!current?.userId) return;
      await useAxios.post('friend-request', { toId: current.userId });
      Toast.show({
        type: 'success',
        text1: 'Đã gửi lời mời kết bạn',
        text2: current.fullName ? `Tới ${current.fullName}` : undefined,
      });
      const next = Math.min(activeIndex + 1, items.length - 1);
      if (next !== activeIndex) {
        carouselRef.current?.scrollTo({ index: next, animated: true });
      }
    } catch (e) {
      console.log('send friend-request error', e);
      Toast.show({
        type: 'error',
        text1: 'Gửi lời mời thất bại',
        text2: 'Vui lòng thử lại',
      });
    }
  }

  if (initialLoading) {
    return (
      <KeyboardProvider>
        <SafeAreaView className="flex-1">
          <View className="px-4 pb-2 flex-row justify-start">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-row items-center gap-2 py-2"
            >
              <Ionicons name="chevron-back" size={22} />
              <Text className="text-[15px] text-primary font-medium">Trở về trang trước</Text>
            </TouchableOpacity>
          </View>
          <FriendCardSkeleton />
        </SafeAreaView>
      </KeyboardProvider>
    );
  }
  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1">
        <View className="px-4 pb-2 flex-row justify-between items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center gap-2 py-2"
          >
            <Ionicons name="chevron-back" size={22} />
            <Text className="text-[15px] text-primary font-medium">Trở về trang trước</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row items-center gap-2 py-2"
            onPress={() => router.push('/(tabs)/addAccount/listFriendRequest')}
          >
            <Text className="text-base text-primary font-medium">Xem lời mời</Text>
            <Ionicons name="chevron-back" style={{ transform: [{ rotateY: '180deg' }] }} size={20} />
          </TouchableOpacity>
        </View>

        <View className="flex-1" style={{ paddingBottom: bottomGap + 80 }}>
          {items.length === 0 ? (
            <EmptyState
              icon="people-outline"
              title="Không có gợi ý nào"
              description="Hiện chưa có gợi ý kết bạn nào."
            />
          ) : (
            <Carousel
              ref={carouselRef}
              vertical
              width={SCREEN_WIDTH}
              height={SCREEN_HEIGHT}
              data={items}
              loop={false}
              pagingEnabled
              enabled={false}
              onSnapToItem={handleSnap}
              renderItem={({ item }) => (
                <View className="w-full h-full relative bg-white">
                  <View
                    style={{ marginHorizontal: 15, height: SCREEN_HEIGHT - (bottomGap + 130) }}
                    className="rounded-2xl relative"
                  >
                    {item?.avatarUrl ? (
                      <Image
                        source={{ uri: item?.avatarUrl }}
                        resizeMode="cover"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          width: '100%',
                          height: '100%',
                          borderRadius: 16,
                        }}
                      />
                    ) : (
                      <Avatar style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        borderRadius: 16,
                      }}>
                        <AvatarFallback style={{
                          borderRadius: 16,
                        }} textClassname="text-xxl">{item.fullName?.split(' ').map(w => w[0]).slice(0, 2).join('') || 'U'}</AvatarFallback>
                      </Avatar>
                    )}


                    <View style={{ position: 'absolute', inset: 0, justifyContent: 'flex-end' }}>
                      <View className="bg-black/60 p-4 pb-28 rounded-2xl">
                        <Text className="text-white text-2xl font-bold">{item.fullName}</Text>
                        <Text className="text-gray-200 mt-1" numberOfLines={3}>
                          {item.bio}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{ position: 'absolute', bottom: -30, left: 0, right: 0 }}
                      className="flex-row justify-center gap-6"
                    >
                      {/* Skip */}
                      <TouchableOpacity
                        onPress={handleSkip}
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 9999,
                          backgroundColor: '#D8D8D8',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Ionicons name="close" size={28} color="white" />
                      </TouchableOpacity>
                      {/* Add */}
                      <TouchableOpacity
                        onPress={handleSendRequest}
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: 9999,
                          backgroundColor: '#1F2257',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Ionicons name="add" size={28} color="white" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Loading indicator khi đang prefetch */}
                  {loadingMore && (
                    <View className="absolute right-3 top-3 bg-black/40 rounded-full px-3 py-2">
                      <View className="flex-row items-center gap-2">
                        <ActivityIndicator />
                        <Text className="text-white text-xs">Đang tải...</Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
            />
          )
          }


        </View>
      </SafeAreaView>
    </KeyboardProvider>
  );
}
