import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import FriendCardSkeleton from '@/components/Skeleton/FriendCardSkeleton';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

type FeedItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  user: { name: string; avatar?: string };
};

export default function FeedScreen() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const inflightRef = useRef(false);

  // Fake seed data
  useEffect(() => {
    const timer = setTimeout(() => {
      setItems([
        {
          id: '1',
          title: 'Sân bóng mini Hòa Bình',
          description: 'Đặt sân nhanh chóng và tiện lợi',
          image: 'https://picsum.photos/800/1200?random=1',
          user: { name: 'Nguyễn Văn A' },
        },
        {
          id: '2',
          title: 'Sân cỏ nhân tạo Quận 7',
          description: 'Chất lượng cao, giá tốt',
          image: 'https://picsum.photos/800/1200?random=2',
          user: { name: 'Trần Thị B' },
        },
        {
          id: '3',
          title: 'Sân trong nhà Thành Công',
          description: 'Thoáng mát, tiện nghi, chỗ đậu xe rộng',
          image: 'https://picsum.photos/800/1200?random=3',
          user: { name: 'Phạm Văn C' },
        },
      ]);
      setInitialLoading(false);
    }, 1000); // giả delay để thấy skeleton
    return () => clearTimeout(timer);
  }, []);

  // Fake fetch /fiend/get-one (commented)
  const fetchOneAndAppend = useCallback(async () => {
    if (inflightRef.current) return;
    inflightRef.current = true;
    setLoadingMore(true);
    try {
      // const res = await api.get('/fiend/get-one');
      // const newItem: FeedItem = res.data;

      // Fake data thay thế API
      await new Promise(res => setTimeout(res, 1500));
      const fakeId = (items.length + 1).toString();
      const newItem: FeedItem = {
        id: fakeId,
        title: `Sân số ${fakeId}`,
        description: `Mô tả sân ${fakeId} - dữ liệu giả lập`,
        image: `https://picsum.photos/800/1200?random=${fakeId}`,
        user: { name: `Người chơi ${fakeId}` },
      };

      setItems(prev => [...prev, newItem]);
    } catch (e) {
      console.log('Fake fetch error', e);
    } finally {
      setLoadingMore(false);
      inflightRef.current = false;
    }
  }, [items]);

  const handleSnap = useCallback(
    (index: number) => {
      if (index >= items.length - 2) {
        fetchOneAndAppend();
      }
    },
    [items.length, fetchOneAndAppend]
  );

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
        {/* Header */}
        <View className="px-4 pb-2 flex-row justify-start">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center gap-2 py-2"
          >
            <Ionicons name="chevron-back" size={22} />
            <Text className="text-[15px] text-primary font-medium">Trở về trang trước</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1">
          <Carousel
            vertical
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT}
            data={items}
            loop={false}
            pagingEnabled
            onSnapToItem={handleSnap}
            renderItem={({ item }) => (
              <View className="w-full h-full relative bg-white">
                <View
                  style={{ marginHorizontal: 15, height: SCREEN_HEIGHT - 150 }}
                  className="rounded-2xl relative"
                >
                  <Image
                    source={{ uri: item.image }}
                    resizeMode="cover"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      borderRadius: 16,
                    }}
                  />

                  <View style={{ position: 'absolute', inset: 0, justifyContent: 'flex-end' }}>
                    <View className="bg-black/60 p-4 pb-28 rounded-2xl">
                      <Text className="text-white text-2xl font-bold">{item.user.name}</Text>
                      <Text className="text-gray-200 mt-1" numberOfLines={3}>
                        {item.description}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{ position: 'absolute', bottom: -30, left: 0, right: 0 }}
                    className="flex-row justify-center gap-6"
                  >
                    {/* Skip */}
                    <TouchableOpacity
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

                    {/* Friend requests */}
                    <TouchableOpacity
                      onPress={() => router.push('/(tabs)/addAccount/listFriendRequest')}
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 9999,
                        backgroundColor: '#D8D8D8',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <MaterialIcons name="supervisor-account" size={24} color="white" />
                    </TouchableOpacity>

                    {/* Add */}
                    <TouchableOpacity
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
        </View>
      </SafeAreaView>
    </KeyboardProvider>
  );
}
