// components/FriendCardSkeleton.tsx
import React from 'react';
import { Dimensions, View } from 'react-native';
import { Skeleton } from '@/components/Skeleton';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function FriendCardSkeleton() {
  return (
    <View className="w-full h-full bg-white">
      <View
        style={{ marginHorizontal: 15, height: SCREEN_HEIGHT - 150 }}
        className="rounded-2xl relative overflow-hidden"
      >
        {/* Ảnh lớn */}
        <Skeleton className="absolute inset-0 rounded-2xl" />

        {/* Overlay info */}
        <View className="absolute inset-0 justify-end p-4 pb-28">
          <View className="bg-black/60 rounded-2xl p-4">
            {/* Tên */}
            <Skeleton className="h-6 w-48 mb-2 rounded-md" />
            {/* Mô tả 2-3 dòng */}
            <Skeleton className="h-4 w-[90%] mb-2 rounded-md" />
            <Skeleton className="h-4 w-[70%] rounded-md" />
          </View>
        </View>
      </View>

      {/* 3 nút tròn phía dưới */}
      <View
        style={{ position: 'absolute', bottom: -30, left: 0, right: 0 }}
        className="flex-row justify-center gap-6 pb-4"
      >
        <Skeleton className="w-[70px] h-[70px] rounded-full" />
        <Skeleton className="w-[70px] h-[70px] rounded-full" />
        <Skeleton className="w-[70px] h-[70px] rounded-full" />
      </View>
    </View>
  );
}
