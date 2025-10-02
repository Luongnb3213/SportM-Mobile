
import DetailInfoOwnerCourtCard from '@/components/OwnerComponent/DetailInfoOwnerCourtCard';
import HeaderUser from '@/components/ui/HeaderUser';
import { useAxios } from '@/lib/api';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const DetailCourt = () => {
  const insets = useSafeAreaInsets();
  const { courtID } = useLocalSearchParams<{
    courtID: string;
  }>();
     
  const [court, setCourt] = useState();

  useEffect(() => {
     (async() => {
      if(!courtID)
        return
        try {
          const {data} = await useAxios.get(`courts/${courtID}`)
          setCourt(data.data)
        } catch (error) {
          console.log('Fetch error', error)
        }
     })()
  },[])



  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          extraKeyboardSpace={0}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 50,
            flexGrow: 1,
          }}
        >
          <View className="px-4">
            <HeaderUser />
          </View>
          {/* header back */}
          <View className="px-4">
            <TouchableOpacity
              className="flex-row items-center gap-2 py-2"
              onPress={() => {
                 router.back();
              }}
            >
              <Ionicons name="chevron-back" size={20} />
              <Text className="text-base text-primary font-medium">
                Trở về trang trước
              </Text>
            </TouchableOpacity>
          </View>

          <View className="">
            <ImageBackground
              source={{
                uri: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600',
              }}
              resizeMode="cover"
              className="w-full"
              style={{ aspectRatio: 16 / 12 }}
            >
              {/* overlay làm tối ảnh một chút để chữ nổi bật */}
              <View className="absolute inset-0 bg-black/25" />
              {/* texts */}
              <View className="px-4 mt-2">
                <Text className="text-lg text-gray-200">Mai Lâm, Đông Anh</Text>

                <Text
                  // màu vàng tươi giống ảnh
                  style={{ color: '#FFF200' }}
                  className="mt-2 text-4xl font-medium leading-tight"
                >
                  SÂN GOLF NEM CHUA
                </Text>

                {/* rating pill */}
                <View className="mt-3 flex-row items-center">
                  <View className="flex-row items-center gap-1 rounded-full bg-black/60 px-3 py-1.5">
                    <Text className="text-white text-base font-semibold">
                      5.0
                    </Text>
                    <Ionicons name="star" size={14} color="#FFD54F" />
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
          <View className="shadow-2xl">
            <DetailInfoOwnerCourtCard courtID={courtID} />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardProvider>
  );
};

export default DetailCourt;
