import React from 'react';
import { View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton } from '@/components/Skeleton';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/Card';

const { width } = Dimensions.get('window');
const heroH = (width * 12) / 16;

export default function UpdateCourtSkeleton() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 pt-2">
        <View className="flex-row items-center justify-between">
          <Skeleton className="h-8 w-24 rounded-lg" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </View>
        <View className="mt-3">
          <Skeleton className="h-6 w-40 rounded-lg" />
        </View>
      </View>

      {/* HERO */}
      <View className="w-full mt-3" style={{ height: heroH }}>
        <Skeleton className="h-full w-full rounded-none" />
        <View className="absolute left-5 right-5 -bottom-6">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <View className="mt-3">
            <Skeleton className="h-12 w-full rounded-2xl" />
          </View>
          <View className="mt-3 items-center">
            <Skeleton className="h-12 w-72 rounded-xl" />
          </View>
        </View>
      </View>

      <View className="mx-3 my-9">
        <Card className="overflow-hidden rounded-2xl">
          <CardHeader className="p-0">
            <View className="bg-yellow-300 py-3 flex-row px-3 justify-center gap-8">
              <Skeleton className="h-6 w-32 rounded-md" />
            </View>
          </CardHeader>

          <CardContent className="px-3 py-4 bg-white">
            <View className="gap-3">
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-12 w-full rounded-2xl" />

              {/* pills */}
              <View className="flex-row flex-wrap gap-2 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-20 rounded-lg" />
                ))}
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
