// components/RatingCard.tsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import Button from '@/components/Button';
import Toast from 'react-native-toast-message';
import { useAxios } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils';
import { CommentsList } from '../HomeComponent/DetailSportComponent/Comment/CommentsList';

type ApiRating = {
  ratingId: string;
  content: string;
  star: number;
  createdAt: string;
  ownerId: string;
  courtId: string;
};

type Comment = {
  id: string;
  authorName: string;
  avatarUri?: string;
  content: string;
  createdAt: string;
  ownerId: string;
  star: number;
};

type ApiMeta = {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export default function RatingCourtCard({
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
    </View>
  );
}
