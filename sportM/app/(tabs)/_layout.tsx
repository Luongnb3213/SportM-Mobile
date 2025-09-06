"use client"

import { Tabs } from "expo-router"
import TabBar from "../../components/TabBarComponent/TabBar"

export default function TabsLayout() {
  const tabs = [
    { name: "home", label: "Trang chủ" },
    { name: "search", label: "Thêm bạn" },
    { name: "map", label: "Bản đồ" },
    { name: "account", label: "Tài khoản" },
  ]

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        headerShown: false
      }}
      tabBar={props => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ href: null }} />
      {tabs.map((t) => (
        <Tabs.Screen key={t.name} name={t.name} options={{}} />
      ))}
    </Tabs>
  )
}
