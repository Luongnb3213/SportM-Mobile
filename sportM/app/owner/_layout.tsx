import { socket } from '@/lib/socket';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
export default function OwnerLayout() {

  useEffect(() => {
    (async () => {
      await socket.connect();

      const onConnect = () => console.log('✅ connected', socket.socket?.id);
      const onDisconnect = (r: any) => console.log('🔌 disconnected', r);

      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
    })();
  }, [])



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