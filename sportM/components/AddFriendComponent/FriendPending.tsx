import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { UserInviteItem } from './UserInviteItem';
import { UserInviteListSkeleton } from '../Skeleton/UserInviteItemSkeleton';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import EmptyState from '../ui/EmptyState';
import { useAxios } from '@/lib/api';

type User = { id: string; name: string; subtitle?: string; avatar?: string };

const NAVY = '#202652';

/** Fake dataset 20 users */
const FAKE_USERS: User[] = Array.from({ length: 20 }).map((_, i) => ({
  id: String(i + 1),
  name: `Người dùng ${i + 1}`,
  subtitle: 'Đang chờ xác nhận',
  avatar: `https://i.pravatar.cc/150?img=${i + 10}`,
}));

// fake API (page, limit)
async function mockFetch(page: number, limit: number): Promise<User[]> {
  await new Promise((r) => setTimeout(r, 800)); // simulate delay
  const start = (page - 1) * limit;
  const end = start + limit;
  return FAKE_USERS.slice(start, end);
}

const FriendPending = () => {
  const [initialLoading, setInitialLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pending, setPending] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setInitialLoading(true);
      try {
        const items = await mockFetch(1, 5);
        const { data } = await useAxios.get(`/friend-request?type=received&page=1&limit=5`)
        console.log(data.data.items)
        setPending(items);
        setHasMore(items.length > 0);
      } catch (error) {
        console.error(error);
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  const handleConfirm = async (u: User) => {
    try {
      setLoading(true)
      await useAxios.patch(`/friend-request/${u.id}`, {
        status: true
      })
      setPending((prev) => prev.filter((x) => x.id !== u.id));
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: `Bạn và ${u.name} đã trở thành bạn bè.`,
      });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể xác nhận lời mời lúc này. Vui lòng thử lại sau.',
      });
    } finally {
      setLoading(false)
    }
  };

  const handleCancelPending = async (u: User) => {
    try {
      setLoading(true)
      await useAxios.patch(`/friend-request/${u.id}`, {
        status: false
      })
      setPending((prev) => prev.filter((x) => x.id !== u.id));
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: `Bạn đã từ chối lời mời kết bạn từ ${u.name}.`,
      });
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể từ chối lời mời lúc này. Vui lòng thử lại sau.',
      });
    } finally {
      setLoading(false)
    }
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const newItems = await mockFetch(nextPage, 5);
      // const { data } = await useAxios.get(`/friend-request?type=received&page=${nextPage}&limit=5`)
      // setSent(data.data.items);
      if (newItems.length > 0) {
        setPending((prev) => [...prev, ...newItems]);
        setCurrentPage(nextPage);
        setHasMore(newItems.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể tải thêm dữ liệu.',
      });
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

      {pending.length > 0 ?
        (
          <View className='flex flex-col gap-5'>
            {pending.map((u, idx) => (
              <UserInviteItem
                id={u?.id}
                loading={loading}
                key={idx}
                name={u?.name}
                subtitle={u?.subtitle}
                avatarUri={u?.avatar}
                status="pending"
                accentHex={NAVY}
                onConfirm={() => handleConfirm(u)}
                onCancel={() => handleCancelPending(u)}
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
        : (
          <EmptyState
            icon="golf-outline"
            title="Chưa có lượt lời mời đã gửi"
            description="Hiện chưa có lượt lời mời nào."
          />
        )}

    </View>
  );
};

export default FriendPending;
