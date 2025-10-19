'use client';

import { Tabs, useSegments } from 'expo-router';
import TabBar from '../../components/TabBarComponent/TabBar';
import { Text, View } from 'react-native';
import { useEffect } from 'react';
import { socket } from '@/lib/socket';

export default function TabsLayout() {
  const tabs = [
    { name: 'home', label: 'Trang chủ' },
    { name: 'map', label: 'Bản đồ' },
    { name: 'addAccount', label: 'Thêm bạn' },
    { name: 'notification', label: 'Thông báo' },
    { name: 'settingsAccount', label: 'Tài khoản' },
  ];

  useEffect(() => {
    (async () => {
      await socket.connect();

      const onConnect = () => console.log('✅ connected', socket.socket?.id);
      const onDisconnect = (r: any) => console.log('🔌 disconnected', r);

      socket.on('connect', onConnect);
      socket.on('disconnect', onDisconnect);
    })();
  }, [])


  return (
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
  );
}
