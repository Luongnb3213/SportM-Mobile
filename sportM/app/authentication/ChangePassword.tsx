import Button from '@/components/Button';
import { Input } from '@/components/Input';
import { useAxios } from '@/lib/api';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { View } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

const ChangePassword = () => {
  const { mode, email } = useLocalSearchParams<{
    mode?: string;
    email?: string;
  }>();
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const submitChangePassword = async () => {
    try {
      const { data: res } = await useAxios.patch('/auth/update-password', {
        email: email?.trim(),
        newPassword: pwd.trim(),
      });
      if (res.status == 'success') {
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Mật khẩu của bạn đã được thay đổi 🎉',
        });
        router.push('/authentication');
      }
    } catch (error: any) {
      console.log('Error changing password', error.response.data);
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
      });
    }
  };

  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1 bg-background">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ backgroundColor: '#1F2257' }}
        >
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
                  <Text className="text-base text-primary font-medium">
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
              <View>
                <Text className="text-xl font-semibold text-black text-center mt-6 mb-4">
                  Đổi mật khẩu
                </Text>
                <View className="mb-5">
                  <Text className="mb-1 text-base">Mật khẩu mới</Text>
                  <View className="flex-row items-center">
                    <Input
                      value={pwd}
                      onChangeText={setPwd}
                      placeholder="Nhập mật khẩu mới"
                      secureTextEntry={!show1}
                      className="flex-1"
                      inputClasses="rounded-xl bg-white pr-10"
                    />
                    <TouchableOpacity
                      className="absolute right-3 h-full justify-center"
                      onPress={() => setShow1((v) => !v)}
                    >
                      <Feather name={show1 ? 'eye-off' : 'eye'} size={18} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="mb-5">
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
                    <TouchableOpacity
                      className="absolute right-3 h-full justify-center"
                      onPress={() => setShow2((v) => !v)}
                    >
                      <Feather name={show2 ? 'eye-off' : 'eye'} size={18} />
                    </TouchableOpacity>
                  </View>
                </View>

                <Button
                  className="rounded-xl h-11 mt-2 bg-[#1F2257]"
                  onPress={submitChangePassword}
                >
                  Đổi Mật Khẩu
                </Button>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardProvider>
  );
};

export default ChangePassword;
