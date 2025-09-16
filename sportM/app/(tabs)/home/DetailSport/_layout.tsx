import { Stack } from 'expo-router';

export default function DetailSportLayout() {
  return (
    <Stack
      initialRouteName="index"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="index"/>
      <Stack.Screen name="bookingSchedule"/>
      <Stack.Screen name="BookingSuccessScreen"/>
    </Stack>
  );
}
