// app/(auth)/index.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  KeyboardProvider,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-controller';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/Tabs'; // :contentReference[oaicite:6]{index=6}
import SignInForm from './components/SignInForm';
import SignUpForm from './components/SignUpForm';

export default function AuthScreen() {
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

              <Tabs defaultValue="login">
                <TabsList className="mb-4 gap-2">
                  <TabsTrigger value="login" title="Đăng nhập" />
                  <TabsTrigger value="signup" title="Đăng ký" />
                </TabsList>

                <TabsContent value="login" className="border-0 p-0">
                  <SignInForm
                    onSubmit={(email, pwd, remember) =>
                      console.log('login:', { email, pwd, remember })
                    }
                    onGooglePress={() => console.log('google sign in')}
                    onGoSignUp={() => console.log('switch to sign up')}
                  />
                </TabsContent>

                <TabsContent value="signup" className="border-0 p-0">
                  <SignUpForm
                    onSubmit={(phone, name, pw1, pw2) =>
                      console.log('signup:', { phone, name, pw1, pw2 })
                    }
                    onGooglePress={() => console.log('google sign up')}
                    onGoSignIn={() => console.log('switch to sign in')}
                  />
                </TabsContent>
              </Tabs>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardProvider>
  );
}
