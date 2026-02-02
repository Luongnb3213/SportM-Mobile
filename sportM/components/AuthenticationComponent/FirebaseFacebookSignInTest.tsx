import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AccessToken, LoginManager, Settings } from 'react-native-fbsdk-next';
import { useAxios } from '@/lib/api';
import { saveTokens } from '@/lib/tokenStorage';
import { decodeJwt } from '@/lib/jwt';
import { useAuth } from '@/providers/AuthProvider';
import { router } from 'expo-router';

export default function FirebaseFacebookSignInTest() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>(['Ready to test Facebook Sign-In']);
  const auth = useAuth();

  useEffect(() => {
    // Initialize Facebook SDK
    Settings.setAppID('1854307095290666');
    Settings.initializeSDK();
    addLog('✓ Facebook SDK initialized');
  }, []);

  const addLog = (message: string) => {
    setLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const handleFirebaseFacebookSignIn = async () => {
    setLoading(true);
    addLog('Starting Facebook Sign-In flow...');

    try {
      // Logout first to clear any previous session
      LoginManager.logOut();
      addLog('✓ Cleared previous Facebook session');

      // Perform Facebook login
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      addLog('✓ Facebook login prompt shown');

      if (result.isCancelled) {
        addLog('✗ User cancelled Facebook login');
        Alert.alert('Cancelled', 'Login was cancelled');
        setLoading(false);
        return;
      }

      addLog('✓ Facebook login successful');

      // Get the access token
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw new Error('Could not get Facebook access token');
      }

      addLog(`✓ Got Facebook access token`);
      addLog(`✓ Granted permissions: ${data.permissions?.join(', ') || 'None'}`);

      // Fetch user info from Facebook Graph API
      const response = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${data.accessToken}`
      );
      const fbUserData = await response.json();
      const fbEmail = fbUserData.email || null;
      const fbName = fbUserData.name || null;

      addLog(`✓ Facebook user: ${fbName}`);
      addLog(`✓ Facebook email: ${fbEmail || 'Not provided'}`);

      if (!fbEmail) {
        throw new Error('Email not provided by Facebook');
      }

      // Call backend social-login API
      const { data: res } = await useAxios.post('/auth/social-login', {
        email: fbEmail,
        fullName: fbName,
      });

      const { access } = res.data;
      addLog('✓ Backend authentication successful!');

      // Decode JWT and set user
      const payload = decodeJwt(access);
      auth.setUser(payload);
      await saveTokens('accessToken', access);

      setUser({
        email: fbEmail,
        name: fbName,
        role: payload?.role,
      });

      addLog(`✓ User role: ${payload?.role}`);
      addLog(`✓ Email: ${fbEmail}`);

      Alert.alert(
        '🎉 Success!',
        `Facebook Authentication thành công!\n\nEmail: ${fbEmail}\nRole: ${payload?.role}`,
        [{ text: 'OK' }]
      );

      // Navigate based on role
      if (payload?.role === 'CLIENT') {
        router.replace('/home');
      } else {
        router.replace('/owner');
      }
    } catch (error: any) {
      addLog(`✗ Error: ${error.message || error}`);
      console.error('Facebook Sign-In Error:', error);

      let errorMessage = 'Sign-in failed';
      if (error.code) {
        errorMessage = `Error code: ${error.code}\n${error.message}`;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      addLog('Signing out...');
      LoginManager.logOut();
      setUser(null);
      auth.setUser(null);
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
        <Text className="text-2xl font-bold mb-2">Facebook Sign-In Test</Text>
        <Text className="text-gray-600">
          Dùng react-native-fbsdk-next + Backend Social Login
        </Text>
      </View>

      {user && (
        <View className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <Text className="font-bold text-green-800 mb-2">🎉 Logged In</Text>
          <Text className="text-sm">Email: {user.email || 'N/A'}</Text>
          <Text className="text-sm">Name: {user.name || 'N/A'}</Text>
          <Text className="text-sm">Role: {user.role || 'N/A'}</Text>
        </View>
      )}

      <TouchableOpacity
        className="bg-[#1877F2] rounded-xl p-4 flex-row items-center justify-center mb-3"
        onPress={handleFirebaseFacebookSignIn}
        disabled={loading}
        activeOpacity={0.8}
      >
        <AntDesign name="facebook-square" size={20} color="#fff" />
        <Text className="text-white font-semibold ml-3">
          {loading ? 'Đang đăng nhập...' : 'Test Facebook Sign-In'}
        </Text>
      </TouchableOpacity>

      {user && (
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
