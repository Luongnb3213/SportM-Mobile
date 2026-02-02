import React, { useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { AccessToken, LoginManager, Settings } from 'react-native-fbsdk-next';
import Toast from 'react-native-toast-message';
import { useAxios } from '@/lib/api';
import { saveTokens } from '@/lib/tokenStorage';
import { decodeJwt } from '@/lib/jwt';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';

interface FacebookSignInButtonProps {
  text?: string;
  className?: string;
}

export default function FacebookSignInButton({
  text = 'Sign in with Facebook',
  className = 'mt-3 h-12 rounded-xl bg-[#1877F2] flex-row items-center justify-center',
}: FacebookSignInButtonProps) {
  const auth = useAuth();

  useEffect(() => {
    // Initialize Facebook SDK
    Settings.setAppID(process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || '1854307095290666');
    Settings.initializeSDK();
  }, []);

  const handleFacebookSignin = async () => {
    try {
      LoginManager.logOut();
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

      if (result.isCancelled) {
        return;
      }

      const data = await AccessToken.getCurrentAccessToken();
      if (!data) {
        throw new Error('Could not get Facebook access token');
      }

      // Fetch user info from Facebook Graph API
      const response = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email&access_token=${data.accessToken}`
      );
      const fbUserData = await response.json();

      if (!fbUserData.email) {
        throw new Error('Email not provided by Facebook');
      }

      // Call backend API
      const { data: res } = await useAxios.post('/auth/social-login', {
        email: fbUserData.email.trim(),
        fullName: fbUserData.name,
      });
      const { access } = res.data;

      Toast.show({
        type: 'success',
        text1: 'Đăng nhập thành công',
        text2: 'Chào mừng bạn!',
      });

      const payload = decodeJwt(access);
      auth.setUser(payload);
      await saveTokens('accessToken', access);

      if (payload?.role === 'CLIENT') {
        router.replace('/home');
      } else {
        router.replace('/owner');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Đăng nhập Facebook thất bại. Vui lòng thử lại.',
      });
      console.log('Facebook Sign-In Error:', error);
    }
  };

  return (
    <TouchableOpacity
      className={className}
      onPress={handleFacebookSignin}
      activeOpacity={0.85}
    >
      <AntDesign name="facebook-square" size={18} color="#fff" />
      <Text className="text-white ml-8">{text}</Text>
    </TouchableOpacity>
  );
}
