import Button from '@/components/Button';
import { Input } from '@/components/Input';
import FacebookSignInButton from '@/components/SocialAuth/FacebookSignInButton';
import GoogleSignInButton from '@/components/SocialAuth/GoogleSignInButton';
import { useAxios } from '@/lib/api';
import { clearCredentials, getCredentials, saveCredentials } from '@/lib/credentialStorage';
import { decodeJwt } from '@/lib/jwt';
import { saveTokens } from '@/lib/tokenStorage';
import { useAuth } from '@/providers/AuthProvider';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import Toast from 'react-native-toast-message';

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
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return re.test(String(email).trim());
  }, [email]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const creds = await getCredentials();
      if (mounted && creds) {
        setEmail(creds.email ?? '');
        setPwd(creds.password ?? '');
        setRemember(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

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
      console.log(remember);
      if (remember) {
        await saveCredentials(email.trim(), pwd);
      } else {
        await clearCredentials();
      }
      if (payload?.role == 'CLIENT') {
        router.replace('/home');
      } else {
        router.replace('/owner');
      }
    } catch (err: any) {
      console.log(err);
      Toast.show({
        type: 'error',
        text1: 'Đăng nhập thất bại. Vui lòng thử lại.',
        text2: 'Vui lòng kiểm tra lại email và mật khẩu.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="border-0 p-0">
      <View className="mb-4">
        <Input
          label="Email"
          value={email}
          onChangeText={t => {
            setEmail(t);
            if (errors.email) setErrors(e => ({ ...e, email: undefined }));
          }}
          placeholder="Nhập email"
          inputClasses="rounded-xl bg-white"
          className="mb-1"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {errors.email ? <Text className="text-red-500 italic mb-2">{errors.email}</Text> : null}
      </View>

      {/* PASSWORD */}
      <View className="mb-4">
        <Text className="mb-1 text-base">Mật khẩu</Text>
        <View className="flex-row items-center mb-1">
          <Input
            value={pwd}
            onChangeText={t => {
              setPwd(t);
              if (errors.pwd) setErrors(e => ({ ...e, pwd: undefined }));
            }}
            placeholder="Nhập mật khẩu"
            secureTextEntry={!showPwd}
            className="flex-1"
            inputClasses="rounded-xl bg-white pr-10"
          />
          <TouchableOpacity
            className="absolute right-3 h-full justify-center"
            onPress={() => setShowPwd(v => !v)}
            activeOpacity={0.8}
          >
            <Feather name={showPwd ? 'eye-off' : 'eye'} size={18} />
          </TouchableOpacity>
        </View>
        {errors.pwd ? (
          <Text className="text-red-500 italic mb-2" style={{ fontStyle: 'italic' }}>
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
      {serverError ? <Text className="text-red-500 italic mt-2">{serverError}</Text> : null}

      {/* FORGOT PASSWORD */}
      <View className="flex-row items-center justify-between mt-5">
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => setRemember(v => !v)}
          activeOpacity={0.8}
        >
          <View
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              borderWidth: 1.5,
              borderColor: '#1F2257',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: remember ? '#1F2257' : 'transparent',
            }}
          >
            {remember && <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>✓</Text>}
          </View>

          <Text style={{ marginLeft: 8 }}>Ghi nhớ mật khẩu</Text>
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

      {/* SOCIAL SIGN-IN */}
      <GoogleSignInButton text="Or sign in with Google" />
      <FacebookSignInButton text="Or sign in with Facebook" />
    </View>
  );
}
