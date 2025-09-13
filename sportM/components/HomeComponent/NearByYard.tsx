import React from 'react';
import { ImageBackground, View, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../Card';
import { ThemedText } from '../ThemedText';
import Button from '../Button';

type Props = {
  title: string;
  pricePerHour: string; // "1.000.000/ giờ"
  rating: number | string; // 4.5
  imageUri: string;
  location?: string; // "Hà Nội"
};

export default function NearByYard({
  title,
  pricePerHour,
  rating,
  imageUri,
  location,
}: Props) {
  return (
    <View
      className="rounded-2xl overflow-hidden"
      style={{ width: '100%', height: '100%' }}
    >
        <ImageBackground
          source={{ uri: imageUri }}
          resizeMode="cover"
          className="h-full w-full"
        >
          <View className="absolute inset-0 bg-black/10" />

          {/* nội dung đáy thẻ */}
          <View className="absolute inset-x-0 bottom-0 p-4">
            <Text className="text-white text-2xl font-medium">{title}</Text>

            <View className="flex-col items-start gap-2">
              <Text className="text-white/90 font-medium">{pricePerHour}</Text>
              <View className="flex-row gap-2 items-start">
                <Button
                  size="sm"
                  className="rounded-full bg-black/40 px-4 py-2"
                  style={{ maxWidth: 150 }}
                >
                  <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    className="text-white text-sm font-medium"
                  >
                    {location}
                  </Text>
                </Button>
                <View className="flex-1" />
                <View className="flex-row items-center">
                  <Ionicons
                    name="star"
                    size={14}
                    style={{ marginLeft: 8, marginRight: 4 }}
                    color="#F5C045"
                  />
                  <Text className="text-white/90 font-medium">
                    {String(rating)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
    </View>
  );
}
