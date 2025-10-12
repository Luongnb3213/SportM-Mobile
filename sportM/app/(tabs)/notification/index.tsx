// app/(tabs)/notifications/index.tsx
import React, { JSX } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Ionicons,
  Feather,
  MaterialCommunityIcons,
  AntDesign,
} from '@expo/vector-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar';
import { Card } from '@/components/Card';
import Button from '@/components/Button';
import EmptyState from '@/components/ui/EmptyState';
import HeaderUser from '@/components/ui/HeaderUser';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useAppTheme } from '@/styles/theme';

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

// =======================
// Icon mapping
// =======================
const TypeIcon: Record<
  NotificationType | 'DEFAULT',
  (props: { size?: number }) => JSX.Element
> = {
  [NotificationType.BOOKING_SUCCESS]: ({ size = 22 }) => (
    <Ionicons name="checkmark-done-circle" size={size} color="#16a34a" />
  ),
  [NotificationType.INVITED_TO_BOOKING]: ({ size = 22 }) => (
    <Ionicons name="person-add" size={size} color="#2563eb" />
  ),
  [NotificationType.NEW_BOOKING_FOR_OWNER]: ({ size = 22 }) => (
    <Feather name="calendar" size={size} color="#9333ea" />
  ),
  [NotificationType.FRIEND_REQUEST]: ({ size = 22 }) => (
    <Ionicons name="person-add-outline" size={size} color="#2563eb" />
  ),
  [NotificationType.FRIEND_ACCEPTED]: ({ size = 22 }) => (
    <Ionicons name="people-circle-outline" size={size} color="#22c55e" />
  ),
  [NotificationType.BOOKING_REMINDER]: ({ size = 22 }) => (
    <Ionicons name="alarm-outline" size={size} color="#f59e0b" />
  ),
  DEFAULT: ({ size = 22 }) => (
    <AntDesign name="bells" size={size} color="#6b7280" />
  ),
};

function getIcon(type: NotificationType) {
  return TypeIcon[type] ?? TypeIcon.DEFAULT;
}

function humanizeType(type: NotificationType) {
  const map: Record<NotificationType, string> = {
    [NotificationType.BOOKING_SUCCESS]: 'Đặt sân thành công',
    [NotificationType.INVITED_TO_BOOKING]: 'Lời mời đặt sân',
    [NotificationType.NEW_BOOKING_FOR_OWNER]: 'Đặt sân mới cho chủ sân',
    [NotificationType.FRIEND_REQUEST]: 'Lời mời kết bạn',
    [NotificationType.FRIEND_ACCEPTED]: 'Đã chấp nhận lời mời kết bạn',
    [NotificationType.BOOKING_REMINDER]: 'Nhắc nhở đặt sân',
  };
  return map[type];
}

function getCTAs(
  type: NotificationType
): Array<{
  key: string;
  label?: string;
  variant?: 'outline' | 'default' | 'destructive';
}> {
  switch (type) {
    case NotificationType.FRIEND_REQUEST:
      return [
        { key: 'accept', label: 'Chấp nhận' },
        { key: 'decline', label: 'Từ chối', variant: 'outline' },
      ];
    case NotificationType.INVITED_TO_BOOKING:
      return [
        { key: 'join', label: 'Tham gia' },
        { key: 'dismiss', label: 'Bỏ qua', variant: 'outline' },
      ];
    case NotificationType.BOOKING_SUCCESS:
      return [{ key: 'view', label: 'Xem chi tiết' }];
    default:
      return [];
  }
}

// =======================
// Mock Data
// =======================
const BASE_MOCK: NotificationPayload[] = [
  {
    id: '1',
    type: NotificationType.BOOKING_SUCCESS,
    message: 'Bạn đã đặt thành công sân Golf Trung Hòa vào lúc 15:00.',
    actor: { id: 'u1', name: 'Hệ thống' },
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: NotificationType.INVITED_TO_BOOKING,
    message: 'đã mời bạn tham gia buổi đặt sân lúc 8:00 AM.',
    actor: {
      id: 'u2',
      name: 'Minh Anh',
      avatar: 'https://i.pravatar.cc/100?img=12',
    },
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: NotificationType.NEW_BOOKING_FOR_OWNER,
    message: 'Người dùng Huy Phạm vừa đặt sân #A23 vào 10:00 AM.',
    actor: { id: 'u3', name: 'SportM System' },
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: NotificationType.FRIEND_REQUEST,
    message: 'đã gửi lời mời kết bạn.',
    actor: {
      id: 'u4',
      name: 'Hà Linh',
      avatar: 'https://i.pravatar.cc/100?img=25',
      friendRequestId: '1212412125125'
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    type: NotificationType.FRIEND_ACCEPTED,
    message: 'đã chấp nhận lời mời kết bạn của bạn.',
    actor: {
      id: 'u5',
      name: 'Long Vũ',
      avatar: 'https://i.pravatar.cc/100?img=14',
    },
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    type: NotificationType.BOOKING_REMINDER,
    message: 'Bạn có lịch đặt sân Golf Trung Hòa lúc 9:00 sáng mai.',
    actor: { id: 'u1', name: 'SportM' },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
];

// tạo thêm data giả (pagination)
function generateMore(page: number): NotificationPayload[] {
  return BASE_MOCK.map((x, i) => ({
    ...x,
    id: `${x.id}-p${page}-${i}`,
    createdAt: new Date(Date.now() - (page * 2 + i) * 60 * 1000).toISOString(),
  }));
}

// =======================
// Components
// =======================


export function TimeAgo({ iso }: { iso: string }) {
  const d = new Date(iso);
  const diff = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000));
  let text = `${diff} giây trước`;
  if (diff > 59) {
    const m = Math.floor(diff / 60);
    text = `${m} phút trước`;
    if (m > 59) {
      const h = Math.floor(m / 60);
      text = `${h} giờ trước`;
      if (h > 24) {
        const day = Math.floor(h / 24);
        text = `${day} ngày trước`;
      }
    }
  }
  return <Text className="text-[12px] text-muted-foreground">{text}</Text>;
}

