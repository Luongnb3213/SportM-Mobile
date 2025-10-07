// app/friends/index.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  KeyboardAwareScrollView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import HeaderUser from '@/components/ui/HeaderUser';
import FriendPending from '@/components/AddFriendComponent/FriendPending';
import FriendSent from '@/components/AddFriendComponent/FriendSent';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
type User = { id: string; name: string; subtitle?: string; avatar?: string };

type SectionKey = 'pending' | 'sent';

export default function listFriendRequest() {
  const [section, setSection] = useState<SectionKey>('pending');

  const handleChangeScreen = (screen: SectionKey) => {
    setSection(screen);
  };
  const insets = useSafeAreaInsets();

  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1 bg-background">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: insets.bottom + 150,
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
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardProvider>
  );
}
