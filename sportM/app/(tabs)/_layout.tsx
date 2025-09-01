import React from "react";
import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#4D8A43",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingBottom: 20,
          paddingTop: 10,
          borderTopWidth: 0,
          elevation: 12,
        },
        tabBarActiveTintColor: "#4D8A43",
        tabBarInactiveTintColor: "#ffffff",
      }}
    >
      {[
        { name: "home", icon: "home" as const },
        { name: "search", icon: "search" as const },
        { name: "account", icon: "user" as const },
      ].map((t) => (
        <Tabs.Screen
          key={t.name}
          name={t.name}
          options={{
            tabBarIcon: ({ focused, color, size }) =>
              focused ? (
                <View className="w-10 h-10 rounded-full bg-white items-center justify-center">
                  <Feather name={t.icon} size={size ?? 22} color="#4D8A43" />
                </View>
              ) : (
                <Feather name={t.icon} size={size ?? 22} color="white" />
              ),
          }}
        />
      ))}
    </Tabs>
  );
}
