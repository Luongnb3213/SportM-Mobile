// app/(auth)/index.tsx
import React from 'react';
import { View, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  KeyboardProvider,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-controller';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/Tabs'; // :contentReference[oaicite:6]{index=6}
import SignInForm from '../../components/AuthenticationComponent/SignInForm';
import SignUpForm from '../../components/AuthenticationComponent/SignUpForm';
import { router, useLocalSearchParams } from 'expo-router';

export default function AuthScreen() {
  const { screenname, email } = useLocalSearchParams<{
    screenname?: string;
    email?: string;
  }>();
  const [screen, setScreen] = React.useState<'login' | 'signup' | string>(
    screenname || 'login'
  );
  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1 bg-background">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ backgroundColor: '#1F2257' }}
        >
          {/* khung xanh + panel trắng giống mockup */}
          <View className="rounded-2xl p-5 bg-[#1F2257]">
            <View className="rounded-2xl h-full bg-white px-5 py-6">
              <View className="w-[241px] h-[148px] self-center mb-6">
                <Image
                  source={require('../../assets/images/logo_sport_M.png')}
                  className="w-full h-full"
                />
              </View>
              <View className="flex-row justify-center mb-8">
                <Text
                  className={`w-1/2 text-2xl text-[#292929] text-center ${
                    screen === 'login' ? 'font-bold underline' : ''
                  }`}
                >
                  Đăng nhập
                </Text>
                <Text
                  className={`w-1/2 text-2xl text-[#292929] text-center ${
                    screen === 'signup' ? 'font-bold underline' : ''
                  }`}
                >
                  Đăng ký
                </Text>
              </View>
              {screen === 'login' ? <SignInForm  /> : <SignUpForm email={email} />}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardProvider>
  );
}
