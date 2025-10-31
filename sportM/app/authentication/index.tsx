// app/(auth)/index.tsx
import React from 'react';
import { View, Text, Image, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SignInForm from '../../components/AuthenticationComponent/SignInForm';
import SignUpForm from '../../components/AuthenticationComponent/SignUpForm';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';
import { Platform } from 'react-native';

export default function AuthScreen() {
  const { screenname, email } = useLocalSearchParams<{
    screenname?: string;
    email?: string;
  }>();
  const [screen, setScreen] = React.useState<'login' | 'signup' | string>(
    screenname || 'login'
  );
  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          automaticallyAdjustKeyboardInsets
          contentInsetAdjustmentBehavior="always"
          contentContainerStyle={{
            flexGrow: 1
          }}
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
                {screen === 'login' ? (<Text
                  className={`w-1/2 text-2xl text-[#292929] text-center ${screen === 'login' ? 'font-bold text-primary' : ''
                    }`}
                >
                  Đăng nhập
                </Text>) : (<Text
                  className={`w-1/2 text-2xl text-[#292929] text-center ${screen === 'signup' ? 'font-bold text-primary' : ''
                    }`}
                >
                  Đăng ký
                </Text>)}

              </View>
              {screen === 'login' ? <SignInForm /> : <SignUpForm email={email} />}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
