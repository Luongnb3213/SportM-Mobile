import { Button, StyleSheet, Text, View } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../firebaseConfig';

GoogleSignin.configure({
  webClientId:
    '1013531353218-ecdkpttpkjdah5a4bi40m942s4ljpmak.apps.googleusercontent.com',
});

export default function HomeScreen() {
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      const { idToken } = await GoogleSignin.getTokens(); // Lấy token rõ ràng

      const googleCredential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, googleCredential);

      console.log('Logged in as:', userCredential.user);
    } catch (error) {
      console.error(error);
    }
  };

  const signOutFromGoogle = async () => {
  try {
    await GoogleSignin.signOut();
    console.log("User signed out!");
  } catch (error) {
    console.error("Sign out error:", error);
  }
};

  const width = useSharedValue(100);

  const handlePress = () => {
    width.value = withSpring(width.value + 50);
  };
  return (
    <View className="flex-1 justify-center items-center">
      <Text>Edit app/index.tsx to edit this screen</Text>
      <Animated.View
        style={{
          width,
          height: 100,
          backgroundColor: 'violet',
        }}
      />
      <Button onPress={signInWithGoogle} title="Click gg" />
      <Button onPress={signOutFromGoogle} title="Sign out" />

    </View>
  );
}
