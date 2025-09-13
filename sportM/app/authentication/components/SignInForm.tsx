import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { Input } from '@/components/Input';        // :contentReference[oaicite:0]{index=0}
import Button  from '@/components/Button';      // :contentReference[oaicite:1]{index=1}
import { Checkbox } from '@/components/Checkbox';  // :contentReference[oaicite:2]{index=2}
import { ExternalLink } from '@/components/ExternalLink'; // :contentReference[oaicite:3]{index=3}
import { router } from 'expo-router';

type SignInFormProps = {
  onSubmit?: (email: string, password: string, remember: boolean) => void;
  onForgotPasswordHref?: string;
  onGooglePress?: () => void;
  onGoSignUp?: () => void;
};

export default function SignInForm({
  onSubmit,
  onForgotPasswordHref = 'https://sportm.vn/forgot',
  onGooglePress,
  onGoSignUp,
}: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [remember, setRemember] = useState(false);

  return (
    <View className="border-0 p-0">
      <Input
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Nhập email"
        inputClasses="rounded-xl bg-white"
        className="mb-3"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View className="mb-2">
        <Text className="mb-1 text-base">Mật khẩu</Text>
        <View className="flex-row items-center">
          <Input
            value={pwd}
            onChangeText={setPwd}
            placeholder="Nhập mật khẩu"
            secureTextEntry={!showPwd}
            className="flex-1"
            inputClasses="rounded-xl bg-white pr-10"
          />
          <TouchableOpacity
            className="absolute right-3 h-full justify-center"
            onPress={() => setShowPwd(v => !v)}
          >
            <Feather name={showPwd ? 'eye-off' : 'eye'} size={18} />
          </TouchableOpacity>
        </View>
      </View>

      <Button
        className="rounded-xl h-11 mt-2 bg-[#1F2257]"
        onPress={() => onSubmit?.(email, pwd, remember)}
      >
        Đăng nhập
      </Button>

      <View className="flex-row items-center justify-between mt-3">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => setRemember(v => !v)}
          activeOpacity={0.8}
        >
          <Checkbox checkboxClasses="w-4 h-4 rounded" className="mr-2" />
          <Text>Ghi nhớ mật khẩu</Text>
        </TouchableOpacity>

        <View className="underline">
          <Text onPress={() => {
             router.push("/authentication/VerifyEmail");
          }} className="text-[#1F2257] underline">Quên mật khẩu</Text>
        </View>
      </View>

      <View className="mt-3 flex-row justify-center">
        <Text>Chưa có tài khoản? </Text>
        <TouchableOpacity onPress={onGoSignUp}>
          <Text className="text-[#1F2257] font-semibold">Đăng ký</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="mt-4 h-11 rounded-xl bg-black/90 flex-row items-center justify-center"
        onPress={onGooglePress}
      >
        <AntDesign name="google" size={18} color="#fff" />
        <Text className="text-white ml-8">Or sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}
