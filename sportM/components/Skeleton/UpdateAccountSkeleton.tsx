import React from 'react';
import { View, ScrollView, SafeAreaView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Skeleton } from '@/components/Skeleton';
import { Card, CardHeader } from '@/components/Card';

export default function UpdateAccountSkeleton() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Back row (fixed) */}
      <View className="flex-row items-center gap-2 py-2 px-4 mb-4">
      </View>

      {/* Header cố định */}
      <Card className="m-4 pb-4 border-b border-border">
        <CardHeader className="items-center gap-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-6 w-48 rounded-md" />
        </CardHeader>
      </Card>

      {/* Form (scroll được) */}
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="gap-5 px-8">
          {/* Tên */}
          <View className="gap-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-11 rounded-lg" />
          </View>
  
          <View className="gap-2">
            <Skeleton className="h-5 w-40" />
            <View className="flex-row items-center border border-input rounded-lg px-3 h-11">
              <Skeleton className="h-4 w-8 mr-2" /> 
              <Skeleton className="h-3 w-3 mr-2 rounded-sm" /> 
              <View className="flex-1">
                <Skeleton className="h-6 w-full" />
              </View>
            </View>
          </View>

          {/* Bank account */}
          <View className="gap-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-11 rounded-lg" />
          </View>

          {/* Bio (textarea) */}
          <View className="gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-36 rounded-2xl" />
          </View>

          {/* Ngày sinh */}
          <View className="gap-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-11 rounded-lg" />
          </View>

          {/* Giới tính (2 radio) */}
          <View className="gap-3">
            <Skeleton className="h-5 w-20" />
            <View className="flex-row items-center gap-8">
              <View className="flex-row items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-10" />
              </View>
              <View className="flex-row items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-8" />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer cố định (2 nút) */}
      <View className="absolute bottom-0 left-0 right-0 flex-row gap-4 p-4 bg-background border-t border-border">
        <Skeleton className="h-10 flex-1 rounded-md" />
        <Skeleton className="h-10 flex-1 rounded-md" />
      </View>
    </SafeAreaView>
  );
}
