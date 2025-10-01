// UserInviteItemSkeleton.tsx
import React from 'react';
import { View } from 'react-native';
import { Card } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';

export function UserInviteItemSkeleton() {
  return (
    <Card className="flex-row items-center gap-3 px-3 py-2 rounded-2xl bg-white shadow-sm mb-3">
      {/* Avatar skeleton */}
      <Skeleton className="w-20 h-20 rounded-full" />

      {/* Info skeleton */}
      <View className="flex-1 gap-2">
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="h-4 w-20 rounded-md" />
      </View>

      {/* Actions skeleton */}
      <View className="flex-row gap-3">
        <Skeleton className="w-14 h-8 rounded-xl" />
        <Skeleton className="w-14 h-8 rounded-xl" />
      </View>
    </Card>
  );
}

// Render danh sách skeleton
export function UserInviteListSkeleton() {
  return (
    <View>
      {Array.from({ length: 4 }).map((_, i) => (
        <UserInviteItemSkeleton key={i} />
      ))}
    </View>
  );
}
