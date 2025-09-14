// components/UserInviteItem.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@/components/Card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';

type InviteStatus = 'suggestion' | 'pending' | 'sent';

export interface UserInviteItemProps {
  name: string;
  subtitle?: string;          // ví dụ: "Chủ sân"
  avatarUri?: string;
  status: InviteStatus;

  // handlers cho từng hành động
  onAdd?: () => void;         // dùng cho "suggestion"
  onRemove?: () => void;      // dùng cho "suggestion"
  onConfirm?: () => void;     // dùng cho "pending"
  onCancel?: () => void;      // dùng cho "pending" & "sent"

  // style tuỳ biến
  className?: string;
  accentHex?: string;         // màu tròn đậm (mặc định xanh navy)
}

export function UserInviteItem({
  name,
  subtitle,
  avatarUri,
  status,
  onAdd,
  onRemove,
  onConfirm,
  onCancel,
  className,
  accentHex = '#202652', // xanh navy đậm giống mock
}: UserInviteItemProps) {
  // button tròn tái sử dụng
  const Circle = ({
    variant,
    onPress,
    icon,
    accessibilityLabel,
  }: {
    variant: 'solid' | 'light';
    onPress?: () => void;
    icon: React.ReactNode;
    accessibilityLabel: string;
  }) => (
    <Button
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      size="icon"
      className={cn(
        'rounded-full w-10 h-10',
        variant === 'solid'
          ? 'items-center justify-center'
          : 'items-center justify-center border',
      )}
      style={{
        backgroundColor: variant === 'solid' ? accentHex : 'white',
        borderColor: variant === 'light' ? '#E5E7EB' : 'transparent',
      }}
    >
      {icon}
    </Button>
  );

  const RightActions = () => {
    switch (status) {
      case 'suggestion':
        return (
          <View className="flex-row gap-3">
            <Circle
              variant="solid"
              onPress={onAdd}
              accessibilityLabel="Thêm"
              icon={<Ionicons name="add" size={20} color="#FFFFFF" />}
            />
            <Circle
              variant="light"
              onPress={onRemove}
              accessibilityLabel="Bỏ gợi ý"
              icon={<Ionicons name="remove" size={20} color={accentHex} />}
            />
          </View>
        );
      case 'pending':
        return (
          <View className="flex-row gap-3">
            <Circle
              variant="solid"
              onPress={onConfirm}
              accessibilityLabel="Chấp nhận"
              icon={<Ionicons name="checkmark" size={20} color="#FFFFFF" />}
            />
            <Circle
              variant="light"
              onPress={onCancel}
              accessibilityLabel="Huỷ yêu cầu"
              icon={<Ionicons name="close" size={20} color={accentHex} />}
            />
          </View>
        );
      case 'sent':
        return (
          <View className="flex-row gap-3">
            <Circle
              variant="light"
              onPress={onCancel}
              accessibilityLabel="Thu hồi lời mời"
              icon={<Ionicons name="close" size={20} color={accentHex} />}
            />
          </View>
        );
    }
  };

  const initials =
    name
      ?.split(' ')
      .map(w => w[0])
      .slice(0, 2)
      .join('') || 'U';

  return (
    <Card
      className={cn(
        'flex-row items-center gap-3 px-3 py-2 rounded-2xl bg-white shadow-sm',
        className,
      )}
    >
      {/* Avatar */}
      <Avatar className="w-12 h-12">
        {avatarUri ? (
          <AvatarImage source={{ uri: avatarUri }} />
        ) : (
          <AvatarFallback textClassname="text-base">{initials}</AvatarFallback>
        )}
      </Avatar>

      {/* Info */}
      <View className="flex-1">
        <Text
          className="text-lg font-extrabold"
          style={{ color: accentHex }}
          numberOfLines={1}
        >
          {name}
        </Text>
        {!!subtitle && (
          <Text className="text-[13px] text-muted-foreground" numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Actions theo trạng thái */}
      <RightActions />
    </Card>
  );
}
