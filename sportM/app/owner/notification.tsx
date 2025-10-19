// app/(tabs)/notifications/index.tsx
import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  // StyleSheet, // No longer needed for common styles
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Ionicons,
} from '@expo/vector-icons';
import { Card } from '@/components/Card';
import EmptyState from '@/components/ui/EmptyState';
import HeaderUser from '@/components/ui/HeaderUser';
import { socket } from '@/lib/socket';
import { useNotificationStatus } from '@/providers/NotificationContext';
import { NotificationLine } from '@/components/NotificationComponent/NotificationLine';
import { useAxios } from '@/lib/api';
import { router } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
// Import your useAxios instance here
// import useAxios from '@/lib/useAxios'; // Adjust the path as needed

// =======================
// Notification Types
// =======================
export enum NotificationType {
  BOOKING_SUCCESS = 'BOOKING_SUCCESS',
  INVITED_TO_BOOKING = 'INVITED_TO_BOOKING',
  NEW_BOOKING_FOR_OWNER = 'NEW_BOOKING_FOR_OWNER',
  FRIEND_REQUEST = 'FRIEND_REQUEST',
  FRIEND_ACCEPTED = 'FRIEND_ACCEPTED',
  BOOKING_REMINDER = 'BOOKING_REMINDER',
}

// =======================
// Types
// =======================
export type NotificationBase = {
  id: string;
  type: NotificationType;
  createdAt: string;
  read?: boolean;
};

export type NotificationPayload = NotificationBase & {
  title?: string;
  message?: string;
  actor?: { id: string; name: string; avatar?: string, friendRequestId?: string } | null;
  meta?: Record<string, any>;
};


const NOTIFICATION_LIMIT = 8; // Define a constant for limit

