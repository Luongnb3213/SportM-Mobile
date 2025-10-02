import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/Avatar';
import { Button } from '@/components/Button';
import {
  KeyboardAwareScrollView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { clearTokens } from '@/lib/tokenStorage';
import { router } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { useAxios } from '@/lib/api';
import { Skeleton } from '@/components/Skeleton';
import ProfileSkeleton from '@/components/Skeleton/ProfileSkeleton';

type Pill = { id: string | number; label: string; icon?: React.ReactNode };

const pills: Pill[] = [
  { id: 1, label: 'Cầu lông' },
  { id: 2, label: 'Cầu lông' },
  { id: 3, label: 'Cầu lông' },
  { id: 4, label: 'Cầu lông' },
  { id: 5, label: 'Cầu lông' },
];

export default function DetailAccount() {
  const insets = useSafeAreaInsets();
  const auth = useAuth();
  const [userData, setUserData] = React.useState(auth.user);
  const [loading, setLoading] = React.useState(false);
  const handleLogout = () => {
    clearTokens();
    router.replace('/authentication');
    auth.setUser(null);
    console.log('Logging out...');
  };

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);
      try {
        const { data } = await useAxios.get(`/users/${auth.user?.userId}`);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // giả lập delay
        console.log('Fetched user data in setting account:', data.data);
        setUserData(data.data);
      } catch (error) {
        console.log('Error fetching user data in setting account:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <KeyboardProvider>
        <SafeAreaView className="flex-1">
          <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            extraKeyboardSpace={0}
            contentContainerStyle={{ paddingBottom: insets.bottom + 150 }}
          >
            <ProfileSkeleton />
          </KeyboardAwareScrollView>
        </SafeAreaView>
      </KeyboardProvider>
    );
  }

  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          extraKeyboardSpace={0}
          contentContainerStyle={{ paddingBottom: insets.bottom + 150 }}
        >
          <View className="m-3 rounded-2xl overflow-hidden">
            {/* Header */}
            <View className="pb-0">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-start gap-3">
                  <TouchableOpacity
                    onPress={() => router.back()}
                    className="p-1.5 rounded-full"
                  >
                    <Ionicons name="chevron-back" size={22} />
                  </TouchableOpacity>

                  <View className="flex-row items-center gap-3">
                    <Avatar className="w-12 h-12">
                      {userData?.avatarUrl ? (
                        <AvatarImage source={{ uri: userData.avatarUrl }} />
                      ) : (
                        <AvatarFallback textClassname="text-base">
                          {userData?.fullName
                            ?.split(' ')
                            .map((w: string) => w[0])
                            .slice(0, 2)
                            .join('') || 'U'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <View>
                      <Text className="text-base font-semibold text-primary">
                        {auth.user?.fullName || ''}
                      </Text>
                      <Text className="text-xs text-muted-foreground">
                        Thành phố Hà Nội · 22t
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Ảnh chính */}
            <View className="pt-3">
              <View className="rounded-xl overflow-hidden">
                {userData?.avatarUrl ? (
                  <Image
                    source={{ uri: userData?.avatarUrl }}
                    className="w-full"
                    style={{ aspectRatio: 3 / 4 }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    className="w-full items-center justify-center"
                    style={{ aspectRatio: 3 / 4, backgroundColor: '#e1e1e1' }}
                  >
                    <Text className="text-8xl font-bold text-primary">
                      {userData?.fullName
                        ?.split(' ')
                        .map((w: string) => w[0])
                        .slice(0, 2)
                        .join('') || 'U'}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Hàng pill */}
            <View className="pt-3">
              <View className="flex-row flex-wrap gap-2">
                {pills.map((p) => (
                  <View
                    key={p.id}
                    className="rounded-lg px-3 flex items-center flex-col shadow-xl py-3 bg-white"
                  >
                    <MaterialCommunityIcons name="badminton" size={14} />
                    <Text className="text-xs"> {p.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Thông tin chi tiết */}
            <View className="flex-col items-start gap-2 mt-3">
              <Text className="text-3xl font-bold mb-3">Bio</Text>
              <View className="flex-row items-center gap-2">
                <AntDesign name="home" size={14} color="black" />
                <Text className="text-xl">Cầu Giấy, thành phố Hà Nội</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons name="location-outline" size={14} />
                <Text className="text-xl">1 kilometer away</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons name="time-outline" size={14} />
                <Text className="text-xl">Tất cả các ngày</Text>
              </View>
            </View>
            <View className="my-5">
              <Button
                onPress={handleLogout}
                className="rounded-xl h-12 bg-[#1F2257]"
              >
                Logout
              </Button>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardProvider>
  );
}
