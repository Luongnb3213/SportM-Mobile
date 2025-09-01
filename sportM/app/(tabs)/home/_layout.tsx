// app/(tabs)/index/_layout.tsx
import { Stack } from 'expo-router';

export default function HomeStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right', // mặc định trong tab Home
        gestureEnabled: true,
      }}
    >
      {/* tuỳ chỉnh animation theo từng màn nếu muốn */}
      <Stack.Screen name="index" options={{}} />
      <Stack.Screen
        name="detail"
        options={{ animation: 'slide_from_right' }} // riêng màn detail dùng fade
      />
    </Stack>
  );
}
