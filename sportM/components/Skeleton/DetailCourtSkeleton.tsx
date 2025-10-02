import React from 'react';
import { View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton } from '@/components/Skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/Card';

const { width } = Dimensions.get('window');
const heroH = (width * 12) / 16;

export default function DetailCourtSkeleton() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header (back + user) */}
      <View className="px-4 pt-2">
        <View className="flex-row items-center justify-between">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </View>
        <View className="mt-3">
          <Skeleton className="h-6 w-40 rounded-lg" />
        </View>
      </View>

      {/* HERO carousel skeleton */}
      <View className="w-full mt-3" style={{ height: heroH }}>
        <Skeleton className="h-full w-full rounded-none" />
        {/* overlay texts */}
        <View className="absolute left-4 right-4 top-4">
          <Skeleton className="h-5 w-52 rounded-md" />
          <View className="mt-3">
            <Skeleton className="h-8 w-64 rounded-md" />
            <View className="mt-1">
              <Skeleton className="h-8 w-40 rounded-md" />
            </View>
          </View>
          <View className="mt-3">
            <Skeleton className="h-7 w-16 rounded-full" />
          </View>
        </View>
        {/* dots */}
        <View className="absolute bottom-3 left-0 right-0 items-center">
          <View className="flex-row gap-2">
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-2 w-2 rounded-full" />
            <Skeleton className="h-2 w-2 rounded-full" />
          </View>
        </View>
      </View>

      {/* Card content skeleton */}
      <View className="mx-3 my-3">
        <Card className="overflow-hidden rounded-2xl">
          <CardHeader className="p-0">
            <View className="bg-yellow-300 py-3 flex-row px-3 justify-center gap-8">
              <Skeleton className="h-6 w-24 rounded-md" />
              <Skeleton className="h-6 w-24 rounded-md" />
            </View>
          </CardHeader>

          <CardContent className="px-3 py-4 bg-white">
            <View className="gap-3">
              {/* address */}
              <View className="rounded-xl bg-gray-50 px-4 py-3">
                <Skeleton className="h-5 w-8 rounded-md mb-2" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
              </View>
              {/* price */}
              <View className="rounded-xl bg-gray-50 px-4 py-3">
                <Skeleton className="h-5 w-8 rounded-md mb-2" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
              </View>
              {/* owner */}
              <View className="rounded-xl bg-gray-50 px-4 py-3">
                <Skeleton className="h-5 w-8 rounded-md mb-2" />
                <Skeleton className="h-4 w-3/5 rounded-md" />
              </View>
              {/* phone */}
              <View className="rounded-xl bg-gray-50 px-4 py-3">
                <Skeleton className="h-5 w-8 rounded-md mb-2" />
                <Skeleton className="h-4 w-2/5 rounded-md" />
              </View>
              {/* sport type */}
              <View className="rounded-xl bg-gray-50 px-4 py-3">
                <Skeleton className="h-5 w-8 rounded-md mb-2" />
                <Skeleton className="h-4 w-1/2 rounded-md" />
              </View>

              {/* title + description */}
              <View className="mt-2">
                <Skeleton className="h-5 w-40 rounded-md mb-2" />
                <Skeleton className="h-4 w-full rounded-md mb-2" />
                <Skeleton className="h-4 w-11/12 rounded-md mb-2" />
                <Skeleton className="h-4 w-10/12 rounded-md" />
              </View>
            </View>
          </CardContent>

          <CardFooter className="px-3 pb-4 bg-white">
            <Skeleton className="h-12 w-full rounded-xl" />
          </CardFooter>
        </Card>
      </View>
    </SafeAreaView>
  );
}
