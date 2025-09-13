// app/(tabs)/account/index.tsx
import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import MapboxMap from '@/components/ui/Map/Mapbox-map';

export default function SearchScreen() {
  return <MapboxMap />;
}
