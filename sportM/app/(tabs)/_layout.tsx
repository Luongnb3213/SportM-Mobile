'use client';

import { Tabs, useSegments } from 'expo-router';
import TabBar from '../../components/TabBarComponent/TabBar';
import { Text, View } from 'react-native';

export default function TabsLayout() {
  const tabs = [
    { name: 'home', label: 'Trang chủ' },
    { name: 'map', label: 'Bản đồ' },
    { name: 'addAccount', label: 'Thêm bạn' },
    { name: 'notification', label: 'Thông báo' },
    { name: 'settingsAccount', label: 'Tài khoản' },
  ];

  // segments ví dụ: ['(tabs)', 'home']
  const segments = useSegments();
  const activeScreen = segments[segments.length - 1] ?? '';

  // đặt danh sách màn hình muốn ẨN banner
  const HIDE_ON = new Set(['addAccount', 'settingsAccount']); // ví dụ
  const showBanner = !HIDE_ON.has(activeScreen);

  return (
    <View style={{ flex: 1 }}>
      {showBanner && (
        <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
          <Text>eheh</Text>
        </View>
      )}

      <Tabs
        initialRouteName="home"
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tabs.Screen name="index" options={{ href: null }} />
        {tabs.map((t) => (
          <Tabs.Screen key={t.name} name={t.name} options={{}} />
        ))}
      </Tabs>
    </View>
  );
}
