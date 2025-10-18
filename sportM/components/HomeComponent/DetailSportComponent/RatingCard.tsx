// components/RatingCard.tsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card, CardContent } from '@/components/Card';
import Button from '@/components/Button';
import Toast from 'react-native-toast-message';
import { useAxios } from '@/lib/api';
import { Comment } from './Comment/CommentItem';
import { CommentsList } from './Comment/CommentsList';
import { getErrorMessage } from '@/lib/utils';
import { useAuth } from '@/providers/AuthProvider';

type ApiRating = {
  ratingId: string;
  content: string;
  star: number;
  createdAt: string;
  ownerId: string;
  courtId: string;
};

type ApiMeta = {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export default function RatingCard({
  title = 'Đánh giá',
  onChange,
  courtID,
  currentUserId,
  initialLimit = 10, // bạn có thể đổi mặc định
}: {
  title?: string;
  onChange?: (rating: number, note: string) => void;
  courtID: string;
    currentUserId?: string;
    initialLimit?: number;
}) {
  // form create
  const [rating, setRating] = useState<number>(3);
  const [note, setNote] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // list state
  const [items, setItems] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(initialLimit);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useAuth();

  const mapRatings = (raw: ApiRating[]): Comment[] =>
    raw.map((r) => ({
      id: r.ratingId,
      authorName: 'Người dùng', // nếu backend trả tên thì map vào đây
      avatarUri: undefined,
      content: r.content,
      createdAt: r.createdAt,
      ownerId: r.ownerId,
      star: r.star,
    }));

  const fetchPage = useCallback(
    async (targetPage: number, append = false) => {
      const isFirstPage = targetPage === 1 && !append;
      if (isFirstPage) setLoading(true);
      else setLoadingMore(true);

      try {
        const { data } = await useAxios.get(`/rating/${courtID}`, {
          params: { page: targetPage, limit },
        });

        const raw: ApiRating[] = data?.data?.items ?? [];
        const meta: ApiMeta | undefined = data?.data?.meta;
        const mapped = mapRatings(raw);

        setItems((prev) => (append ? [...prev, ...mapped] : mapped));

        // tính hasMore từ meta
        if (meta) {
          setHasMore(meta.currentPage < meta.totalPages);
        } else {
          // fallback: nếu meta không có, dựa vào số lượng trả về
          setHasMore(mapped.length === limit);
        }
        setPage(targetPage);
      } catch (err) {
        console.log('Error fetching ratings:', err);
        if (!append) setItems([]);
        setHasMore(false);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [courtID, limit]
  );

  // initial load
  useEffect(() => {
    fetchPage(1, false);
  }, [fetchPage]);

  const handleRate = (n: number) => {
    setRating(n);
    onChange?.(n, note);
  };

  const handleSubmitRating = async () => {
    if (!rating && !note.trim()) return;
    setSubmitting(true);
    try {
      const payload = { courtId: courtID, star: rating, content: note.trim() };
      const { data } = await useAxios.post('/rating', payload);

      const newItem: Comment = {
        id: data?.data?.ratingId ?? String(Date.now()),
        authorName: 'Bạn',
        avatarUri: undefined,
        content: note.trim(),
        createdAt: new Date().toISOString(),
        ownerId: currentUserId,
        star: rating,
      };

      // prepend vào danh sách
      setItems((prev) => [newItem, ...prev]);
      setNote('');
      setRating(3);
      Toast.show({ type: 'success', text1: 'Thành công', text2: 'Cảm ơn bạn đã gửi đánh giá!' });
    } catch (error: any) {
      console.log('Error submitting rating:', getErrorMessage(error));
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: getErrorMessage(error) || 'Đã có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // callbacks từ item
  const handleDeleted = (id: string) => {
    setItems((prev) => prev.filter((x) => x.id !== id));
  };

  const handleUpdated = (id: string, patch: Partial<Pick<Comment, 'content' | 'star'>>) => {
    setItems((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const canSubmit = useMemo(() => rating > 0 && !submitting, [rating, submitting]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    fetchPage(page + 1, true);
  };

  return (
    <View>
      {/* LIST */}
      <ScrollView
        className="mx-3 rounded-2xl p-4 bg-[#EEE] overflow-hidden"
        style={{ maxHeight: 400 }}
        contentContainerStyle={{ paddingBottom: 12 }}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-xl font-extrabold mb-2 text-primary">{title}</Text>

        {loading ? (
          <View className="py-6 items-center">
            <ActivityIndicator />
            <Text className="mt-2 text-sm text-muted-foreground">Đang tải đánh giá...</Text>
          </View>
        ) : (
          <>
            <CommentsList
              comments={items}
              currentUserId={currentUserId}
              onDeleted={handleDeleted}
              onUpdated={handleUpdated}
            />

            {/* Footer: Load more */}
            {hasMore ? (
              <View className="mt-2">
                <Button
                  onPress={loadMore}
                  disabled={loadingMore}
                  className="rounded-xl"
                  textClassName="text-[14px]"
                >
                  {loadingMore ? 'Đang tải...' : 'Xem thêm'}
                </Button>
              </View>
            ) : (
              items.length > 0 && (
                <Text className="mt-2 text-center text-xs text-muted-foreground">
                  Đã hiển thị tất cả đánh giá
                </Text>
              )
            )}
          </>
        )}
      </ScrollView>

      {/* FORM CREATE */}

      {user && (
        <Card className="m-3 rounded-2xl p-4 bg-[#EEE]">
          <CardContent className="p-0">
            <Text className="text-xl font-extrabold text-primary">Thêm đánh giá của bạn</Text>
            <Text className="mt-2 text-[13.5px] leading-5 text-muted-foreground">
              Sau khi trải nghiệm sân, bạn cảm thấy như thế nào?
            </Text>

            {/* Stars */}
            <View className="mt-4 flex-row items-center gap-3">
              {Array.from({ length: 5 }).map((_, i) => {
                const idx = i + 1;
                const active = idx <= rating;
                return (
                  <TouchableOpacity key={idx} onPress={() => handleRate(idx)} hitSlop={8}>
                    <Ionicons name={active ? 'star' : 'star-outline'} size={28} color={active ? '#F59E0B' : '#94A3B8'} />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Comment box */}
            <Text className="mt-5 text-[13.5px] font-semibold text-primary">Nhập nhận xét (tuỳ chọn)</Text>
            <TextInput
              placeholder="Nhập nhận xét"
              multiline
              value={note}
              onChangeText={(t) => {
                setNote(t);
                onChange?.(rating, t);
              }}
              className="mt-2 min-h-[120px] rounded-2xl bg-white text-[15px]"
              editable={!submitting}
              numberOfLines={4}
              style={{ textAlignVertical: 'top', padding: 12 }}
            />

            <Button className="mt-4 rounded-2xl" textClassName="text-base" onPress={handleSubmitRating} disabled={!canSubmit}>
              {submitting ? 'Đang gửi...' : 'Xác nhận'}
            </Button>
          </CardContent>
        </Card>
      )}

    </View>
  );
}
