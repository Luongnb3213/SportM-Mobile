import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FirebaseGoogleSignInTest from '@/components/AuthenticationComponent/FirebaseGoogleSignInTest';

export default function FirebaseTestScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <FirebaseGoogleSignInTest />
    </SafeAreaView>
  );
}
