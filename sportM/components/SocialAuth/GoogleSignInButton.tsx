import React, { useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { auth as firebaseAuth } from '@/firebaseConfig';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { useAxios } from '@/lib/api';
import { saveTokens } from '@/lib/tokenStorage';
import { decodeJwt } from '@/lib/jwt';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';

interface GoogleSignInButtonProps {
  text?: string;
  className?: string;
}

export default function GoogleSignInButton({
  text = 'Sign in with Google',
  className = 'mt-5 h-12 rounded-xl bg-black/90 flex-row items-center justify-center',
}: GoogleSignInButtonProps) {
  const auth = useAuth();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '541367103107-65bmjade8oc66jc67hs9fh5vdk4d1cgf.apps.googleusercontent.com',
      profileImageSize: 120,
      iosClientId: '541367103107-cv9gqeavsmtslnuk3j35p9ecjca8g733.apps.googleusercontent.com',
    });
  }, []);

  const handleGoogleSignin = async () => {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        const { idToken, user } = response.data;
        const { email, name } = user;

        // Sign in to Firebase with Google credential
        const googleCredential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(firebaseAuth, googleCredential);

        // Call backend API
        const { data } = await useAxios.post('/auth/social-login', {
          email: email.trim(),
          fullName: name,
        });
        const { access } = data.data;

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
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Đăng nhập Google thất bại. Vui lòng thử lại.',
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
      } else {
        console.log('Firebase authentication error:', error);
      }
    }
  };

  return (
    <TouchableOpacity
      className={className}
      onPress={handleGoogleSignin}
      activeOpacity={0.85}
    >
      <AntDesign name="google" size={18} color="#fff" />
      <Text className="text-white ml-8">{text}</Text>
    </TouchableOpacity>
  );
}
