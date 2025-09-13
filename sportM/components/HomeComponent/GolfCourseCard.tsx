import React from "react";
import { ImageBackground, View, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../Card";
import { ThemedText } from "../ThemedText";
import Button from "../Button";

type Props = {
  title: string;
  pricePerHour: string;   // "1.000.000/ giờ"
  rating: number | string; // 4.5
  imageUri: string;
  onPress?: () => void;
};

export default function GolfCourseCard({
  title,
  pricePerHour,
  rating,
  imageUri,
  onPress,
}: Props) {
  return (
    <Card className="rounded-2xl overflow-hidden">
      <Pressable onPress={onPress}>
        <ImageBackground
          source={{ uri: imageUri }}
          resizeMode="cover"
          className="h-40 w-full"
        >

          <View className="absolute inset-0 bg-black/10" />

          {/* nội dung đáy thẻ */}
          <View className="absolute inset-x-0 bottom-0 p-4">
            <Text
              className="text-white text-2xl font-medium"
            >
              {title}
            </Text>

            <View className="flex-row items-center">
              <Text className="text-white/90 font-medium">
                {pricePerHour}
              </Text>

              <Ionicons
                name="star"
                size={14}
                style={{ marginLeft: 8, marginRight: 4 }}
                color="#F5C045"
              />
              <Text className="text-white/90 font-medium">
                {String(rating)}
              </Text>

              <View className="flex-1" />

              <Button
                size="sm"
                className="rounded-full bg-black/40 px-4 py-2"
                onPress={onPress}
              >
                <Text className="text-white text-sm font-medium">
                  Xem chi tiết
                </Text>
              </Button>
            </View>
          </View>
        </ImageBackground>
      </Pressable>
    </Card>
  );
}
