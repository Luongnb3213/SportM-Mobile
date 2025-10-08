// components/Skeleton/CommentsSkeleton.tsx
import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@/components/Skeleton';

export default function CommentsSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <View className="py-2">
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} className="flex-row gap-3 py-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <View className="flex-1">
            <Skeleton className="h-4 w-40 rounded-md mb-2" />
            <Skeleton className="h-4 w-full rounded-md mb-2" />
            <Skeleton className="h-4 w-11/12 rounded-md" />
          </View>
        </View>
      ))}
    </View>
  );
}
