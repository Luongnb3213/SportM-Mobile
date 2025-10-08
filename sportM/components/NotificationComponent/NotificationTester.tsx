import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function NotificationTester() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>([]);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => token && setExpoPushToken(token));

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then(value => setChannels(value ?? []));
    }
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <Text>{`Channels: ${JSON.stringify(
        channels.map(c => c.id),
        null,
        2
      )}`}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
    </View>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here', test: { test1: 'more data' } },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
    },
  });
}

async function registerForPushNotificationsAsync() {
  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('myNotificationChannel', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') throw new Error('Permission not granted');

    // Log FCM token để chẩn đoán
    try {
      const deviceToken = await Notifications.getDevicePushTokenAsync();
      console.log('Device push token (FCM/APNs):', deviceToken?.data);
    } catch (e) {
      console.log('Device push token error:', e);
    }

    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    console.log('Project ID:', projectId);

    const expoToken = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    return expoToken;
  } catch (e: any) {
    console.log('Expo push token error:', e?.message ?? String(e));
    return undefined; // Cho phép app tiếp tục (dùng local notifications)
  }
}

