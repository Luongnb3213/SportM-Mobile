// app/(tabs)/account/index.tsx
import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import HeaderUser from '@/components/ui/HeaderUser';
import Button from '@/components/Button';
import { Ionicons, Feather } from '@expo/vector-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar';
import { Card } from '@/components/Card';
import NotificationTester from '@/components/NotificationComponent/NotificationTester';

/* =========================
 * Types & Fake seed data
 * ========================= */
type Noti =
  | {
      id: string;
      type: 'system';
      text: string;
      time: string;
    }
  | {
      id: string;
      type: 'friend_request';
      user: { name: string; avatar?: string };
      text: string;
      time: string;
    };

// tạo ~60 thông báo trộn giữa system & friend_request
const SEED_NOTIFS: Noti[] = Array.from({ length: 60 }).map((_, i) => {
  const isFR = i % 3 === 1;
  if (isFR) {
    return {
      id: `fr${i}`,
      type: 'friend_request' as const,
      user: {
        name: ['Êm Fô', 'Long Vũ', 'Bảo Minh', 'Mi Mi'][i % 4],
        avatar: `https://i.pravatar.cc/100?img=${(i % 70) + 1}`,
      },
      text: 'đã gửi cho bạn 1 lời kết bạn',
      time: 'Hôm nay, lúc 9:36 AM',
    };
  }
  return {
    id: `sys${i}`,
    type: 'system' as const,
    text:
      i % 2 === 0
        ? 'Bạn đã đặt thành công sân Golf Nem Chua. Đừng quên hẹn của mình nhé'
        : 'Thanh toán của bạn đã được xác nhận.',
    time: 'Hôm nay, lúc 9:36 AM',
  };
});

/* =========================
 * Fake API (filter + paginate)
 * ========================= */
function mockFetchNotifs({
  search = '',
  page = 1,
  limit = 10,
  signal,
}: {
  search?: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}): Promise<{ items: Noti[]; hasMore: boolean }> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const q = search.trim().toLowerCase();
      const filtered = q
        ? SEED_NOTIFS.filter((n) => {
            if (n.type === 'system') {
              return (
                n.text.toLowerCase().includes(q) ||
                n.time.toLowerCase().includes(q)
              );
            }
            return (
              n.text.toLowerCase().includes(q) ||
              n.user.name.toLowerCase().includes(q) ||
              n.time.toLowerCase().includes(q)
            );
          })
        : SEED_NOTIFS;

      const start = (page - 1) * limit;
      const end = start + limit;
      const items = filtered.slice(start, end);
      resolve({ items, hasMore: end < filtered.length });
    }, 700);

    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
    });
  });
}

/* =========================
 * Screen
 * ========================= */
