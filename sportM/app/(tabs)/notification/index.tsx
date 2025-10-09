// app/(tabs)/notifications/index.tsx
import React, { JSX } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar';
import { Card } from '@/components/Card';
import Button from '@/components/Button';
import NotificationTester from '@/components/NotificationComponent/NotificationTester';
import EmptyState from '@/components/ui/EmptyState';
import HeaderUser from '@/components/ui/HeaderUser';
import { KeyboardAwareScrollView, KeyboardProvider } from 'react-native-keyboard-controller';
import { useAppTheme } from '@/styles/theme';
// If you have a Header component, import it. Otherwise, keep the simple title bar below.
// import HeaderUser from '@/components/ui/HeaderUser'

// ===============
// Types
// ===============
export type NotificationBase = {
  id: string;
  type: string; // value from NotificationType.ts
  createdAt: string; // ISO string
  read?: boolean;
};

// A flexible payload that can carry different data based on type
export type NotificationPayload = NotificationBase & {
  title?: string;
  message?: string;
  actor?: { id: string; name: string; avatar?: string } | null;
  meta?: Record<string, any>;
};

// ===============
// Socket glue (plug-and-play)
// ===============
// Replace the body of subscribeToNotifications with your actual SocketService or socket.ts wiring.
// It returns an unsubscribe function.
function subscribeToNotifications(onEvent: (evt: NotificationPayload) => void) {
  // --- EXAMPLE (pseudo) ---
  // import { SocketService } from '@/services/SocketService'
  // const off = SocketService.onAny((type, payload) => {
  //   const evt: NotificationPayload = { id: payload.id ?? String(Date.now()), type, createdAt: new Date().toISOString(), ...payload };
  //   onEvent(evt);
  // });
  // return off;

  // Fallback mocked listener (for demo): emit a random noti every 10s
  // const timer = setInterval(() => {
  //   const demo = MOCK_STREAM[Math.floor(Math.random() * MOCK_STREAM.length)];
  //   onEvent({ ...demo, id: `${demo.type}-${Date.now()}`, createdAt: new Date().toISOString() });
  // }, 10000);
  // return () => clearInterval(timer);
}

// ===============
// Icons per type
// ===============
const TypeIcon: Record<string, (props: { size?: number }) => JSX.Element> = {
  BOOKING_CONFIRMED: ({ size = 22 }) => <Ionicons name="checkmark-circle" size={size} />,
  BOOKING_CANCELLED: ({ size = 22 }) => <Ionicons name="close-circle" size={size} />,
  PAYMENT_SUCCESS: ({ size = 22 }) => <Feather name="credit-card" size={size} />,
  PAYMENT_FAILED: ({ size = 22 }) => <MaterialCommunityIcons name="credit-card-off" size={size} />,
  MATCH_INVITE: ({ size = 22 }) => <Ionicons name="tennisball" size={size} />,
  FRIEND_REQUEST: ({ size = 22 }) => <Ionicons name="person-add" size={size} />,
  FRIEND_ACCEPTED: ({ size = 22 }) => <Ionicons name="people" size={size} />,
  SYSTEM: ({ size = 22 }) => <Ionicons name="notifications" size={size} />,
  DEFAULT: ({ size = 22 }) => <AntDesign name="bells" size={size} />,
};

function getIcon(type: string) {
  return TypeIcon[type] ?? TypeIcon.DEFAULT;
}

// ===============
// Item renderers (design)
// ===============
function Dot() {
  return <View className="mt-1 h-2 w-2 rounded-full bg-[#90CDF4]" />;
}

