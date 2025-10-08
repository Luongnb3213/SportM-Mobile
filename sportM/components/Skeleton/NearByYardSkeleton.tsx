import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '../Skeleton';

export const NearByYardSkeleton = () => {
  return (
    <View
      className="rounded-2xl overflow-hidden"
      style={{ width: '100%', height: '100%' }}
    >
      {/* Hình nền */}
      <Skeleton className="w-full h-full" />

      {/* Overlay phần dưới */}
      <View className="absolute inset-x-0 bottom-0 p-4">
        {/* Tiêu đề */}
        <Skeleton className="h-6 w-40 rounded-md mb-2" />

        <View className="flex-col gap-2">
          {/* Giá */}
          <Skeleton className="h-4 w-24 rounded-md" />

          <View className="flex-row items-center gap-2 mt-2">
            {/* Location button giả */}
            <Skeleton className="h-7 w-20 rounded-full" />

            <View className="flex-1" />

            {/* Rating */}
            <Skeleton className="h-4 w-10 rounded-md" />
          </View>
        </View>
      </View>
    </View>
  );
};
