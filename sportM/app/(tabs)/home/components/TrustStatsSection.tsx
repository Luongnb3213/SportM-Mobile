// components/TrustStatsSection.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/Button';

type Props = {
  eyebrow?: string; // "KẾT NỐI VỚI CHÚNG TÔI"
  heading1: string; // "Sẻ chia sự"
  heading2: string; // "tin tưởng khi sử dụng"
  paragraph: string; // đoạn mô tả bên dưới
  ctaLabel?: string; // "Đăng ký hội viên"
  onPressCTA?: () => void;
  stat1Value: string; // "360+"
  stat1Desc: string; // "Hơn 360 sân được liệt kê..."
  stat2Value: string; // "22k+"
  stat2Desc: string; // "Người chủ sân đã tin tưởng..."
  hashtags?: string; // "#sportmlove #ilovenemchua"
};

export default function TrustStatsSection({
  eyebrow = 'KẾT NỐI VỚI CHÚNG TÔI',
  heading1,
  heading2,
  paragraph,
  ctaLabel = 'Đăng ký hội viên',
  onPressCTA,
  stat1Value,
  stat1Desc,
  stat2Value,
  stat2Desc,
  hashtags,
}: Props) {
  return (
    <View className="px-4 py-6">
      {/* Eyebrow */}
      <Text className="text-xs tracking-wide text-muted-foreground mb-2">
        {eyebrow}
      </Text>

      {/* Heading */}
      <Text className="text-3xl font-bold text-primary leading-snug">
        {heading1}
      </Text>
      <Text className="text-3xl font-extrabold text-yellow-600 leading-snug mb-3">
        {heading2}
      </Text>

      {/* Paragraph */}
      <Text className="text-base text-black/80 dark:text-white/80 mb-4">
        {paragraph}
      </Text>

      {/* CTA */}
      <Button
        label={ctaLabel}
        className="bg-green-700  rounded-2xl mb-8 "
        onPress={onPressCTA}
        labelClasses="text-yellow-300"
      />
      {/* Icon sau nút */}
      <View className="absolute right-9 top-[154px]">
        <Ionicons name="arrow-forward" size={18} color="#fff" />
      </View>

      {/* Stats block 1 */}
      <View className="mb-8">
        <Text className="text-6xl font-bold text-green-700 mb-2">
          {stat1Value}
        </Text>
        <Text className="text-lg text-primary">{stat1Desc}</Text>
      </View>

      {/* Stats block 2 */}
      <View className="mb-2">
        <Text className="text-6xl font-bold text-green-700 mb-2">
          {stat2Value}
        </Text>
        <Text className="text-lg text-primary mb-1">{stat2Desc}</Text>
        {!!hashtags && (
          <Text className="text-base text-green-700/90">{hashtags}</Text>
        )}
      </View>
    </View>
  );
}
