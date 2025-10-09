import { Button, StyleSheet, Text, View } from 'react-native';
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated';
import React, { useState, useCallback, useEffect } from 'react';
import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '504083896204-iff4f78io6sc5rs1otq0t9o1lhitignv.apps.googleusercontent.com',
  profileImageSize: 120,
  iosClientId:
    '504083896204-du75dra9lbe1kglvlsrsa5apv7d3145e.apps.googleusercontent.com',
});

export default function GoogleSigninScreen() {

    const signOutFromGoogle = async () => {
    try {
      await GoogleSignin.signOut();
      console.log("User signed out!");
    } catch (error) {
      console.log("Sign out error:", error);
    }
  };

  const width = useSharedValue(100);

  const handlePress = () => {
    width.value = withSpring(width.value + 50);
  };
   
  const handleGoogleSignin = async () => {
     try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if(isSuccessResponse(response)) {
        const { idToken, user } = response.data;
        const { name, email, photo } = user;
        console.log("User Info:", { idToken, name, email, photo });
      }
     } catch (error) {
        if(isErrorWithCode(error)) {
          switch(error.code) {
            case statusCodes.SIGN_IN_CANCELLED:
              console.log("User cancelled the login flow");
              break;
            case statusCodes.IN_PROGRESS:
              console.log("Sign in is in progress already");
              break;
            case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
              console.log("Play services not available or outdated");
              break;
            default:
              console.log("Some other error happened:", error);
          }
        }
     }
  }

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
      <Button onPress={handlePress} title="Press me" />
      <Button onPress={handleGoogleSignin} title="Click gg" />
      <Button onPress={signOutFromGoogle} title="Sign out" />
    </View>
  );
}
