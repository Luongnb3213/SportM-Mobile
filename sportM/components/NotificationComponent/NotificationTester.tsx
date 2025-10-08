// NotificationTester.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Button, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export default function NotificationTester() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token ?? null));

    const notificationListener = Notifications.addNotificationReceivedListener(n => {
      setNotification(n);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(r => {
      console.log("User interacted:", r);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  async function sendTestNotification() {
    if (!expoPushToken) {
      alert("Chưa có token, thử lại sau.");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "📣 Test Notification",
        body: "Đây là thông báo test từ Expo Notifications!",
        data: { test: true },
      },
      trigger: null, // gửi ngay lập tức
    });
  }

  return (
    <View className="justify-center items-center p-6">
      <Text className="text-lg font-bold mb-4">Expo Notification Tester</Text>

      <Button title="Gửi thông báo test" onPress={sendTestNotification} />

      {expoPushToken && (
        <View className="mt-4">
          <Text>Expo Push Token:</Text>
          <Text selectable className="text-xs text-gray-600 mt-1">
            {expoPushToken}
          </Text>
        </View>
      )}

      {notification && (
        <View className="mt-4 p-3 border rounded-md w-72">
          <Text className="font-semibold">Thông báo nhận được:</Text>
          <Text>{notification.request.content.title}</Text>
          <Text>{notification.request.content.body}</Text>
        </View>
      )}
    </View>
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      alert("Không được cấp quyền nhận thông báo!");
      return;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo push token:", token);
  } else {
    alert("Phải chạy trên thiết bị thật (không phải simulator)");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}
