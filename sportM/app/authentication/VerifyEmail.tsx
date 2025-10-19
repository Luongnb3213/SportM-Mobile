// app/(auth)/index.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  KeyboardProvider,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-controller';
import OtpVerify from '../../components/AuthenticationComponent/OtpVerify';
import RequestEmail from '@/components/AuthenticationComponent/RequestEmail';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

export default function VerifyEmail() {
  const { mode, email } = useLocalSearchParams<{
    mode?: string;
    email?: string;
  }>();
  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ backgroundColor: '#1F2257' }}
        >
          {/* khung xanh + panel trắng giống mockup */}
          <View className="rounded-2xl p-5 bg-[#1F2257]">
            <View className="rounded-2xl h-full bg-white px-5 py-6">
              <View className="mb-4">
                <TouchableOpacity
                  className="flex-row items-center gap-2"
                  onPress={() => {
                    router.back();
                  }}
                >
                  <Ionicons name="chevron-back" size={20} color="#1F2257" />
                  <Text className="text-lg text-primary font-medium">
                    Trở về trang trước
                  </Text>
                </TouchableOpacity>
              </View>
              <View className="w-[241px] h-[148px] self-center mb-6">
                <Image
                  source={require('../../assets/images/logo_sport_M.png')}
                  className="w-full h-full"
                />
              </View>
              {email ? (
                <OtpVerify
                  maskedEmail={email}
                  from={mode}
                />
              ) : (
                <RequestEmail
                  from={mode}
                  defaultEmail="luongnb3213@gmail.com"
                  submittingText="Đang gửi..."
                />
              )}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardProvider>
  );
}
