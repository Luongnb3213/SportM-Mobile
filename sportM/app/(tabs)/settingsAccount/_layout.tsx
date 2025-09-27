// app/(tabs)/account/_layout.tsx
import { Stack } from "expo-router";

export default function AccountStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right", // mặc định trong tab Account
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="detailAccount" />
      <Stack.Screen name="updateAccount" />
    </Stack>
  );
}
