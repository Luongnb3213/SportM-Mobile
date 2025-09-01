import React from 'react';
import { Image, View, Text } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

type GolfDealCardProps = {
  heading?: string; // “HÃY ĐẶT SÂN VỚI CHÚNG TÔI”
  title: string; // “Trải nghiệm…”
  image: string; // uri ảnh sân
  placeName: string; // “Sân Golf Nem Chua”
  description: string; // mô tả dài
  discountPercent?: number; // 36
  onBook?: () => void;
};

export default function GolfDealCard({
  heading = 'HÃY ĐẶT SÂN VỚI CHÚNG TÔI',
  title,
  image,
  placeName,
  description,
  discountPercent = 0,
  onBook,
}: GolfDealCardProps) {
  return (
    <View className="px-4">
      {/* Heading nhỏ */}
      <View className="mb-2 flex-row items-center">
        <Text className="ml-2 text-xs tracking-wide text-muted-foreground">
          {heading}
        </Text>
      </View>

      {/* Tiêu đề lớn */}
      <Text className="text-3xl font-bold leading-snug text-primary mb-4">
        {title}
      </Text>

      {/* Thẻ nội dung màu xanh nhạt */}
      <Card className="bg-green-200/70 rounded-3xl p-4">
        {/* Ảnh + phù hiệu giảm giá */}
        <View className="relative mb-4 rounded-3xl bg-white/80 p-2">
          <Image
            source={{ uri: image }}
            className="h-44 w-full rounded-2xl"
            resizeMode="cover"
          />

          {/* badge phần trăm + icon nhãn */}
          <View className="absolute right-4 -bottom-3 rounded-2xl px-3 py-2 bg-black/60 flex-row items-center">
            <Text className="mr-2 font-semibold text-white">
              {discountPercent}%
            </Text>
            <Ionicons name="pricetag" size={18} color="#fff" />
          </View>
        </View>

        {/* Tên sân */}
        <Text className="mb-2 text-lg font-semibold text-primary">
          {placeName}
        </Text>

        {/* Mô tả */}
        <Text className="mb-4 text-base leading-6 text-black dark:text-white">
          {description}
        </Text>

        {/* Nút đặt */}
        <Button
          label="Đặt ngay"
          className="rounded-xl bg-green-700"
          labelClasses="text-white"
          onPress={onBook}
        />
      </Card>
    </View>
  );
}
