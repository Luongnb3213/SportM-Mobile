import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Input } from '@/components/Input'; // :contentReference[oaicite:2]{index=2}
import Button from '@/components/Button'; // :contentReference[oaicite:3]{index=3}
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useAxios } from '@/lib/api';
import GoogleSignInButton from '@/components/SocialAuth/GoogleSignInButton';
import FacebookSignInButton from '@/components/SocialAuth/FacebookSignInButton';
export default function SignUpForm({ email }: { email?: string }) {
  const [fullName, setFullName] = useState('');
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    pwd?: string;
    pwd2?: string;
  }>({});
  const pwdOK = useMemo(() => {
    const p = pwd;
    if (p.length < 6) return false;

    const hasLetter = /[A-Za-z]/.test(p);
    const hasDigit = /\d/.test(p);
    const noSpecial = /^[A-Za-z0-9]*$/.test(p);

    return hasLetter && hasDigit && noSpecial;
  }, [pwd]);

  const validate = () => {
    const next: typeof errors = {};

    // fullName
    const name = fullName.trim();
    if (!name) next.fullName = 'Họ và tên là bắt buộc';
    else if (name.length < 2) next.fullName = 'Họ và tên quá ngắn';

    // password
    if (!pwd) next.pwd = 'Mật khẩu là bắt buộc';
    else if (!pwdOK)
      next.pwd = 'Mật khẩu phải ≥ 6 ký tự và bao gồm cả chữ và số';

    // confirm password
    if (!pwd2) next.pwd2 = 'Vui lòng nhập lại mật khẩu';
    else if (pwd2 !== pwd) next.pwd2 = 'Mật khẩu nhập lại không khớp';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      console.log('Signing up', { fullName, email, pwd });
      const { data: res } = await useAxios.post('/auth/signup', {
        fullName: fullName.trim(),
        email: email?.trim(),
        password: pwd.trim(),
      });

      if (res.status == 'success') {
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Đăng ký thành công 🎉',
        });
        router.push('/authentication');
      }
    } catch (error) {
      setLoading(false);
      console.log('Signup error', error);
      Toast.show({
        type: 'error',
        text1: 'Thất bại',
        text2: 'Đã có lỗi xảy ra, vui lòng thử lại sau.',
      });
    }
  };

  useEffect(() => {
    if (!email) {
      router.push({
        pathname: '/authentication/VerifyEmail',
        params: { mode: 'signup' },
      });
      return;
    }
  }, []);

  return (
    <View className="border-0 p-0 flex-col gap-3">
      {/* FULL NAME */}
      <Input
        label="Tên đầy đủ"
        value={fullName}
        onChangeText={(v) => {
          setFullName(v);
          if (errors.fullName)
            setErrors((e) => ({ ...e, fullName: undefined }));
        }}
        placeholder="Nhập họ và tên"
        className=""
        inputClasses="rounded-xl bg-white"
      />
      {errors.fullName ? (
        <Text className="text-red-500 italic mb-2">{errors.fullName}</Text>
      ) : null}

      {/* PASSWORD */}
      <View className="">
        <Text className="mb-1 text-base">Mật khẩu</Text>
        <View className="flex-row items-center">
          <Input
            value={pwd}
            onChangeText={(v) => {
              setPwd(v);
              if (errors.pwd) setErrors((e) => ({ ...e, pwd: undefined }));
            }}
            placeholder="Nhập mật khẩu"
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
      {errors.pwd ? (
        <Text className="text-red-500 italic mb-2">{errors.pwd}</Text>
      ) : null}

      {/* CONFIRM PASSWORD */}
      <View className="">
        <Text className="mb-1 text-base">Nhập lại mật khẩu</Text>
        <View className="flex-row items-center">
          <Input
            value={pwd2}
            onChangeText={(v) => {
              setPwd2(v);
              if (errors.pwd2) setErrors((e) => ({ ...e, pwd2: undefined }));
            }}
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
      {errors.pwd2 ? (
        <Text className="text-red-500 italic mb-2">{errors.pwd2}</Text>
      ) : null}

      <Button
        activeOpacity={loading ? 0.6 : 1}
        className="rounded-xl h-12 mt-2 bg-[#1F2257]"
        textClassName="text-lg"
        onPress={onSubmit}
      >
        Đăng ký
      </Button>

      <View className="mt-3 flex-row justify-center">
        <Text>Đã có tài khoản? </Text>
        <TouchableOpacity onPress={() => router.push('/authentication')}>
          <Text className="text-[#1F2257]  font-semibold">Đăng nhập</Text>
        </TouchableOpacity>
      </View>

      {/* SOCIAL SIGN-IN */}
      <GoogleSignInButton
        text="hoặc đăng ký với Google"
        className="h-11 mt-3 rounded-xl bg-black/90 flex-row items-center justify-center"
      />
      <FacebookSignInButton
        text="hoặc đăng ký với Facebook"
        className="h-11 mt-3 rounded-xl bg-[#1877F2] flex-row items-center justify-center"
      />
    </View>
  );
}
