import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FirebaseFacebookSignInTest from '@/components/AuthenticationComponent/FirebaseFacebookSignInTest';

export default function FacebookTestScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <FirebaseFacebookSignInTest />
    </SafeAreaView>
  );
}
