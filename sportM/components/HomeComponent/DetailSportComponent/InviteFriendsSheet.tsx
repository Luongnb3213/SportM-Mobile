// InviteFriendsSheet.tsx
import React from 'react';
import { View, Text, FlatList, TextInput } from 'react-native';
import { Input } from '@/components/Input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/Avatar';
import Button from '@/components/Button';
import BottomSheet from '@/components/TabBarComponent/BottomSheet';
import { Feather } from '@expo/vector-icons';

type Friend = { id: string; name: string; avatar?: string };

const MOCK: Friend[] = [
  { id: '1', name: 'Lại Gia Tùng' },
  { id: '2', name: 'Lại Gia Tùng' },
  { id: '3', name: 'Lại Gia Tùng' },
  { id: '4', name: 'Lại Gia Tùng' },
];

export default function InviteFriendsSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <BottomSheet open={open} onClose={onClose} height={520}>
      <View className="px-4">
        {/* Title */}
        <Text className="text-center text-[16px] font-semibold my-2">
          Mời bạn tham gia
        </Text>

        <View className="flex-row px-4 items-center bg-white rounded-xl h-20 mb-4">
          <Feather name="search" size={25} color="#0a0a0a" />
          <TextInput
            placeholder="Tìm bạn"
            placeholderTextColor="#000000"
            className="flex-1 text-lg text-black px-2 "
          />
        </View>
        {/* List */}
        <FlatList
          data={MOCK}
          keyExtractor={(it) => it.id}
          contentContainerStyle={{ paddingBottom: 16 }}
          className="mt-3"
          renderItem={({ item }) => (
            <View className="flex-row items-center justify-between px-2 py-3 border-b border-gray-200">
              <View className="flex-row items-center gap-3">
                <Avatar className="w-14 h-14">
                  {item.avatar ? (
                    <AvatarImage source={{ uri: item.avatar }} />
                  ) : (
                    <AvatarFallback textClassname="text-[12px]">
                      {item.name
                        .split(' ')
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join('')}
                    </AvatarFallback>
                  )}
                </Avatar>
                <Text className="text-[15px]">{item.name}</Text>
              </View>

              <Button textClassName='text-base' className="px-5 rounded-full bg-[#2E2F68]">
                Mời bạn
              </Button>
            </View>
          )}
        />
      </View>
    </BottomSheet>
  );
}
