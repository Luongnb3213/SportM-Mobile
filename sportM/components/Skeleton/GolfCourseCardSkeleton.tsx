import React from "react";
import { View } from "react-native";
import { Card } from "../Card";
import { Skeleton } from "../Skeleton";

export function GolfCourseCardSkeleton() {
  return (
    <Card className="rounded-2xl overflow-hidden">
      <View className="h-40 w-full">
        {/* nền ảnh */}
        <Skeleton className="absolute inset-0" />

        {/* overlay mờ đen (giữ style giống card thật) */}
        <View className="absolute inset-0 bg-[#EEEEEE]" />

        {/* phần nội dung đáy */}
        <View className="absolute inset-x-0 bottom-0 p-4">
          {/* tiêu đề */}
          <Skeleton className="h-6 w-40 rounded-md mb-2" />

          <View className="flex-row items-center">
            {/* giá */}
            <Skeleton className="h-4 w-24 rounded-md" />

            {/* icon + rating */}
            <Skeleton className="h-4 w-4 rounded-full ml-4" />
            <Skeleton className="h-4 w-8 rounded-md ml-2" />

            <View className="flex-1" />

            {/* nút */}
            <Skeleton className="h-8 w-24 rounded-full" />
          </View>
        </View>
      </View>
    </Card>
  );
}
