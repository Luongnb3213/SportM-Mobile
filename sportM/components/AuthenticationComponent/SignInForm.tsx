import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { Input } from '@/components/Input';
import Button from '@/components/Button';
import { router } from 'expo-router';
import { useAxios } from '@/lib/api';
import { saveTokens } from '@/lib/tokenStorage';
import { Checkbox } from '../Checkbox';
import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/providers/AuthProvider';
import { decodeJwt } from '@/lib/jwt';

GoogleSignin.configure({
  webClientId:
    '504083896204-iff4f78io6sc5rs1otq0t9o1lhitignv.apps.googleusercontent.com',
  profileImageSize: 120,
  iosClientId:
    '504083896204-du75dra9lbe1kglvlsrsa5apv7d3145e.apps.googleusercontent.com',
});

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [remember, setRemember] = useState(false);
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const auth = useAuth();

  // field errors
  const [errors, setErrors] = useState<{ email?: string; pwd?: string }>({});

  const isEmail = useMemo(() => {
    // Regex email đơn giản, đủ dùng mobile form
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return re.test(String(email).trim());
  }, [email]);

  const validate = () => {
    const next: typeof errors = {};
    if (!email.trim()) {
      next.email = 'Email là bắt buộc';
    } else if (!isEmail) {
      next.email = 'Email không hợp lệ';
    }
    if (!pwd.trim()) {
      next.pwd = 'Mật khẩu là bắt buộc';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async () => {
    setServerError(null);
    if (!validate()) return;
    try {
      setSubmitting(true);
      const { data } = await useAxios.post('/auth/signin', {
        email: email.trim(),
        password: pwd,
      });
      const { access } = data.data;
      Toast.show({
        type: 'success',
        text1: 'Đăng nhập thành công',
        text2: 'Chào mừng bạn đã trở lại!',
      });
      const payload = decodeJwt(access);
      auth.setUser(payload);
      await saveTokens('accessToken', access);
      if (payload?.role == 'CLIENT') {
        router.replace('/home');
      } else {
        router.replace('/owner');
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: 'Đăng nhập thất bại. Vui lòng thử lại.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignin = async () => {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const { user } = response.data;
        const { email, name } = user;
        const { data } = await useAxios.post('/auth/signin', {
          email: email.trim(),
          fullName: name,
        });
        const { access } = data.data;
        Toast.show({
          type: 'success',
          text1: 'Đăng nhập thành công',
          text2: 'Chào mừng bạn đã trở lại!',
        });
        const payload = decodeJwt(access);
        auth.setUser(payload);
        await saveTokens('accessToken', access);
        if (payload?.role == 'CLIENT') {
          router.replace('/home');
        } else {
          router.replace('/owner');
        }
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Đăng nhập thất bại. Vui lòng thử lại.',
      });
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log('User cancelled the login flow');
            break;
          case statusCodes.IN_PROGRESS:
            console.log('Sign in is in progress already');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log('Play services not available or outdated');
            break;
          default:
            console.log('Some other error happened:', error);
        }
      }
    }
  };

  return (
    <View className="border-0 p-0">
      <View className="mb-4">
        <Input
          label="Email"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            if (errors.email) setErrors((e) => ({ ...e, email: undefined }));
          }}
          placeholder="Nhập email"
          inputClasses="rounded-xl bg-white"
          className="mb-1"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {errors.email ? (
          <Text className="text-red-500 italic mb-2">{errors.email}</Text>
        ) : null}
      </View>

      {/* PASSWORD */}
      <View className="mb-4">
        <Text className="mb-1 text-base">Mật khẩu</Text>
        <View className="flex-row items-center mb-1">
          <Input
            value={pwd}
            onChangeText={(t) => {
              setPwd(t);
              if (errors.pwd) setErrors((e) => ({ ...e, pwd: undefined }));
            }}
            placeholder="Nhập mật khẩu"
            secureTextEntry={!showPwd}
            className="flex-1"
            inputClasses="rounded-xl bg-white pr-10"
          />
          <TouchableOpacity
            className="absolute right-3 h-full justify-center"
            onPress={() => setShowPwd((v) => !v)}
            activeOpacity={0.8}
          >
            <Feather name={showPwd ? 'eye-off' : 'eye'} size={18} />
          </TouchableOpacity>
        </View>
        {errors.pwd ? (
          <Text
            className="text-red-500 italic mb-2"
            style={{ fontStyle: 'italic' }}
          >
            {errors.pwd}
          </Text>
        ) : null}
      </View>

      {/* NÚT SIGN IN */}
      <Button
        className="rounded-xl h-12 mt-2 bg-[#1F2257]"
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <View className="flex-row items-center gap-2">
            <ActivityIndicator />
            <Text className="text-white">Đang đăng nhập…</Text>
          </View>
        ) : (
          'Đăng nhập'
        )}
      </Button>

      {/* LỖI SERVER */}
      {serverError ? (
        <Text className="text-red-500 italic mt-2">{serverError}</Text>
      ) : null}

      {/* FORGOT PASSWORD */}
      <View className="flex-row items-center justify-between mt-5">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => setRemember((v) => !v)}
          activeOpacity={0.8}
        >
          <Checkbox
            checkboxClasses="w-4 h-4 rounded"
            checked={remember}
            className="mr-2"
          />
          <Text>Ghi nhớ mật khẩu</Text>
        </TouchableOpacity>
        <View className="underline">
          <Text
            onPress={() => {
              router.push({
                pathname: '/authentication/VerifyEmail',
                params: { mode: 'forgotpassword' },
              });
            }}
            className="text-[#1F2257] underline"
          >
            Quên mật khẩu
          </Text>
        </View>
      </View>

      {/* SIGN UP */}
      <View className="mt-5 flex-row justify-center">
        <Text>Chưa có tài khoản? </Text>
        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: '/authentication/VerifyEmail',
              params: { mode: 'signup' },
            });
          }}
        >
          <Text className="text-[#1F2257] font-semibold">Đăng ký</Text>
        </TouchableOpacity>
      </View>

      {/* GOOGLE SIGN-IN */}
      <TouchableOpacity
        className="mt-5 h-12 rounded-xl bg-black/90 flex-row items-center justify-center"
        onPress={handleGoogleSignin}
        activeOpacity={0.85}
      >
        <AntDesign name="google" size={18} color="#fff" />
        <Text className="text-white ml-8">Or sign in with Google</Text>
      </TouchableOpacity>
    </View>
  );
}
