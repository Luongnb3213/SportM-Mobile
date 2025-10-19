// BookingScheduleSkeleton.tsx
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, CardContent } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import { ScrollView } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function BookingScheduleSkeleton() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = typeof useBottomTabBarHeight === 'function' ? useBottomTabBarHeight() : 0;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        contentInsetAdjustmentBehavior="always"
        contentContainerStyle={{
          paddingBottom: (insets?.bottom ?? 0) + (tabBarHeight ?? 0) + 24,
        }}
      >
        <Card className="m-4 rounded-2xl" style={{ borderWidth: 0 }}>
          <CardContent className="px-4 py-4">
            <Skeleton className="h-6 w-48 rounded-lg mb-3" />
            <Skeleton className="h-4 w-28 rounded mb-2" />
            <Skeleton className="h-40 w-full rounded-xl" />
          </CardContent>
        </Card>

        <Card className="m-4 rounded-2xl" style={{ borderWidth: 0 }}>
          <CardContent className="px-4 py-4">
            <Skeleton className="h-4 w-40 rounded mb-3" />
            <View className="flex-row gap-3">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </View>
          </CardContent>
        </Card>

        <Card className="m-4 rounded-2xl" style={{ borderWidth: 0 }}>
          <CardContent className="px-4 py-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={i} className="flex-row items-center gap-3 mb-3">
                <Skeleton className="h-4 w-14 rounded" />
                <Skeleton className="h-8 flex-1 rounded-lg" />
                <Skeleton className="h-8 flex-1 rounded-lg" />
              </View>
            ))}
          </CardContent>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
