// FeedScreen.tsx
import React from "react";
import { Dimensions, View, Text, Image, TouchableOpacity } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Button from "@/components/Button";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

type FeedItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  user: { name: string; avatar?: string };
};

const DATA: FeedItem[] = [
  {
    id: "1",
    title: "Sân bóng mini Hòa Bình",
    description: "Đặt sân nhanh chóng và tiện lợi",
    image: "https://picsum.photos/800/1200",
    user: { name: "Nguyễn Văn A", avatar: "" },
  },
  {
    id: "2",
    title: "Sân cỏ nhân tạo Quận 7",
    description: "Chất lượng cao, giá tốt",
    image: "https://picsum.photos/801/1200",
    user: { name: "Trần Thị B" },
  },
];

export default function FeedScreen() {
  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1">
        <View className="px-4 pb-2 flex-row justify-start">
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
            className="flex-row items-center gap-2 py-2"
          >
            <Ionicons name="chevron-back" size={22} />
            <Text className="text-[15px] text-primary font-medium">
              Trở về trang trước
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1">
          <Carousel
            vertical
            width={SCREEN_WIDTH}
            height={SCREEN_HEIGHT}
            data={DATA}
            loop={false}
            pagingEnabled
            renderItem={({ item }) => (
              <View className="w-full h-full relative bg-white">
                <View
                  style={{ marginHorizontal: 15, height: SCREEN_HEIGHT - 150 }}
                  className="rounded-2xl relative"
                >
                  <Image
                    source={{ uri: item.image }}
                    resizeMode="cover"
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", borderRadius: 16 }}
                  />


                  <View style={{ position: "absolute", inset: 0, justifyContent: "flex-end", borderRadius: 16 }}>
                    <View className="bg-black/60 border-0" style={{ padding: 16, paddingBottom: 120, borderRadius: 16 }}>
                      <Text className="text-white text-2xl font-bold">{item.user.name}</Text>
                      <Text className="text-gray-200 mt-1" numberOfLines={3}>
                        {item.description}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{ position: "absolute", bottom: -30, left: 0, right: 0 }}
                    className="flex-row justify-center gap-6"
                  >
                    <TouchableOpacity
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 9999,
                        backgroundColor: "#D8D8D8",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 3,
                        elevation: 6,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          width: 67,
                          height: 67,
                          borderRadius: 9999,
                          backgroundColor: "#D8D8D8",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons name="close" size={28} color="white" />
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 9999,
                        backgroundColor: "#D8D8D8",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 3,
                        elevation: 6,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          width: 67,
                          height: 67,
                          borderRadius: 9999,
                          backgroundColor: "#1F2257",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Ionicons name="add" size={28} color="white" />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

            )}
          />
        </View>
      </SafeAreaView>
    </KeyboardProvider>

  );
}
