// components/UserInviteItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card } from '@/components/Card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { cn } from '@/lib/utils';
import { router } from 'expo-router';

type InviteStatus = 'suggestion' | 'pending' | 'sent';

export interface UserInviteItemProps {
  id: string
  name: string;
  subtitle?: string;
  avatarUri?: string;
  status: InviteStatus;

  onAdd?: () => void;
  onRemove?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;

  className?: string;
  accentHex?: string;
  loading?: boolean
}

export function UserInviteItem({
  id,
  name,
  subtitle,
  avatarUri,
  status,
  onAdd,
  onRemove,
  onConfirm,
  onCancel,
  className,
  accentHex = '#202652',
  loading
}: UserInviteItemProps) {
  // button tròn tái sử dụng
  const Circle = ({
    variant,
    onPress,
    icon,
    accessibilityLabel,
    loading
  }: {
    variant: 'solid' | 'light';
    onPress?: () => void;
    icon: React.ReactNode;
    accessibilityLabel: string;
    loading?: boolean
  }) => (
    <Button
      disabled={loading}
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
              loading={loading}
              variant="solid"
              onPress={onAdd}
              accessibilityLabel="Thêm"
              icon={<Ionicons name="add" size={20} color="#FFFFFF" />}
            />
            <Circle
              loading={loading}
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
              loading={loading}
              variant="solid"
              onPress={onConfirm}
              accessibilityLabel="Chấp nhận"
              icon={<Ionicons name="checkmark" size={20} color="#FFFFFF" />}
            />
            <Circle
              loading={loading}
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
        `flex-row items-center gap-3 px-3 py-3 rounded-2xl ${avatarUri ? 'bg-[#D0CFCF]' : 'bg-white'} shadow-sm`,
        className,
      )}
    >
      {/* Avatar */}
      <TouchableOpacity onPress={() => {
         router.push({
          pathname: '/(tabs)/settingsAccount/detailAccount',
          params: { userId: id} 
         })
      }}>
        <Avatar className="w-20 h-20">
          {avatarUri ? (
            <AvatarImage source={{ uri: avatarUri }} />
          ) : (
            <AvatarFallback textClassname="text-base">{initials}</AvatarFallback>
          )}
        </Avatar>
      </TouchableOpacity>

      {/* Info */}
      <View className="flex-1">
        <Text
          className="text-xl font-extrabold"
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