function NotificationLine({
  n,
  onAction,
}: {
  n: NotificationPayload;
  onAction?: (id: string, action: string) => void;
}) {
  const Icon = getIcon(n.type);
  const title = humanizeType(n.type);
  const unread = !n.read;
  const container = ['px-4 py-4', unread ? 'bg-accent/30' : 'bg-white/0'].join(
    ' '
  );
  const ctas = getCTAs(n.type);

  return (
    <View className={container}>
      <View className="flex-row gap-3 items-start">
        <View className="mt-1 h-2 w-2 rounded-full bg-[#90CDF4]" />
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-secondary">
          <Icon size={20} />
        </View>
        <View className="flex-1">
          <Text className="text-[13.5px] leading-5">
            {n.actor ? (
              <>
                <Text className="font-medium">{n.actor.name}</Text> {n.message}
              </>
            ) : (
              title
            )}
          </Text>
          {ctas.length > 0 && (
            <View className="mt-3 flex-row gap-3">
              {ctas.map((cta) => (
                <Button
                  key={cta.key}
                  variant={cta.variant}
                  className="px-4 py-1 rounded-md"
                  onPress={() => onAction?.(n.id, cta.key)}
                >
                  {cta.label}
                </Button>
              ))}
            </View>
          )}
          <View className="mt-2 flex-row items-center gap-2">
            {n.actor?.avatar && (
              <Avatar className="h-5 w-5">
                <AvatarImage source={{ uri: n.actor.avatar }} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}
            <TimeAgo iso={n.createdAt} />
          </View>
        </View>
      </View>
    </View>
  );
}

// =======================
// Main Screen
// =======================
export default function NotificationsScreen() {
  const [items, setItems] = React.useState<NotificationPayload[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [page, setPage] = React.useState(1);

  // initial load
  React.useEffect(() => {
    setTimeout(() => {
      setItems(BASE_MOCK);
      setLoading(false);
    }, 600);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    setPage(1);
    setTimeout(() => {
      setItems(BASE_MOCK);
      setRefreshing(false);
    }, 800);
  };

  const onLoadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const more = generateMore(nextPage);
      if (nextPage > 3) {
        // hết data sau 3 page
        setHasMore(false);
      }
      setItems((prev) => [...prev, ...more]);
      setPage(nextPage);
      setLoadingMore(false);
    }, 800);
  };

  const onAction = (id: string, action: string) => {
    if (action === 'decline' || action === 'dismiss') {
      setItems((s) => s.filter((x) => x.id !== id));
    }
  };

  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1">
        <HeaderUser />
        <View className="flex-row items-center justify-start px-4 py-3 border-b border-border bg-background">
          <TouchableOpacity className="pr-2">
            <Ionicons name="chevron-back" size={20} />
          </TouchableOpacity>
          <Text className="text-base font-semibold text-primary">Thông báo</Text>
        </View>

        <Card
          className="m-4 mx-0 rounded-2xl overflow-hidden bg-background"
          style={{ borderWidth: 0, marginBottom: 50 }}
        >
          {loading ? (
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
                    <NotificationLine n={item} onAction={onAction} />
                  )}
                  ItemSeparatorComponent={() => (
                    <View className="border-b border-border" />
                  )}
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                  contentContainerStyle={{ paddingBottom: 200 }}
                  onEndReachedThreshold={0.3}
                  onEndReached={onLoadMore}
                  ListFooterComponent={
                <View className="items-center py-4">
                  {loadingMore ? (
                    <View className="flex-row items-center">
                      <ActivityIndicator />
                      <Text className="ml-2">Đang tải thêm...</Text>
                    </View>
                  ) : !hasMore ? (
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
    </KeyboardProvider>
  );
}
