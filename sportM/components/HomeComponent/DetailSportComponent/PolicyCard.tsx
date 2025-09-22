// app/(tabs)/home/DetailSport/policy.tsx  (đặt nơi bạn muốn)
import React from 'react';
import { View, Text } from 'react-native';

export default function PolicyCard() {

  return (
    <View className="m-2 rounded-2xl">
      {/* Header chào + mô tả ngắn */}
      <View className="mb-3">
        <Text className="text-lg font-semibold text-primary">Xin chào,</Text>
        <Text className="text-2xl font-extrabold text-primary">
          chúng tôi là SportM
        </Text>
        <Text className="mt-2 text-[13.5px] leading-5 text-muted-foreground">
          Hãy vui lòng dành ra một chút thời gian để đọc chính sách của chúng
          tôi nhé
        </Text>
      </View>

      {/* Khung chính sách có thể cuộn */}
      <View className="p-0">
        <View className="rounded-2xl bg-gray-100 px-4 py-3">
          <Text className="text-xl font-extrabold text-primary">
            ĐIỀU KHOẢN VÀ CHÍNH SÁCH{'\n'}
            SỬ DỤNG ỨNG DỤNG ĐẶT{'\n'}
            SÂN THỂ THAO SPORTM
          </Text>

          <View className="mt-3">
            <Text className="text-[13.5px] leading-6 text-primary">
              Input các chính sách vào đây input các chính sách vào đây input
              các chính sách vào đây…
              {'\n\n'}
              Bạn có thể thêm đoạn văn bản dài… {'\n'}
              1. Quy định A…{'\n'}
              2. Quy định B…{'\n'}
              3. Quy định C…{'\n\n'}
              Khi bấm “Đồng ý”, bạn xác nhận đã đọc và chấp nhận các điều khoản
              nêu trên.
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
