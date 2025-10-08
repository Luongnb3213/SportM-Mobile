import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { UserInviteItem } from './UserInviteItem';
import { UserInviteListSkeleton } from '../Skeleton/UserInviteItemSkeleton';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '../ui/EmptyState';
import { useAxios } from '@/lib/api';


const NAVY = '#202652';

const FriendSent = () => {
  const [initialLoading, setInitialLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [sent, setSent] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      setInitialLoading(true);
      try {
        const { data } = await useAxios.get(`/friend-request?type=sent&page=1&limit=5`)
        console.log(data.data.items)
        let items = data.data.items
        setSent(items);
        setHasMore(items.length > 0);
      } catch (error) {
        console.error(error);
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  const handleCancelSent = (u: any) => {
    setSent((prev) => prev.filter((x) => x.id !== u.id));
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
       const { data } = await useAxios.get(`/friend-request?type=sent&page=${nextPage}&limit=5`)
      let items = data.data.items
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
                  id={u?.to.userId}
                  key={idx}
                  name={u?.to.fullName}
                  subtitle={'Đã gửi lời mời kết bạn'}
                  avatarUri={u?.to.avatarUrl}
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
