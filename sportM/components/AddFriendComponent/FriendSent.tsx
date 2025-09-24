import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { UserInviteItem } from './UserInviteItem';
import { useAxios } from '@/lib/api';
import { UserInviteListSkeleton } from '../Skeleton/UserInviteItemSkeleton';
import { Ionicons } from '@expo/vector-icons';
type User = { id: string; name: string; subtitle?: string; avatar?: string };

const NAVY = '#202652';
const FriendSent = () => {
  const [initialLoading, setInitialLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [sent, setSent] = useState<User[]>([
    { id: '4', name: 'Bùi Đức Anh', subtitle: 'Đã gửi lời mời' },
  ]);

  useEffect(() => {
    (async () => {
      setInitialLoading(true);
      try {
        // Fetch data here
        const { data } = await useAxios.get('/friend-request', {
          params: {
            type: 'sent',
            page: 1,
            limit: 5,
          },
        });
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (error) {
        console.error(error);
      } finally {
        setInitialLoading(false);
      }
    })();
  }, []);

  const handleCancelSent = (u: User) => {
    // thu hồi lời mời
    setSent((prev) => prev.filter((x) => x.id !== u.id));
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
      {sent.map((u, idx) => {
        return (
          <UserInviteItem
            key={idx}
            name={u.name}
            subtitle={u.subtitle}
            avatarUri={u.avatar}
            status="sent"
            accentHex={NAVY}
            onCancel={() => handleCancelSent(u)}
          />
        );
      })}
      <View className="items-center py-3">
        <TouchableOpacity className="px-3 py-2 flex-row items-center">
          <Text className="mr-1">Xem thêm</Text>
          <Ionicons name="chevron-down" size={16} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FriendSent;
