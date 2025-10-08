import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { UserInviteItem } from './UserInviteItem';
import { UserInviteListSkeleton } from '../Skeleton/UserInviteItemSkeleton';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import EmptyState from '../ui/EmptyState';
import { useAxios } from '@/lib/api';


const NAVY = '#202652';


const FriendPending = () => {
  const [initialLoading, setInitialLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setInitialLoading(true);
      try {
        const { data } = await useAxios.get(`/friend-request?type=received&page=1&limit=5`)
        setPending(data.data.items);
        setHasMore(data.data.items.length > 0);
      } catch (error) {
        console.error(error);
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  const handleConfirm = async (u: any) => {
    try {
      setLoading(true)
      console.log(u.userId)
      await useAxios.patch(`/friend-request/${u.userId}`, {
        status: true
      })

      setPending((prev) => prev.filter((x) => x.from.userId !== u.userId));
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: `Bạn và ${u.fullName} đã trở thành bạn bè.`,
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

  const handleCancelPending = async (u: any) => {
    try {
      setLoading(true)
      await useAxios.patch(`/friend-request/${u.userId}`, {
        status: false
      })
      setPending((prev) => prev.filter((x) => x.from.userId !== u.userId));
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: `Bạn đã từ chối lời mời kết bạn từ ${u.fullName}.`,
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
       const { data } = await useAxios.get(`/friend-request?type=received&page=${nextPage}&limit=5`)
      if (data.data.items.length > 0) {
        setPending((prev) => [...prev, ...data.data.items]);
        setCurrentPage(nextPage);
        setHasMore(data.data.items.length > 0);
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
                id={u.from?.userId}
                loading={loading}
                key={idx}
                name={u.from?.fullName}
                subtitle={'Đã gửi lời mời kết bạn'}
                avatarUri={u?.from?.avatarUrl}
                status="pending"
                accentHex={NAVY}
                onConfirm={() => handleConfirm(u.from)}
                onCancel={() => handleCancelPending(u.from)}
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
