// app/index.tsx
import { Redirect } from 'expo-router';
import { useAuth } from '../providers/AuthProvider';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size={'large'} />
      </View>
    );
  }

  return (
    <Redirect href={status === 'authenticated' ? '/(tabs)/home/DetailSport/bookingSchedule' : '/authentication'} />
  );
}
