// InviteFriendsSheet.tsx
import React from 'react';
import { View, Text, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/Avatar';
import Button from '@/components/Button';
import BottomSheet from '@/components/TabBarComponent/BottomSheet';
import { Feather } from '@expo/vector-icons';
import EmptyState from '@/components/ui/EmptyState';
import { useAxios } from '@/lib/api';

type Friend = { userId: string; fullName: string; avatarUrl?: string };

function useDebounce<T>(v: T, d = 400) {
  const [dv, setDv] = React.useState(v);
  React.useEffect(() => { const t = setTimeout(() => setDv(v), d); return () => clearTimeout(t); }, [v, d]);
  return dv;
}

export default function InviteFriendsSheet({
  open,
  onClose,
  onPick,
  invited = [],
}: {
  open: boolean;
  onClose: () => void;
  onPick?: (f: Friend) => void;
  invited?: Friend[];
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
      const { data } = await useAxios.get(`friend?page=1&limit=${LIMIT}&search=${dq}`)
      setFriends(data.data.friends);
      setHasMore(data.data.friends.length > 0);
      setLoadingInit(false);
    })();
  }, [open, dq]);

  const onLoadMore = React.useCallback(async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    const next = page + 1;
    const { data } = await useAxios.get(`friend?page=${next}&limit=${LIMIT}&search=${dq}`)
    const items: Friend[] = data.data.friends;
    const hm = items.length > 0;
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
                    key={item.userId}
                    className="flex-row items-center justify-between px-2 py-3 border-b border-gray-200"
                  >
                    <View className="flex-row items-center gap-3">
                      <Avatar className="w-14 h-14">
                        {item?.avatarUrl ? (
                          <AvatarImage source={{ uri: item.avatarUrl }} />
                        ) : (
                          <AvatarFallback textClassname="text-[12px]">
                            {item?.fullName?.split(' ').map(w => w[0]).slice(0, 2).join('')}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <Text className="text-[15px]">{item?.fullName}</Text>
                    </View>

                    <Button
                      textClassName="text-base"
                      className={`px-5 rounded-full ${invited.some(f => f.userId === item.userId)
                          ? 'bg-gray-300'
                          : 'bg-[#2E2F68]'
                        }`}
                      disabled={invited.some(f => f.userId === item.userId)}
                      onPress={() => onPick?.(item)}
                    >
                      {invited.some(f => f.userId === item.userId) ? 'Đã mời' : 'Mời bạn'}
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
