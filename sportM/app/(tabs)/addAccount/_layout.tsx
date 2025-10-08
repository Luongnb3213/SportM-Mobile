// app/(tabs)/search/_layout.tsx
import { Stack } from 'expo-router';

export default function SearchStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_bottom', // mặc định trong tab Search
      }}
    >
      <Stack.Screen name="index" options={{}} />
      <Stack.Screen name="listFriendRequest" options={{}} />
    </Stack>
  );
}
