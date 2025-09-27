// ProfileScreenSkeleton.tsx
import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Skeleton } from '@/components/Skeleton';
import { Card, CardContent } from '@/components/Card';

export default function ProfileScreenSkeleton() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Top bar */}
      <View className="px-4 pb-2 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2 py-2">
          <Ionicons name="chevron-back" size={22} />
          <Skeleton className="w-32 h-4 rounded-md" />
        </View>
        <Skeleton className="w-12 h-12 rounded-full" />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        <View className="px-4">
          <Card className="border-0 overflow-hidden">
            <CardContent className="p-0">
              {/* Cover */}
              <Skeleton className="w-full" style={{ aspectRatio: 16 / 9 }} />

              {/* Floating actions */}
              <View className="absolute bottom-[-22px] left-20 flex-row gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
              </View>
              <View className="absolute bottom-[-22px] right-20 flex-row gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
              </View>

              {/* Avatar overlap */}
              <View className="absolute left-1/2 -translate-x-1/2 -bottom-10">
                <Skeleton className="w-28 h-28 rounded-full border-4 border-white" />
              </View>

              {/* Name */}
              <View className="items-center mt-14 px-4">
                <Skeleton className="w-40 h-6 rounded-md" />
              </View>

              {/* Quick actions */}
              <View className="flex-row gap-3 bg-white px-5 py-3 mt-4 border border-[#eee] rounded-2xl">
                {Array.from({ length: 3 }).map((_, i) => (
                  <View key={i} className="flex-1 items-center">
                    <Skeleton className="w-9 h-9 rounded-full mb-2" />
                    <Skeleton className="w-16 h-3 rounded-md" />
                  </View>
                ))}
              </View>

              {/* Hoạt động */}
              <View className="mt-5 px-4">
                <Skeleton className="w-24 h-4 mb-3 rounded-md" />
                <Skeleton className="w-full h-12 rounded-2xl mb-3" />
              </View>

              {/* Hệ thống */}
              <View className="mt-4 px-4">
                <Skeleton className="w-20 h-4 mb-3 rounded-md" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="w-full h-12 rounded-2xl mb-3"
                  />
                ))}
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
