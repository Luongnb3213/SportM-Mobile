// ProfileSkeleton.tsx
import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@/components/Skeleton'; // chỉnh path nếu khác

export default function ProfileSkeleton() {
  return (
    <View className="m-3 rounded-2xl overflow-hidden">
      {/* Header */}
      <View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-start gap-3">

            {/* avatar + name */}
            <View className="flex-row items-center gap-3">
              <Skeleton className="w-12 h-12 rounded-full" />
              <View className="gap-2">
                <Skeleton className="w-40 h-4 rounded-md" />
                <Skeleton className="w-28 h-3 rounded-md" />
              </View>
            </View>
          </View>

          {/* edit button */}
          <Skeleton className="w-12 h-12 rounded-full" />
        </View>
      </View>

      {/* Ảnh chính */}
      <View className="pt-3">
        <View className="rounded-xl overflow-hidden">
          <Skeleton className="w-full" style={{ aspectRatio: 3 / 4 }} />
        </View>
      </View>

      {/* Hàng pill */}
      <View className="pt-3">
        <View className="flex-row flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-lg" />
          ))}
        </View>
      </View>

      {/* Thông tin chi tiết */}
      <View className="flex-col items-start gap-3 mt-3">
        <Skeleton className="w-28 h-7 rounded-md" />
        <View className="flex-row items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-md" />
          <Skeleton className="w-56 h-5 rounded-md" />
        </View>
        <View className="flex-row items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-md" />
          <Skeleton className="w-40 h-5 rounded-md" />
        </View>
        <View className="flex-row items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-md" />
          <Skeleton className="w-36 h-5 rounded-md" />
        </View>
      </View>

      {/* Logout button */}
      <View className="my-5">
        <Skeleton className="h-12 w-full rounded-xl" />
      </View>
    </View>
  );
}
