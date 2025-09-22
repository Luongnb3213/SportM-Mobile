// app/(tabs)/account/index.tsx
import { Text, TouchableOpacity, View } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import HeaderUser from '@/components/ui/HeaderUser';
import Button from '@/components/Button';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar';
import { Card } from '@/components/Card';
type Noti =
  | {
      id: string;
      type: 'system';
      text: string;
      time: string;
    }
  | {
      id: string;
      type: 'friend_request';
      user: { name: string; avatar?: string };
      text: string;
      time: string;
    };

const NOTIFS: Noti[] = [
  {
    id: 'n0',
    type: 'system',
    text: 'Bạn đã đặt thành công sân Golf Nem Chua. Đừng quên hẹn của mình nhé',
    time: 'Hôm nay, lúc 9:36 AM',
  },
  // 3 lời mời kết bạn như ảnh
  ...Array.from({ length: 3 }).map((_, i) => ({
    id: `fr${i}`,
    type: 'friend_request' as const,
    user: { name: 'Êm Fô', avatar: 'https://i.pravatar.cc/100?img=65' },
    text: 'Êm Fô đã gửi cho bạn 1 lời kết bạn',
    time: 'Hôm nay, lúc 9:36 AM',
  })),
];
export default function AccountScreen() {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          extraKeyboardSpace={0}
        >
          <View className="bg-white">
            <View className="bg-background px-4">
              <HeaderUser />
            </View>
            {/* Top bar */}
            <View className="flex-row items-center justify-start px-4 py-3 border-b border-border">
              <TouchableOpacity className="pr-2">
                <Ionicons name="chevron-back" size={20} />
              </TouchableOpacity>

              <View className="flex-row items-center gap-2">
                <Text className="text-base font-semibold text-primary">
                  Thông báo
                </Text>
                <Text className="text-muted-foreground">Tất cả</Text>
                <Ionicons name="chevron-down" size={16} />
              </View>

              <View className="w-5" />
              {/* spacer để cân đối với nút back */}
            </View>

            <Card
              className="m-4 mx-0 rounded-2xl overflow-hidden bg-background"
              style={{ borderWidth: 0 }}
            >
              {NOTIFS.map((n, idx) => {
                const isLast = idx === NOTIFS.length - 1;
                if (n.type === 'system') {
                  return (
                    <View
                      key={n.id}
                      className={[
                        'px-4 py-4 bg-white/0',
                        !isLast && 'border-b border-border',
                      ].join(' ')}
                    >
                      <View className="flex-row items-start gap-2">
                        <View className="mt-1 h-2 w-2 rounded-full bg-[#90CDF4]" />
                        <View className="h-10 w-10"></View>
                        <View className="flex-1">
                          <Text className="text-[13.5px] leading-5">
                            {n.text.split('sân Golf Nem Chua').length > 1 ? (
                              <>
                                Bạn đã đặt thành công{' '}
                                <Text className="font-semibold text-primary">
                                  sân Golf Nem Chua
                                </Text>
                                . Đừng quên hẹn của mình nhé
                              </>
                            ) : (
                              n.text
                            )}
                          </Text>
                          <Text className="mt-2 text-[12px] text-muted-foreground">
                            {n.time}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                }

                return (
                  <View
                    key={n.id}
                    className={[
                      'px-4 py-4',
                      !isLast && 'border-b border-border',
                    ].join(' ')}
                  >
                    <View className="flex-row gap-3 items-start">
                      <View className="mt-1 h-2 w-2 rounded-full bg-[#90CDF4]" />
                      <Avatar className="h-10 w-10">
                        {n.user.avatar ? (
                          <AvatarImage source={{ uri: n.user.avatar }} />
                        ) : (
                          <AvatarFallback>UF</AvatarFallback>
                        )}
                      </Avatar>

                      <View className="flex-1">
                        <Text className="text-[13.5px] leading-5">
                          {n.text}
                        </Text>

                        <View className="mt-3 flex-row gap-3">
                          <Button className="px-4 py-1 rounded-md">
                            Chấp nhận
                          </Button>
                          <Button
                            variant="outline"
                            className="px-4 py-2 rounded-md"
                            style={{ borderWidth: 0 }}
                          >
                            Từ chối
                          </Button>
                        </View>

                        <Text className="mt-3 text-[12px] text-muted-foreground">
                          {n.time}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}

              {/* Footer: Xem thêm */}
              <View className="items-center py-3">
                <Button
                  variant="ghost"
                  className="px-3 py-2 flex-row items-center"
                >
                  <Text className="mr-1">Xem thêm</Text>
                  <Ionicons name="chevron-down" size={16} />
                </Button>
              </View>
            </Card>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardProvider>
  );
}