export default function Notification() {
  const insets = useSafeAreaInsets();

  // list state
  const [data, setData] = React.useState<Noti[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(false);

  // loading states
  const [loadingInitial, setLoadingInitial] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);

  const LIMIT = 10;
  const ctrlRef = React.useRef<AbortController | null>(null);

  // first load + search change
  React.useEffect(() => {
    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    (async () => {
      try {
        setLoadingInitial(true);
        setPage(1);
        const { items, hasMore } = await mockFetchNotifs({
          page: 1,
          limit: LIMIT,
          signal: ctrl.signal,
        });
        setData(items);
        setHasMore(hasMore);
      } catch (e) {
        // ignore abort
      } finally {
        setLoadingInitial(false);
      }
    })();

    return () => ctrl.abort();
  }, []);

  // load more
  const onLoadMore = React.useCallback(async () => {
    if (loadingMore || !hasMore) return;

    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const { items, hasMore: nextHasMore } = await mockFetchNotifs({
        page: nextPage,
        limit: LIMIT,
        signal: ctrl.signal,
      });

      if (items.length > 0) {
        setData((prev) => [...prev, ...items]);
        setPage(nextPage);
        setHasMore(nextHasMore);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      // ignore abort
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page]);

  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 150 }}
          extraKeyboardSpace={0}
        >
          <View className="bg-white">
            <NotificationTester />
            <View className="bg-background px-4">
              <HeaderUser />
            </View>

            {/* Top bar */}
            <View className="flex-row items-center justify-start px-4 py-3 border-b border-border">
              <TouchableOpacity className="pr-2">
                <Ionicons name="chevron-back" size={20} />
              </TouchableOpacity>

              <View className="flex-row items-center gap-2">
                <Text className="text-base font-semibold text-primary">
                  Thông báo
                </Text>
              </View>

              <View className="w-5" />
            </View>

            <Card
              className="m-4 mx-0 rounded-2xl overflow-hidden bg-background"
              style={{ borderWidth: 0 }}
            >
              {/* loading initial */}
              {loadingInitial ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <View key={i} className="px-4 py-4 border-b border-border">
                    <View className="h-4 w-40 bg-muted rounded mb-2" />
                    <View className="h-3 w-28 bg-muted rounded" />
                  </View>
                ))
              ) : data.length === 0 ? (
                <View className="px-4 py-10 items-center">
                  <Text className="text-muted-foreground">
                    Không có thông báo
                  </Text>
                </View>
              ) : (
                <>
                  {data.map((n, idx) => {
                    const isLast = idx === data.length - 1;

                    if (n.type === 'system') {
                      const highlight = 'sân Golf Nem Chua';
                      const parts = n.text.split(highlight);

                      return (
                        <View
                          key={n.id  + idx }
                          className={[
                            'px-4 py-4 bg-white/0',
                            !isLast && 'border-b border-border',
                          ].join(' ')}
                        >
                          <View className="flex-row items-start gap-2">
                            <View className="mt-1 h-2 w-2 rounded-full bg-[#90CDF4]" />
                            <View className="h-10 w-10" />
                            <View className="flex-1">
                              <Text className="text-[13.5px] leading-5">
                                {parts.length > 1 ? (
                                  <>
                                    {parts[0]}
                                    <Text className="font-semibold text-primary">
                                      {highlight}
                                    </Text>
                                    {parts[1]}
                                  </>
                                ) : (
                                  n.text
                                )}
                              </Text>
                              <Text className="mt-2 text-[12px] text-muted-foreground">
                                {n.time}
                              </Text>
                            </View>
                          </View>
                        </View>
                      );
                    }

                    // friend_request
                    return (
                      <View
                        key={n.id}
                        className={[
                          'px-4 py-4',
                          !isLast && 'border-b border-border',
                        ].join(' ')}
                      >
                        <View className="flex-row gap-3 items-start">
                          <View className="mt-1 h-2 w-2 rounded-full bg-[#90CDF4]" />
                          <Avatar className="h-10 w-10">
                            {n.user.avatar ? (
                              <AvatarImage source={{ uri: n.user.avatar }} />
                            ) : (
                              <AvatarFallback>UF</AvatarFallback>
                            )}
                          </Avatar>

                          <View className="flex-1">
                            <Text className="text-[13.5px] leading-5">
                              <Text className="font-medium">{n.user.name}</Text>{' '}
                              {n.text}
                            </Text>

                            <View className="mt-3 flex-row gap-3">
                              <Button className="px-4 py-1 rounded-md">
                                Chấp nhận
                              </Button>
                              <Button
                                variant="outline"
                                className="px-4 py-2 rounded-md"
                                style={{ borderWidth: 0 }}
                              >
                                Từ chối
                              </Button>
                            </View>

                            <Text className="mt-3 text-[12px] text-muted-foreground">
                              {n.time}
                            </Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}

                  {/* Footer: Xem thêm / Loading */}
                  {hasMore ? (
                    <View className="items-center py-3">
                      {loadingMore ? (
                        <View className="px-3 py-2 flex-row items-center">
                          <ActivityIndicator />
                          <Text className="ml-2">Đang tải...</Text>
                        </View>
                      ) : (
                        <Button
                          variant="ghost"
                          className="px-3 py-2 flex-row items-center"
                          onPress={onLoadMore}
                        >
                          <Text className="mr-1">Xem thêm</Text>
                          <Ionicons name="chevron-down" size={16} />
                        </Button>
                      )}
                    </View>
                  ) : null}
                </>
              )}
            </Card>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardProvider>
  );
}
