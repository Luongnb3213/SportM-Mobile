import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '@/components/Button';
import { router, useLocalSearchParams } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

function formatVNDate(iso: string) {
  const utc = new Date(iso);

  const VN_OFFSET_MS = 7 * 60 * 60 * 1000;
  const vn = new Date(utc.getTime() + VN_OFFSET_MS);

  const dow = vn.getUTCDay();
  const d = vn.getUTCDate();
  const m = vn.getUTCMonth() + 1;
  const y = vn.getUTCFullYear();

  const weekdayVN = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  return `${weekdayVN[dow]}, ngày ${d}/${m}/${y}`;
}
const FLOAT_GAP = 12;



const BookingSuccessScreen = () => {
  const { orderId, createdAt } = useLocalSearchParams<{ orderId: string, createdAt: string }>();
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
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
        style={{ backgroundColor: '#1F2257' }}
      >
        <View className="flex-row items-center px-4 py-5">
          <TouchableOpacity className="mr-3">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-base font-medium">
            Trở về trang trước
          </Text>
        </View>
        <View className="rounded-2xl p-5 bg-[#1F2257]">
          <View className="rounded-2xl -min-h-screen-safe-offset-8 items-center justify-between bg-white px-5 py-6">
            {/* Success Icon */}
            <View className="flex-1 items-center justify-center">
              <View className="w-32 h-32 rounded-full bg-green-500 justify-center items-center mb-8">
                <Ionicons name="checkmark" size={80} color="white" />
              </View>

              <Text className="text-3xl font-medium text-green-500 mb-4">
                ĐẶT SÂN THÀNH CÔNG
              </Text>
              <Text className="text-xl text-gray-600 mb-4">
                Booking ID. #{orderId || 'JQKA1234'}
              </Text>
              <Text className="text-2xl font-medium text-gray-800 mb-5">
                {formatVNDate(createdAt)}
              </Text>
            </View>

            <Button
              className="bg-primary w-full h-12 rounded-2xl mb-8"
              size="lg"
              textClassName="text-base"
              onPress={() => {
                router.push('/(tabs)/home/booking')
              }}
            >
              Xác nhận
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingSuccessScreen;