function TimeAgo({ iso }: { iso: string }) {
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

function NotificationLine({ n, onAction }: { n: NotificationPayload; onAction?: (id: string, action: string) => void }) {
  const Icon = getIcon(n.type);
  const actorAvatar = n.actor?.avatar;
  const title = n.title ?? humanizeType(n.type);
  const message = n.message ?? '';
  const unread = !n.read;

  const container = ['px-4 py-4', unread ? 'bg-accent/30' : 'bg-white/0'].join(' ');

  // Common CTA patterns per type
  const ctas = getCTAs(n.type);

  return (
    <View className={container}>
      <View className="flex-row gap-3 items-start">
        <Dot />
        <View className="h-10 w-10 items-center justify-center rounded-xl bg-secondary">
          <Icon size={20} />
        </View>

        <View className="flex-1">
          <Text className="text-[13.5px] leading-5">
            {n.actor ? (
              <>
                <Text className="font-medium">{n.actor.name}</Text>
                {message ? ' ' + message : ''}
              </>
            ) : message ? (
              message
            ) : (
              title
            )}
          </Text>

          {ctas.length > 0 ? (
            <View className="mt-3 flex-row gap-3">
              {ctas.map((cta) => (
                <Button
                  key={cta.key}
                  variant={cta.variant}
                  className="px-4 py-1 rounded-md"
                  style={cta.variant === 'outline' ? { borderWidth: 0 } : undefined}
                  onPress={() => onAction?.(n.id, cta.key)}
                >
                  {cta.label}
                </Button>
              ))}
            </View>
          ) : null}

          <View className="mt-2 flex-row items-center gap-2">
            {actorAvatar ? (
              <Avatar className="h-5 w-5">
                <AvatarImage source={{ uri: actorAvatar }} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            ) : null}
            <TimeAgo iso={n.createdAt} />
          </View>
        </View>
      </View>
    </View>
  );
}

function humanizeType(type: string) {
  const map: Record<string, string> = {
    BOOKING_CONFIRMED: 'Đặt sân thành công',
    BOOKING_CANCELLED: 'Hủy đặt sân',
    PAYMENT_SUCCESS: 'Thanh toán thành công',
    PAYMENT_FAILED: 'Thanh toán thất bại',
    MATCH_INVITE: 'Lời mời thi đấu',
    FRIEND_REQUEST: 'Lời mời kết bạn',
    FRIEND_ACCEPTED: 'Đã chấp nhận kết bạn',
    SYSTEM: 'Thông báo hệ thống',
  };
  return map[type] ?? type.replaceAll('_', ' ');
}

function getCTAs(type: string): Array<{ key: string; label?: string; variant?: 'outline' | 'default' | 'destructive' }> {
  switch (type) {
    case 'FRIEND_REQUEST':
      return [
        { key: 'accept', label: 'Chấp nhận' },
        { key: 'decline', label: 'Từ chối', variant: 'outline' },
      ];
    case 'MATCH_INVITE':
      return [
        { key: 'view', label: 'Xem chi tiết' },
        { key: 'dismiss', label: 'Bỏ qua', variant: 'outline' },
      ];
    case 'PAYMENT_FAILED':
      return [];
    case 'BOOKING_CONFIRMED':
      return [{ key: 'view_booking', label: 'Xem đặt sân' }];
    default:
      return [];
  }
}

// ===============
// Mock data (covering many NotificationTypes)
// ===============
export const MOCK_STREAM: NotificationPayload[] = [
  {
    id: '1',
    type: 'BOOKING_CONFIRMED',
    title: 'Đặt sân thành công',
    message: 'đã đặt thành công sân Golf Nem Chua lúc 15:00',
    actor: { id: 'u1', name: 'SportM', avatar: 'https://i.pravatar.cc/100?img=5' },
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'PAYMENT_SUCCESS',
    message: 'Thanh toán #INV-2309 đã được xác nhận',
    actor: { id: 'u2', name: 'Thu ngân' },
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'PAYMENT_FAILED',
    message: 'Thanh toán #INV-2310 thất bại. Vui lòng thử lại.',
    actor: { id: 'u2', name: 'Thu ngân' },
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'FRIEND_REQUEST',
    message: 'đã gửi lời mời kết bạn',
    actor: { id: 'u3', name: 'Long Vũ', avatar: 'https://i.pravatar.cc/100?img=12' },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    type: 'FRIEND_ACCEPTED',
    message: 'đã chấp nhận lời mời kết bạn',
    actor: { id: 'u4', name: 'Bảo Minh', avatar: 'https://i.pravatar.cc/100?img=16' },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    type: 'MATCH_INVITE',
    message: 'mời bạn tham gia trận đấu 7:00 AM - Thứ Bảy',
    actor: { id: 'u5', name: 'Mi Mi', avatar: 'https://i.pravatar.cc/100?img=25' },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    type: 'BOOKING_CANCELLED',
    message: 'đặt sân #BK-9911 đã bị hủy',
    actor: { id: 'u6', name: 'Hệ thống' },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '8',
    type: 'SYSTEM',
    title: 'Chính sách mới',
    message: 'Chúng tôi vừa cập nhật điều khoản dịch vụ.',
    actor: null,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ===============
// Screen
// ===============
export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const t = useAppTheme();
  const [items, setItems] = React.useState<NotificationPayload[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);

  // initial load: use mock
  React.useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setItems(MOCK_STREAM);
      setLoading(false);
    }, 500);
  }, []);

  // live events via socket / service
  React.useEffect(() => {
    const off = subscribeToNotifications((evt) => {
      setItems((prev) => [evt, ...prev]);
    });
    return off;
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // simulate re-fetch
      setItems(MOCK_STREAM);
      setRefreshing(false);
    }, 600);
  }, []);

  const onLoadMore = React.useCallback(() => {
    return;
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      // simulate pagination by duplicating with new ids
      const more = MOCK_STREAM.map((x, i) => ({ ...x, id: x.id + '-p' + i }));
      setItems((s) => [...s, ...more]);
      setLoadingMore(false);
    }, 600);
  }, [loadingMore]);

  const onAction = (id: string, action: string) => {
    // TODO: call APIs for accept/decline/view/etc.
    console.log('action', action, 'on', id);
    // optimistically mark as read / remove if needed
    if (action === 'dismiss' || action === 'decline') {
      setItems((s) => s.filter((x) => x.id !== id));
    }
  };

  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1 mb">
          {/* Top bar */}
          <HeaderUser />
          <View className="flex-row items-center justify-start px-4 py-3 border-b border-border bg-background">
            <TouchableOpacity className="pr-2">
              <Ionicons name="chevron-back" size={20} />
            </TouchableOpacity>
            <View className="flex-row items-center gap-2">
              <Text className="text-base font-semibold text-primary">Thông báo</Text>
            </View>
          </View>

          {/* List */}
          <Card className="m-4 mx-0 rounded-2xl overflow-hidden bg-background" style={{ borderWidth: 0 }}>
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
                keyExtractor={(it) => it.id + Date.now().toString()}
                renderItem={({ item }) => (
                  <NotificationLine n={item} onAction={onAction} />
                )}
                ItemSeparatorComponent={() => <View className="border-b border-border" />}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                onEndReachedThreshold={0.3}
                onEndReached={onLoadMore}
                ListFooterComponent={
                  loadingMore ? (
                    <View className="items-center py-3">
                      <View className="px-3 py-2 flex-row items-center">
                        <ActivityIndicator />
                        <Text className="ml-2">Đang tải...</Text>
                      </View>
                    </View>
                  ) : null
                }
              />
            )}
          </Card>
      </SafeAreaView>
    </KeyboardProvider>
  );
}
