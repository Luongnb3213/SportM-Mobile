import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/Avatar';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/Card';
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

type Pill = { id: string | number; label: string; icon?: React.ReactNode };

const pills: Pill[] = [
  { id: 1, label: 'Cầu lông' },
  { id: 2, label: 'Cầu lông' },
  { id: 3, label: 'Cầu lông' },
  { id: 4, label: 'Cầu lông' },
  { id: 5, label: 'Cầu lông' },
];

export default function ProfileCard() {
  const insets = useSafeAreaInsets();
  const auth = useAuth();

  const handleLogout = () => {
    clearTokens();
    console.log('User', auth.user);
    router.replace('/authentication');
    auth.setUser(null);
    console.log('Logging out...');
  };
  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          extraKeyboardSpace={0}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        >
          <View className="m-3 rounded-2xl overflow-hidden">
            {/* Header */}
            <View className="pb-0">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-start gap-3">
                  <TouchableOpacity className="p-1.5 rounded-full">
                    <Ionicons name="chevron-back" size={22} />
                  </TouchableOpacity>

                  <View className="flex-row items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        source={{ uri: 'https://i.pravatar.cc/100?img=65' }}
                      />
                      <AvatarFallback>PL</AvatarFallback>
                    </Avatar>
                    <View>
                      <Text className="text-base font-semibold text-primary">
                        PLEH
                      </Text>
                      <Text className="text-xs text-muted-foreground">
                        Thành phố Hà Nội · 22t
                      </Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity>
                  <View className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-2xl">
                    <Ionicons name="create-outline" size={24} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Ảnh chính */}
            <View className="pt-3">
              <View className="rounded-xl overflow-hidden">
                <Image
                  source={{ uri: 'https://i.pravatar.cc/100?img=66' }}
                  className="w-full"
                  style={{ aspectRatio: 3 / 4 }}
                  resizeMode="cover"
                />
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
