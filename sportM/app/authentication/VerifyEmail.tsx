// app/(auth)/index.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  KeyboardProvider,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-controller';
import RequestEmail from './components/RequestEmail';
import OtpVerify from './components/OtpVerify';

export default function VerifyEmail() {
  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1 bg-background">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ backgroundColor: '#4D8A43' }}
        >
          {/* khung xanh + panel trắng giống mockup */}
          <View className="rounded-2xl p-5 bg-[#4D8A43]">
            <View className="rounded-2xl h-full bg-white px-5 py-6">
              <Text className="text-5xl font-extrabold text-[#2E7D32] text-center mb-4">
                SPORTM
              </Text>
              <OtpVerify
                maskedEmail="mother*****@gmail.com"
                onResend={() => {
                  /* call API resend */
                }}
                onConfirm={async (code) => {
                  /* call API verify */
                }}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardProvider>
  );
}
