// app/(tabs)/account/index.tsx
import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

export default function AccountScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-semibold">👤 Account</Text>
      <Pressable
        onPress={() => router.push("./settings")}
        className="mt-4 px-4 py-2 rounded-xl bg-[#4D8A43]"
      >
        <Text className="text-white">Mở Settings</Text>
      </Pressable>
    </View>
  );
}
