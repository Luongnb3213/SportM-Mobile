import { useAppTheme } from '@/styles/theme';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { Image, View } from 'react-native';

const HeaderUser = () => {
  const t = useAppTheme();

  return (
    <View className="py-4">
      <View className="flex-row items-center gap-3">
        <Image
          source={{ uri: 'https://i.pravatar.cc/100?img=12' }}
          className="w-12 h-12 rounded-full"
        />
        <Text className="flex-1 text-base font-bold text-center">
          Xin chào, Lại Gia Tùng
        </Text>
        <TouchableOpacity>
          <View className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-2xl">
            <MaterialCommunityIcons
              name="account-outline"
              size={24}
              color={t.foreground}
            />
          </View>
        </TouchableOpacity>
      </View>
      <TouchableOpacity className="mt-3 rounded-xl bg-primary px-4 py-5 flex-row items-center justify-between">
        <View className="w-9 h-9 rounded-full bg-white/90 items-center justify-center">
          <Ionicons name="location-outline" size={18} color="#1F2257" />
        </View>
        <View className="flex-1 px-5">
          <Text className="text-white text-lg font-normal">
            Hãy cho phép sportM truy cập vị trí để gợi ý chính xác hơn
          </Text>
        </View>
        <Feather name="chevron-right" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderUser;
