import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function WebviewScreen() {
  const { url, title } = useLocalSearchParams<{ url?: string; title?: string }>();
  const safeUrl = typeof url === 'string' ? decodeURIComponent(url) : 'https://sportm-policy.web.app/';
  const tabBarHeight = typeof useBottomTabBarHeight === 'function' ? useBottomTabBarHeight() : 0;
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-3 py-3 border-b border-[#eee]">
        <TouchableOpacity onPress={() => router.back()} className="p-2 -ml-2 mr-1">
          <Ionicons name="chevron-back" size={22} />
        </TouchableOpacity>
        <Text className="text-[16px] font-semibold" numberOfLines={1}>
          {title ?? 'Điều khoản & Chính sách'}
        </Text>
      </View>

      <View style={{ flex: 1, paddingBottom: tabBarHeight + insets?.bottom }}>
        <WebView
          style={{ flex: 1 }}
          source={{ uri: safeUrl }}
          startInLoadingState
          allowsBackForwardNavigationGestures
          setSupportMultipleWindows={false}
          onShouldStartLoadWithRequest={() => true}
        />
      </View>
    </SafeAreaView>
  );
}
