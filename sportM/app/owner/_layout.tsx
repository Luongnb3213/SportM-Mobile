import { Stack } from 'expo-router';
export default function OwnerLayout() {
  return (
    <Stack
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="detailAccount" options={{ headerShown: false }} />
      <Stack.Screen name="notification" options={{ headerShown: false }} />
      <Stack.Screen name="addCourt" options={{ headerShown: false }} />
      <Stack.Screen name="detailCourt" options={{ headerShown: false }} />
      <Stack.Screen name="updateAccount" options={{ headerShown: false }} />
      <Stack.Screen name="updateCourt" options={{ headerShown: false }} />
      <Stack.Screen name="bookingOwner" options={{ headerShown: false }} />
      <Stack.Screen name="my-payments" options={{ headerShown: false }} />
    </Stack>
  );
}