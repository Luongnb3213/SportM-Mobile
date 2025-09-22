import Button from '@/components/Button';
import { Input } from '@/components/Input';
import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Image } from 'react-native';
import { View } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChangePassword = () => {
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);

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
                    // router.back() nếu dùng expo-router
                    // router.back();
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
                <View className="mb-2">
                  <Text className="mb-1 text-base">Mật khẩu mới</Text>
                  <View className="flex-row items-center">
                    <Input
                      value={pwd}
                      onChangeText={setPwd}
                      placeholder="Nhập mật khẩu mới"
                      secureTextEntry={!showPwd}
                      className="flex-1"
                      inputClasses="rounded-xl bg-white pr-10"
                    />
                    <TouchableOpacity
                      className="absolute right-3 h-full justify-center"
                      onPress={() => setShowPwd((v) => !v)}
                    >
                      <Feather name={showPwd ? 'eye-off' : 'eye'} size={18} />
                    </TouchableOpacity>
                  </View>
                </View>
                <View className="mb-2">
                  <Text className="mb-1 text-base">Nhập lại mật khẩu</Text>
                  <View className="flex-row items-center">
                    <Input
                      value={pwd}
                      onChangeText={setPwd}
                      placeholder="Nhập lại mật khẩu"
                      secureTextEntry={!showPwd}
                      className="flex-1"
                      inputClasses="rounded-xl bg-white pr-10"
                    />
                    <TouchableOpacity
                      className="absolute right-3 h-full justify-center"
                      onPress={() => setShowPwd((v) => !v)}
                    >
                      <Feather name={showPwd ? 'eye-off' : 'eye'} size={18} />
                    </TouchableOpacity>
                  </View>
                </View>

                <Button
                  className="rounded-xl h-11 mt-2 bg-[#1F2257]"
                  onPress={() => {}}
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