export default function NotificationsScreen() {
  const [items, setItems] = React.useState<NotificationPayload[]>([]);
  const [loadingInitial, setLoadingInitial] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [page, setPage] = React.useState(1);
  const { user } = useAuth();

  const { setHasUnreadNotifications } = useNotificationStatus();

  const updateUnreadStatus = React.useCallback((currentItems: NotificationPayload[]) => {
    const hasUnread = currentItems?.some(n => !n.read);
    setHasUnreadNotifications(hasUnread);
  }, [setHasUnreadNotifications]); // Depend on setHasUnreadNotifications from context

  useEffect(() => {
    if (!user) {
      router.replace('/authentication')
    }
  }, [])
  const fetchNotifications = React.useCallback(async (pageNum: number, isRefreshing = false) => {
    const ctrl = new AbortController();
    try {
      if (isRefreshing) {
        setRefreshing(true);
        setPage(1); // Reset page on refresh
      } else {
        setLoadingMore(true);
      }
      // --- useAxios API call: GET /notification?page=${pageNum}&limit=${NOTIFICATION_LIMIT} ---

      const { data } = await useAxios.get(`/notification?page=${pageNum}&limit=${NOTIFICATION_LIMIT}`, { signal: ctrl.signal });
      let newNotifications = data.data?.data || []; // Assuming data structure

      if (pageNum === 1) {
        setItems(newNotifications);
      } else {
        setItems((prev) => [...prev, ...newNotifications]);
      }
      setHasMore(newNotifications.length === NOTIFICATION_LIMIT);
      setPage(pageNum);
      // Correctly pass items for updateUnreadStatus
      updateUnreadStatus(pageNum === 1 ? newNotifications : [...items, ...newNotifications]);

    } catch (e: any) {
      if (e.name === 'AbortError') {
        console.log("Fetch notifications aborted.");
      } else {
        console.log("Failed to fetch notifications:", e);
      }
      setHasMore(false);
    } finally {
      if (isRefreshing) {
        setRefreshing(false);
      } else {
        setLoadingMore(false);
      }
      setLoadingInitial(false);
    }
    return ctrl;
  }, [items, updateUnreadStatus]); // Add 'items' as dependency for updateUnreadStatus to work correctly

  // Initial load
  React.useEffect(() => {
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoadingInitial(true);
        setPage(1);
        // --- useAxios API call: GET /notification?page=1&limit=${NOTIFICATION_LIMIT} ---
        const { data } = await useAxios.get(`/notification?page=1&limit=${NOTIFICATION_LIMIT}`, { signal: ctrl.signal });
        const initialNotifications = data.data?.data || [];
        setItems(initialNotifications);
        setHasMore(initialNotifications.length === NOTIFICATION_LIMIT);
        updateUnreadStatus(initialNotifications);
      } catch (e: any) {
        if (e.name === 'AbortError') {
          console.log("Initial fetch notifications aborted.");
        } else {
          console.log("Initial fetch notifications failed:", e);
        }
      } finally {
        setLoadingInitial(false);
      }
    })();

    return () => ctrl.abort();
  }, []); // Add fetchNotifications as dependency

  // WebSocket listeners for real-time notifications
  React.useEffect(() => {
    if (!socket.socket) {
      console.warn("Socket not initialized. Real-time notifications will not work.");
      return;
    }

    const handleNewNotification = (notification: NotificationPayload) => {
      setItems((prev) => {
        const newNotificationWithId = {
          ...notification,
          read: false,
          id: `${notification.id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
        };
        const newItems = [newNotificationWithId, ...prev];
        updateUnreadStatus(newItems);
        return newItems;
      });
    };

    Object.values(NotificationType).forEach((type) => {
      socket.on(type, handleNewNotification);
      console.log(`Listening for socket event: ${type}`);
    });

    return () => {
      Object.values(NotificationType).forEach((type) => {
        socket.off(type, handleNewNotification);
        console.log(`Stopped listening for socket event: ${type}`);
      });
    };
  }, [socket.socket, updateUnreadStatus]);

  const onRefresh = React.useCallback(() => {
    setLoadingMore(false);
    setHasMore(true);
    setPage(1);
    fetchNotifications(1, true);
  }, [fetchNotifications]);

  const onLoadMore = React.useCallback(() => {
    if (loadingMore || !hasMore || loadingInitial || refreshing) return;
    fetchNotifications(page + 1);
  }, [loadingMore, hasMore, loadingInitial, refreshing, page, fetchNotifications]);

  const onAction = React.useCallback((cta: any, action: string) => {
    if (action === 'decline' || action === 'dismiss') {
      setItems((s) => {
        const newItems = s.filter((x) => x.id !== cta?.id);
        updateUnreadStatus(newItems);
        return newItems;
      });
      return;
    }
    router.push('/home/booking')
  }, [updateUnreadStatus]);

  const onMarkAsRead = React.useCallback((id: string) => {
    setItems((prev) => {
      const updatedItems = prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      updateUnreadStatus(updatedItems);
      return updatedItems;
    });
    // --- useAxios API call: POST /notification/${id}/read ---
    // useAxios.post(`/notification/${id}/read`).catch(console.error);
  }, [updateUnreadStatus]);

  return (
      <SafeAreaView className="flex-1">
        <View className='px-4'>
          <HeaderUser />
          <View className="flex-row items-center justify-start px-4 py-3 border-b border-border bg-white">
            <TouchableOpacity onPress={() => router.back()} className="pr-2">
              <Ionicons name="chevron-back" size={20} />
            </TouchableOpacity>
            <Text className="text-base font-semibold text-primary">Thông báo</Text>
          </View>
        </View>

        <Card
          className="m-4 mx-0 rounded-2xl overflow-hidden bg-background"
          style={{ borderWidth: 0, marginBottom: 50 }} // keep inline style for specific overrides
        >
          {loadingInitial ? (
            Array.from({ length: 6 }).map((_, i) => (
              <View key={i} className="px-4 py-4 border-b border-border">
                <View className="h-4 w-40 bg-muted rounded mb-2" />
                <View className="h-3 w-28 bg-muted rounded" />
              </View>
            ))
          ) : items.length === 0 ? (
            <View className="px-4 py-10 items-center">
              <EmptyState
                icon="golf-outline"
                title="Chưa có thông báo nào"
                description="Hiện chưa có thông báo nào."
              />
              </View>
            ) : (
                <FlatList
                  data={items}
                  keyExtractor={(it) => it.id}
                  renderItem={({ item }) => (
                    <NotificationLine n={item} onAction={onAction} onMarkAsRead={onMarkAsRead} />
                  )}
                  ItemSeparatorComponent={() => (
                    <View className="border-b border-border" />
                  )}
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                  contentContainerStyle={{ paddingBottom: 200 }}
                  onEndReachedThreshold={0.9}
                  onEndReached={onLoadMore}
                  ListFooterComponent={
                    <View className="items-center py-4">
                      {loadingMore ? (
                        <View className="flex-row items-center">
                          <ActivityIndicator />
                          <Text className="ml-2">Đang tải thêm...</Text>
                        </View>
                      ) : !hasMore && items.length > 0 ? (
                        <Text className="text-muted-foreground text-sm">
                          Đã hiển thị tất cả thông báo
                        </Text>
                      ) : null}
                    </View>
              }
            />
          )}
        </Card>
    </SafeAreaView>
  );
}