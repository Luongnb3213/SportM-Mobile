// app/friends/index.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import HeaderUser from '@/components/ui/HeaderUser';
import FriendPending from '@/components/AddFriendComponent/FriendPending';
import FriendSent from '@/components/AddFriendComponent/FriendSent';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
type User = { id: string; name: string; subtitle?: string; avatar?: string };

type SectionKey = 'pending' | 'sent';

export default function listFriendRequest() {
  const [section, setSection] = useState<SectionKey>('pending');

  const handleChangeScreen = (screen: SectionKey) => {
    setSection(screen);
  };
  const insets = useSafeAreaInsets();
  const tabBarHeight = typeof useBottomTabBarHeight === 'function' ? useBottomTabBarHeight() : 0;
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        contentInsetAdjustmentBehavior="always"
        contentContainerStyle={{
          paddingBottom: (insets?.bottom ?? 0) + (tabBarHeight ?? 0) + 24,
        }}
      >
        <View className="px-4 py-4">
          <HeaderUser />
          <View className="px-4 pb-2 flex-row justify-start">
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/addAccount')}
              className="flex-row items-center gap-2 py-2"
            >
              <Ionicons name="chevron-back" size={22} />
              <Text className="text-[15px] text-primary font-medium">Trở về trang trước</Text>
            </TouchableOpacity>
          </View>
          <View className="h-full bg-white py-6 rounded-2xl">
            <Text className="text-xl font-bold mb-4">Bạn bè</Text>
            <View className="flex-row items-center justify-start gap-3">
              <TouchableOpacity
                onPress={() => {
                  handleChangeScreen('pending');
                }}
                className={`px-5 py-3 rounded-full min-w-20 items-center ${section === 'pending' ? 'bg-primary' : 'bg-gray-400'
                  }`}
              >
                <Text className="text-white text-sm">Yêu cầu đang chờ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handleChangeScreen('sent');
                }}
                className={`px-5 py-3 rounded-full min-w-20 items-center ${section === 'sent' ? 'bg-primary' : 'bg-gray-400'
                  }`}
              >
                <Text className="text-white text-sm">Lời mời đã gửi</Text>
              </TouchableOpacity>
            </View>

            <View className="">
              <View className={''}>
                {section === 'pending' && <FriendPending />}

                {section === 'sent' && <FriendSent />}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
