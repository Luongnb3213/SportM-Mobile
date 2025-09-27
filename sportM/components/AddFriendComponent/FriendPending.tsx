import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { UserInviteItem } from './UserInviteItem';
import { useAxios } from '@/lib/api';
import { UserInviteListSkeleton } from '../Skeleton/UserInviteItemSkeleton';
import Button from '../Button';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
type User = { id: string; name: string; subtitle?: string; avatar?: string };

const NAVY = '#202652';

const FriendPending = () => {
  const [initialLoading, setInitialLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const loadmoreRef = React.useRef<any>(null);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState<User[]>([
    { id: '3', name: 'Trần Quang', subtitle: 'Đang chờ xác nhận' },
  ]);

  useEffect(() => {
    (async () => {
      setInitialLoading(true);
      try {
        // Fetch data here
        const { data } = await useAxios.get('/friend-request', {
          params: {
            type: 'received',
            page: 1,
            limit: 5,
          },
        });
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(error);
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);
  const handleConfirm = async (u: User) => {
    // accept -> bỏ khỏi pending (coi như đã thành bạn)
    try {
      setPending((prev) => prev.filter((x) => x.id !== u.id));
      const { data } = await useAxios.post(`/friend-request/${u.id}`, {
        status: true,
      });
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
    }
  };
  const handleCancelPending = async (u: User) => {
    // từ chối -> bỏ khỏi pending
    try {
      setPending((prev) => prev.filter((x) => x.id !== u.id));
      await useAxios.post(`/friend-request/${u.id}`, {
        status: false,
      });
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
    }
  };

  const loadMore = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    setCurrentPage((prev) => prev + 1);
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
      {pending.map((u, idx) => {
        return (
          <UserInviteItem
            key={idx}
            name={u.name}
            subtitle={u.subtitle}
            avatarUri={u.avatar}
            status="pending"
            accentHex={NAVY}
            onConfirm={() => handleConfirm(u)}
            onCancel={() => handleCancelPending(u)}
          />
        );
      })}

      <View ref={loadmoreRef} className="items-center py-3">
        <TouchableOpacity
          className="px-3 py-2 flex-row items-center"
          onPress={loadMore}
        >
          {loading && <ActivityIndicator size={'large'} className="mr-2" />}
          {!loading && (
            <>
              <Text className="mr-1">Xem thêm</Text>
              <Ionicons name="chevron-down" size={16} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FriendPending;
