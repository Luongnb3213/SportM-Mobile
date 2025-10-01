// app/(tabs)/index/_layout.tsx
import { Stack } from 'expo-router';

export default function HomeStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="index" options={{}} />
      <Stack.Screen
        name="DetailSport"
        options={{ animation: 'slide_from_right' }} 
      />
      <Stack.Screen name="booking" options={{}} />
      <Stack.Screen name="search" options={{}} />
    </Stack>
  );
}
