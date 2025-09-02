import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { Input } from '@/components/Input';      // :contentReference[oaicite:4]{index=4}
import { Button } from '@/components/Button';    // :contentReference[oaicite:5]{index=5}

type SignUpFormProps = {
  onSubmit?: (phone: string, fullName: string, password: string, confirm: string) => void;
  onGooglePress?: () => void;
  onGoSignIn?: () => void;
};

export default function SignUpForm({
  onSubmit,
  onGooglePress,
  onGoSignIn,
}: SignUpFormProps) {
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  return (
    <View className="border-0 p-0">
      <View className="mb-3">
        <Text className="mb-1 text-base">Số điện thoại</Text>
        <Input
          value={phone}
          onChangeText={setPhone}
          placeholder="+84  ›  Nhập số điện thoại"
          keyboardType="phone-pad"
          inputClasses="rounded-xl bg-white"
        />
      </View>

      <Input
        label="Tên đầy đủ"
        value={fullName}
        onChangeText={setFullName}
        placeholder="Nhập họ và tên"
        className="mb-3"
        inputClasses="rounded-xl bg-white"
      />

      <View className="mb-3">
        <Text className="mb-1 text-base">Mật khẩu</Text>
        <View className="flex-row items-center">
          <Input
            value={pwd}
            onChangeText={setPwd}
            placeholder="Nhập mật khẩu"
            secureTextEntry={!show1}
            className="flex-1"
            inputClasses="rounded-xl bg-white pr-10"
          />
          <TouchableOpacity className="absolute right-3 h-full justify-center" onPress={() => setShow1(v => !v)}>
            <Feather name={show1 ? 'eye-off' : 'eye'} size={18} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mb-2">
        <Text className="mb-1 text-base">Nhập lại mật khẩu</Text>
        <View className="flex-row items-center">
          <Input
            value={pwd2}
            onChangeText={setPwd2}
            placeholder="Nhập lại mật khẩu"
            secureTextEntry={!show2}
            className="flex-1"
            inputClasses="rounded-xl bg-white pr-10"
          />
          <TouchableOpacity className="absolute right-3 h-full justify-center" onPress={() => setShow2(v => !v)}>
            <Feather name={show2 ? 'eye-off' : 'eye'} size={18} />
          </TouchableOpacity>
        </View>
      </View>

      <Button
        label="Đăng ký"
        className="rounded-xl h-11 mt-2 bg-[#4D8A43]"
        onPress={() => onSubmit?.(phone, fullName, pwd, pwd2)}
      />

      <View className="mt-3 flex-row justify-center">
        <Text>Đã có tài khoản? </Text>
        <TouchableOpacity onPress={onGoSignIn}>
          <Text className="text-[#2E7D32] font-semibold">Đăng nhập</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="mt-4 h-11 rounded-xl bg-black/90 flex-row items-center justify-center"
        onPress={onGooglePress}
      >
        <AntDesign name="google" size={18} color="#fff" />
        <Text className="text-white ml-8">Or sign up with Google</Text>
      </TouchableOpacity>
    </View>
  );
}
