// components/HomeComponent/DetailSportComponent/Comment/CommentItem.tsx
import React, { useMemo, useState } from 'react';
import { Modal, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/Avatar';
import { Card } from '@/components/Card';
import Button from '@/components/Button';
import { Input } from '@/components/Input';
import { cn } from '@/lib/utils';
import { useAxios } from '@/lib/api';
import Toast from 'react-native-toast-message';

export type Comment = {
  id: string;
  authorName: string;
  avatarUri?: string;
  content: string;
  createdAt: Date | string | number;
  ownerId?: string;
  star?: number;
};

type Props = {
  data: Comment;
  className?: string;
  hideButton?: boolean; // true => ẩn Update/Delete nếu không phải owner
  onDeleted?: (id: string) => void;
  onUpdated?: (id: string, patch: Partial<Pick<Comment, 'content' | 'star'>>) => void;
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

export const CommentItem: React.FC<Props> = ({ data, className, hideButton = false, onDeleted, onUpdated }) => {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(data.content);
  const [ratingDraft, setRatingDraft] = useState<number>(data.star ?? 3);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  const ago = useMemo(() => timeFromNow(data.createdAt), [data.createdAt]);

  const initials = useMemo(() => {
    const parts = data.authorName.trim().split(/\s+/);
    return (parts[0]?.[0] ?? '') + (parts[parts.length - 1]?.[0] ?? '');
  }, [data.authorName]);

  const handleSave = () => {
    if (hideButton) return; // không phải chủ sở hữu
    setSaving(true);
    (async () => {
      try {
        await useAxios.patch(`/rating/${data.id}`, {
          star: ratingDraft,
          content: draft.trim(),
        });
        setOpen(false);
        onUpdated?.(data.id, { content: draft.trim(), star: ratingDraft });
        Toast.show({ type: 'success', text1: 'Thành công', text2: 'Cập nhật đánh giá thành công' });
      } catch (error) {
        console.log('Update comment error', error);
        Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Không thể chỉnh sửa bình luận lúc này. Vui lòng thử lại sau.' });
      } finally {
        setSaving(false);
      }
    })();
  };

  const handleDelete = () => {
    if (hideButton || deleting) return; // không phải chủ sở hữu
    setDeleting(true);
    (async () => {
      try {
        await useAxios.delete(`/rating/${data.id}`);
        onDeleted?.(data.id);
        Toast.show({ type: 'success', text1: 'Thành công', text2: 'Xoá đánh giá thành công' });
      } catch (error) {
        console.log('Delete comment error', error);
        Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Không thể xoá bình luận lúc này. Vui lòng thử lại sau.' });
      } finally {
        setDeleting(false);
      }
    })();
  };

  const handleRate = (n: number) => setRatingDraft(n);

  return (
    <View className={cn('flex-row gap-3 py-3', className)}>
      {/* Avatar */}
      <Avatar className="h-10 w-10">
        {data.avatarUri ? <AvatarImage source={{ uri: data.avatarUri }} /> : <AvatarFallback textClassname="text-xs">{initials.toUpperCase()}</AvatarFallback>}
      </Avatar>

      {/* Right side */}
      <View className="flex-1">
        <Card className="bg-background rounded-2xl border-0 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
          <View className="px-4 py-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-[15px] font-semibold text-primary">{data.authorName}</Text>
              {/* Hiển thị dòng sao của comment */}
              <View className="flex-row items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => {
                  const idx = i + 1;
                  const active = idx <= (data.star ?? 0);
                  return (
                    <Ionicons
                      key={idx}
                      name={active ? 'star' : 'star-outline'}
                      size={14}
                      color={active ? '#F59E0B' : '#94A3B8'}
                    />
                  );
                })}
              </View>
            </View>

            <Text className="mt-1 text-[15px] leading-5 text-foreground">{data.content}</Text>
          </View>
        </Card>

        {/* Action row */}
        <View className="mt-2 flex-row items-center gap-4">
          <Text className="text-xs text-muted-foreground">{ago}</Text>

          {!hideButton && (
            <>
              <TouchableOpacity className="flex-row items-center gap-1" onPress={handleDelete} hitSlop={8} disabled={deleting}>
                <Ionicons name="trash-outline" size={14} />
                <Text className="text-xs text-destructive font-medium">{deleting ? 'Đang xoá...' : 'Xoá'}</Text>
              </TouchableOpacity>

            </>
          )}
        </View>
      </View>

      {/* Update modal */}
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity activeOpacity={1} onPress={() => setOpen(false)} className="flex-1 bg-black/60">
          <TouchableOpacity activeOpacity={1} onPress={() => { }} className="mx-6 mt-auto mb-8 rounded-2xl bg-background p-4">
            {/* Stars editor */}
            <View className="mt-1 mb-2 flex-row items-center gap-3">
              {Array.from({ length: 5 }).map((_, i) => {
                const idx = i + 1;
                const active = idx <= ratingDraft;
                return (
                  <TouchableOpacity key={idx} onPress={() => handleRate(idx)} hitSlop={8}>
                    <Ionicons name={active ? 'star' : 'star-outline'} size={28} color={active ? '#F59E0B' : '#94A3B8'} />
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text className="text-lg font-semibold text-primary mb-3">Sửa bình luận</Text>
            <Input multiline numberOfLines={4} value={draft} onChangeText={setDraft} inputClasses="min-h-[100px] text-[15px]" />

            <View className="mt-4 flex-row justify-end gap-2">
              <Button variant="outline" onPress={() => setOpen(false)}>Huỷ</Button>
              <Button onPress={handleSave} disabled={!draft.trim() || saving}>{saving ? 'Đang lưu...' : 'Lưu'}</Button>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};
