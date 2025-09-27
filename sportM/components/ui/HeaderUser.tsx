import { useAxios } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { useAppTheme } from '@/styles/theme';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text } from 'react-native';
import { Image, View } from 'react-native';
import * as Location from 'expo-location';
import { Avatar, AvatarFallback, AvatarImage } from '../Avatar';
const HeaderUser = () => {
  const t = useAppTheme();
  const { user } = useAuth();
  const [showLocation, setShowLocation] = useState(true);

  useEffect(() => {
    (async () => {
      const perm = await Location.getForegroundPermissionsAsync();
      if (perm.status === 'granted') {
        console.log('Permission already granted:', perm.status);
        setShowLocation(false);
      }
    })();
  }, []);

  const PermissionLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    const perm = await Location.getForegroundPermissionsAsync();
    console.log('Current permission:', perm.status);
    const loc = await Location.getCurrentPositionAsync({});
    console.log('Location:', loc);
    setShowLocation(false);
  };

  return (
    <View className="py-4">
      <View className="flex-row items-center gap-3">
        <Avatar className="w-12 h-12 rounded-full">
          {user?.avatarUri ? (
            <AvatarImage source={{ uri: user.avatarUri }} />
          ) : (
            <AvatarFallback textClassname="text-base">
              {user?.fullName
                ?.split(' ')
                .map((w: string) => w[0])
                .slice(0, 2)
                .join('') || 'U'}
            </AvatarFallback>
          )}
        </Avatar>
        <Text className="flex-1 text-base font-bold text-center">
          Xin chào, {user?.fullName || ''}
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
      {showLocation && (
        <TouchableOpacity
          onPress={PermissionLocation}
          className="mt-3 rounded-xl bg-primary px-4 py-5 flex-row items-center justify-between"
        >
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
      )}
    </View>
  );
};

export default HeaderUser;
