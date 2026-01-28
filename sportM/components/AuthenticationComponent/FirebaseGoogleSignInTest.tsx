import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import {
  GoogleSignin,
  isSuccessResponse,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { auth } from '@/firebaseConfig';
import { signInWithCredential, GoogleAuthProvider, signOut as firebaseSignOut } from 'firebase/auth';

GoogleSignin.configure({
  webClientId: '541367103107-65bmjade8oc66jc67hs9fh5vdk4d1cgf.apps.googleusercontent.com',
  profileImageSize: 120,
  iosClientId: '541367103107-cv9gqeavsmtslnuk3j35p9ecjca8g733.apps.googleusercontent.com',
});

export default function FirebaseGoogleSignInTest() {
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>(['Ready to test Firebase Google Sign-In']);

  const addLog = (message: string) => {
    setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleFirebaseGoogleSignIn = async () => {
    setLoading(true);
    addLog('Starting Google Sign-In flow...');

    try {
      await GoogleSignin.signOut();
      addLog('✓ Cleared previous Google session');

      await GoogleSignin.hasPlayServices();
      addLog('✓ Google Play Services available');

      const response = await GoogleSignin.signIn();
      addLog('✓ Google Sign-In successful');

      if (!isSuccessResponse(response)) {
        throw new Error('Google Sign-In response not successful');
      }

      const { idToken, user } = response.data;
      addLog(`✓ Got idToken for: ${user.email}`);

      const googleCredential = GoogleAuthProvider.credential(idToken);
      addLog('✓ Created Firebase Google credential');

      const userCredential = await signInWithCredential(auth, googleCredential);
      addLog('✓ Firebase authentication successful!');

      const firebaseUser = userCredential.user;
      setFirebaseUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified,
      });

      addLog(`✓ Firebase UID: ${firebaseUser.uid}`);
      addLog(`✓ Email: ${firebaseUser.email}`);

      Alert.alert(
        '🎉 Success!',
        `Firebase Authentication thành công!\n\nEmail: ${firebaseUser.email}\nUID: ${firebaseUser.uid}`,
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      addLog(`✗ Error: ${error.message || error}`);

      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            addLog('User cancelled sign-in');
            break;
          case statusCodes.IN_PROGRESS:
            addLog('Sign-in already in progress');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            addLog('Play Services not available');
            break;
          default:
            addLog(`Google Sign-In error: ${error.code}`);
        }
      } else {
        addLog(`Firebase error: ${error.code || error.message}`);
      }

      Alert.alert('Error', error.message || 'Sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      addLog('Signing out...');
      await firebaseSignOut(auth);
      await GoogleSignin.signOut();
      setFirebaseUser(null);
      addLog('✓ Signed out successfully');
      Alert.alert('Success', 'Đã đăng xuất');
    } catch (error: any) {
      addLog(`✗ Sign out error: ${error.message}`);
      Alert.alert('Error', error.message);
    }
  };

  const clearLog = () => {
    setLog(['Log cleared']);
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <View className="mb-6">
        <Text className="text-2xl font-bold mb-2">Firebase Google Sign-In Test</Text>
        <Text className="text-gray-600">
          Test Firebase Authentication với Google Sign-In provider
        </Text>
      </View>

      {firebaseUser && (
        <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <Text className="font-bold text-green-800 mb-2">🎉 Firebase User</Text>
          <Text className="text-sm">UID: {firebaseUser.uid}</Text>
          <Text className="text-sm">Email: {firebaseUser.email}</Text>
          <Text className="text-sm">Name: {firebaseUser.displayName}</Text>
          <Text className="text-sm">Verified: {firebaseUser.emailVerified ? 'Yes' : 'No'}</Text>
        </View>
      )}

      <TouchableOpacity
        className="bg-[#1F2257] rounded-xl p-4 flex-row items-center justify-center mb-3"
        onPress={handleFirebaseGoogleSignIn}
        disabled={loading}
        activeOpacity={0.8}
      >
        <AntDesign name="google" size={20} color="#fff" />
        <Text className="text-white font-semibold ml-3">
          {loading ? 'Đang đăng nhập...' : 'Test Firebase Google Sign-In'}
        </Text>
      </TouchableOpacity>

      {firebaseUser && (
        <TouchableOpacity
          className="bg-red-500 rounded-xl p-4 mb-3"
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-center">Sign Out</Text>
        </TouchableOpacity>
      )}

      <View className="border border-gray-300 rounded-lg p-3 bg-gray-50 mb-20">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="font-semibold">Log:</Text>
          <TouchableOpacity onPress={clearLog}>
            <Text className="text-blue-600 text-sm">Clear</Text>
          </TouchableOpacity>
        </View>
        {log.map((entry, idx) => (
          <Text key={idx} className="text-xs font-mono text-gray-700 mb-1">
            {entry}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}
