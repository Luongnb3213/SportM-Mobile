// InviteFriendsSheet.tsx
import React from 'react';
import { View, Text, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/Avatar';
import Button from '@/components/Button';
import BottomSheet from '@/components/TabBarComponent/BottomSheet';
import { Feather } from '@expo/vector-icons';
import EmptyState from '@/components/ui/EmptyState';

type Friend = { id: string; name: string; avatar?: string };

/* ===== Mock data + API ===== */
const FAKE_FRIENDS: Friend[] = Array.from({ length: 60 }).map((_, i) => ({
  id: String(i + 1),
  name: `Lại Gia Tùng ${i + 1}`,
  avatar: i % 3 === 0 ? `https://i.pravatar.cc/150?img=${(i % 70) + 1}` : undefined,
}));

function mockFetchFriends({
  search = '',
  page = 1,
  limit = 10,
}: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: Friend[]; hasMore: boolean }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const q = search.trim().toLowerCase();
      const filtered = q ? FAKE_FRIENDS.filter(f => f.name.toLowerCase().includes(q)) : FAKE_FRIENDS;
      const start = (page - 1) * limit;
      const end = start + limit;
      resolve({ items: filtered.slice(start, end), hasMore: end < filtered.length });
    }, 600);
  });
}

/* ===== Debounce ===== */
function useDebounce<T>(v: T, d = 400) {
  const [dv, setDv] = React.useState(v);
  React.useEffect(() => { const t = setTimeout(() => setDv(v), d); return () => clearTimeout(t); }, [v, d]);
  return dv;
}

export default function InviteFriendsSheet({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick?: (f: Friend) => void;
}) {
  const [query, setQuery] = React.useState('');
  const dq = useDebounce(query, 400);

  const [friends, setFriends] = React.useState<Friend[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(false);

  const [loadingInit, setLoadingInit] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);

  const LIMIT = 10;

  React.useEffect(() => {
    if (!open) return;
    (async () => {
      setLoadingInit(true);
      setPage(1);
      const { items, hasMore } = await mockFetchFriends({ search: dq, page: 1, limit: LIMIT });
      setFriends(items);
      setHasMore(hasMore);
      setLoadingInit(false);
    })();
  }, [open, dq]);

  const onLoadMore = React.useCallback(async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    const next = page + 1;
    const { items, hasMore: hm } = await mockFetchFriends({ search: dq, page: next, limit: LIMIT });
    if (items.length) {
      setFriends(prev => [...prev, ...items]);
      setPage(next);
      setHasMore(hm);
    } else {
      setHasMore(false);
    }
    setLoadingMore(false);
  }, [hasMore, loadingMore, page, dq]);

  return (
    <BottomSheet open={open} onClose={onClose} height={520}>
      <View className="px-4 flex-1">
        <Text className="text-center text-[16px] font-semibold my-2">Mời bạn tham gia</Text>
        <View className="flex-row px-4 items-center bg-white rounded-xl h-12 border border-border">
          <Feather name="search" size={20} color="#0a0a0a" />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Tìm bạn"
            placeholderTextColor="#000000"
            className="flex-1 text-base text-black px-2"
            returnKeyType="search"
          />
        </View>

        {loadingInit ? (
          <View className="mt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={i} className="flex-row items-center justify-between px-2 py-3 border-b border-gray-200">
                <View className="flex-row items-center gap-3">
                  <View className="w-14 h-14 rounded-full bg-muted" />
                  <View>
                    <View className="w-36 h-4 bg-muted rounded mb-1" />
                    <View className="w-20 h-3 bg-muted rounded" />
                  </View>
                </View>
                <View className="w-20 h-8 rounded-full bg-muted" />
              </View>
            ))}
          </View>
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 16, paddingTop: 12 }}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {friends.length > 0 ? (
              <View>
                {friends.map((item) => (
                  <View
                    key={item.id}
                    className="flex-row items-center justify-between px-2 py-3 border-b border-gray-200"
                  >
                    <View className="flex-row items-center gap-3">
                      <Avatar className="w-14 h-14">
                        {item.avatar ? (
                          <AvatarImage source={{ uri: item.avatar }} />
                        ) : (
                          <AvatarFallback textClassname="text-[12px]">
                            {item.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <Text className="text-[15px]">{item.name}</Text>
                    </View>

                    <Button
                      textClassName="text-base"
                      className="px-5 rounded-full bg-[#2E2F68]"
                      onPress={() => onPick?.(item)}
                    >
                      Mời bạn
                    </Button>
                  </View>
                ))}

                {hasMore ? (
                  <View className="items-center py-3">
                    {loadingMore ? (
                      <ActivityIndicator />
                    ) : (
                      <Button className="px-4 py-2 rounded-full" onPress={onLoadMore}>
                        Xem thêm
                      </Button>
                    )}
                  </View>
                ) : null}
              </View>
            ) : (
              <EmptyState icon="golf-outline" title="Chưa có bạn nào" description="Hiện chưa có bạn nào." />
            )}
          </ScrollView>
        )}
      </View>
    </BottomSheet>
  );
}
