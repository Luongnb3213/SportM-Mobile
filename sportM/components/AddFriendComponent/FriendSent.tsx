import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { UserInviteItem } from './UserInviteItem';
import { UserInviteListSkeleton } from '../Skeleton/UserInviteItemSkeleton';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '../ui/EmptyState';
import { useAxios } from '@/lib/api';

type User = { id: string; name: string; subtitle?: string; avatar?: string };

const NAVY = '#202652';

/** Fake dataset 15 users đã gửi */
const FAKE_SENT: User[] = Array.from({ length: 15 }).map((_, i) => ({
  id: String(i + 1),
  name: `Người dùng ${i + 1}`,
  subtitle: 'Đã gửi lời mời',
  avatar: `https://i.pravatar.cc/150?img=${i + 30}`,
}));

// Fake API
async function mockFetch(page: number, limit: number): Promise<User[]> {
  await new Promise((r) => setTimeout(r, 800));
  const start = (page - 1) * limit;
  const end = start + limit;
  return FAKE_SENT.slice(start, end);
}

const FriendSent = () => {
  const [initialLoading, setInitialLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sent, setSent] = useState<User[]>([]);

  useEffect(() => {
    (async () => {
      setInitialLoading(true);
      try {
        const items = await mockFetch(1, 5);
        // const { data } = await useAxios.get(`/friend-request?type=sent&page=1&limit=5`)
        // setSent(data.data.items);
        setSent(items);
        setHasMore(items.length > 0);
      } catch (error) {
        console.error(error);
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  const handleCancelSent = (u: User) => {
    setSent((prev) => prev.filter((x) => x.id !== u.id));
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const items = await mockFetch(nextPage, 5);
      // const { data } = await useAxios.get(`/friend-request?type=sent&page=${nextPage}&limit=5`)
      // setSent(data.data.items);
      if (items.length > 0) {
        setSent((prev) => [...prev, ...items]);
        setCurrentPage(nextPage);
        setHasMore(items.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMore(false);
    }
  };

  if (initialLoading) {
    return (
      <View className="mt-3">
        <UserInviteListSkeleton />
      </View>
    );
  }

  return (
    <View className="mt-3 flex flex-col gap-5">
      {
        sent.length > 0 ?
          (
            <View className='flex flex-col gap-5'>
              {sent.map((u, idx) => (
                <UserInviteItem
                  key={idx}
                  name={u.name}
                  subtitle={u.subtitle}
                  avatarUri={u.avatar}
                  status="sent"
                  accentHex={NAVY}
                  onCancel={() => handleCancelSent(u)}
                />
              ))}

              {hasMore && (
                <View className="items-center py-3">
                  <TouchableOpacity
                    className="px-3 py-2 flex-row items-center"
                    onPress={loadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <ActivityIndicator size="small" className="mr-2" />
                    ) : (
                      <>
                        <Text className="mr-1">Xem thêm</Text>
                        <Ionicons name="chevron-down" size={16} />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )
          :
          (
            <EmptyState
              icon="golf-outline"
              title="Chưa có yêu cầu đang chờ"
              description="Hiện chưa có yêu cầu đang chờ nào."
            />
          )
      }


    </View>
  );
};

export default FriendSent;
