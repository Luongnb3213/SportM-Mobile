import React, { useMemo, useState } from 'react';
import { Modal, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/Avatar';
import { Card } from '@/components/Card';
import Button from '@/components/Button';
import { Input } from '@/components/Input';
import { cn } from '@/lib/utils';

export type Comment = {
  id: string;
  authorName: string;
  avatarUri?: string;
  content: string;
  createdAt: Date | string | number; // dùng Date hoặc timestamp
};

type Props = {
  data: Comment;
  className?: string;
};

function timeFromNow(createdAt: Props['data']['createdAt']) {
  const d = createdAt instanceof Date ? createdAt : new Date(createdAt);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.max(0, Math.floor(diffMs / 60000));
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ`;
  const days = Math.floor(hrs / 24);
  return `${days} ngày`;
}

export const CommentItem: React.FC<Props> = ({ data, className }) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(data.content);

  const ago = useMemo(() => timeFromNow(data.createdAt), [data.createdAt]);

  const initials = useMemo(() => {
    const parts = data.authorName.trim().split(/\s+/);
    return (parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '');
  }, [data.authorName]);

  const handleSave = () => {
    handleUpdate();
    setOpen(false);
  };

  const handleDelete = () => {};

  const handleUpdate = () => {};

  return (
    <View className={cn('flex-row gap-3 px-4 py-3', className)}>
      {/* Avatar */}
      <Avatar className="h-10 w-10">
        {data.avatarUri ? (
          <AvatarImage source={{ uri: data.avatarUri }} />
        ) : (
          <AvatarFallback textClassname="text-xs">
            {initials.toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>

      {/* Right side */}
      <View className="flex-1">
        {/* Bubble */}
        <Card className="bg-background rounded-2xl border-0 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
          <View className="px-4 py-3">
            <Text className="text-[15px] font-semibold text-primary">
              {data.authorName}
            </Text>
            <Text className="text-[15px] leading-5 text-foreground">
              {data.content}
            </Text>
          </View>
        </Card>

        {/* Action row */}
        <View className="mt-2 flex-row items-center gap-4">
          <Text className="text-xs text-muted-foreground">{ago}</Text>

          <TouchableOpacity
            className="flex-row items-center gap-1"
            onPress={handleDelete}
            hitSlop={8}
          >
            <Ionicons name="trash-outline" size={14} />
            <Text className="text-xs text-destructive font-medium">Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center gap-1"
            onPress={() => {
              setDraft(data.content);
              setOpen(true);
            }}
            hitSlop={8}
          >
            <Ionicons name="create-outline" size={14} />
            <Text className="text-xs text-primary font-medium">Update</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Update modal (react-native Modal) */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setOpen(false)}
          className="flex-1 bg-black/60"
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            className="mx-6 mt-auto mb-8 rounded-2xl bg-background p-4"
          >
            <Text className="text-lg font-semibold text-primary mb-3">
              Sửa bình luận
            </Text>
            <Input
              multiline
              numberOfLines={4}
              value={draft}
              onChangeText={setDraft}
              inputClasses="min-h-[100px] text-[15px]"
            />

            <View className="mt-4 flex-row justify-end gap-2">
              <Button variant="outline" onPress={() => setOpen(false)}>
                Huỷ
              </Button>
              <Button onPress={handleSave} disabled={!draft.trim()}>
                Lưu
              </Button>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
