// app/friends/index.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  KeyboardAwareScrollView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import { UserInviteItem } from '@/components/AddFriendComponent/UserInviteItem';

type User = { id: string; name: string; subtitle?: string; avatar?: string };
type SectionKey = 'suggest' | 'pending' | 'sent';

const NAVY = '#202652';

export default function FriendsScreen() {
  // demo data
  const [suggest, setSuggest] = useState<User[]>([
    { id: '1', name: 'Lại Gia Tùng', subtitle: 'Chủ sân' },
    { id: '2', name: 'Nguyễn Hồng Phúc', subtitle: 'Thủ môn' },
  ]);
  const [pending, setPending] = useState<User[]>([
    { id: '3', name: 'Trần Quang', subtitle: 'Đang chờ xác nhận' },
  ]);
  const [sent, setSent] = useState<User[]>([
    { id: '4', name: 'Bùi Đức Anh', subtitle: 'Đã gửi lời mời' },
  ]);

  const [section, setSection] = useState<SectionKey>('sent');

  // handlers chuyển item giữa các danh sách
  const handleAdd = (u: User) => {
    setSuggest((prev) => prev.filter((x) => x.id !== u.id));
    setSent((prev) => [{ ...u, subtitle: 'Đã gửi lời mời' }, ...prev]);
  };
  const handleRemoveSuggest = (u: User) => {
    setSuggest((prev) => prev.filter((x) => x.id !== u.id));
  };
  const handleConfirm = (u: User) => {
    // accept -> bỏ khỏi pending (coi như đã thành bạn)
    setPending((prev) => prev.filter((x) => x.id !== u.id));
  };
  const handleCancelPending = (u: User) => {
    // từ chối -> bỏ khỏi pending
    setPending((prev) => prev.filter((x) => x.id !== u.id));
  };
  const handleCancelSent = (u: User) => {
    // thu hồi lời mời
    setSent((prev) => prev.filter((x) => x.id !== u.id));
  };

  const handleChangeScreen = (screen: SectionKey) => {
    setSection(screen);
  };

  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1 bg-background">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="p-5">
            <View className="h-full bg-white px-5 py-6 rounded-2xl">
              <Text className="text-xl font-bold mb-4">Bạn bè</Text>
              <View className="flex-row items-center justify-center px-4 gap-3">
                <TouchableOpacity
                  onPress={() => {
                    handleChangeScreen('suggest');
                  }}
                  className={`px-5 py-3 rounded-full min-w-20 items-center ${
                    section === 'suggest' ? 'bg-primary' : 'bg-gray-400'
                  }`}
                >
                  <Text className="text-white text-sm font-medium">Gợi ý</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    handleChangeScreen('pending');
                  }}
                  className={`px-5 py-3 rounded-full min-w-20 items-center ${
                    section === 'pending' ? 'bg-primary' : 'bg-gray-400'
                  }`}
                >
                  <Text className="text-white text-sm">Yêu cầu đang chờ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    handleChangeScreen('sent');
                  }}
                  className={`px-5 py-3 rounded-full min-w-20 items-center ${
                    section === 'sent' ? 'bg-primary' : 'bg-gray-400'
                  }`}
                >
                  <Text className="text-white text-sm">Lời mời đã gửi</Text>
                </TouchableOpacity>
              </View>

              <View>
                <View className={'mt-3'}>
                  {section === 'suggest' &&
                    suggest.map((u, idx) => {
                      return (
                        <UserInviteItem
                          key={idx}
                          name={u.name}
                          subtitle={u.subtitle}
                          avatarUri={u.avatar}
                          status="suggestion"
                          accentHex={NAVY}
                          onAdd={() => handleAdd(u)}
                          onRemove={() => handleRemoveSuggest(u)}
                        />
                      );
                    })}

                  {section === 'pending' &&
                    pending.map((u, idx) => {
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

                  {section === 'sent' &&
                    sent.map((u, idx) => {
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
                </View>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardProvider>
  );
}
