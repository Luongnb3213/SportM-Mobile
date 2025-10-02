// components/RatingCourtCard.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card, CardContent, CardFooter } from '@/components/Card';
import Button from '@/components/Button';
import Toast from 'react-native-toast-message';
import { useAxios } from '@/lib/api';
import { CommentsList } from '../HomeComponent/DetailSportComponent/Comment/CommentsList';
import { Comment } from '../HomeComponent/DetailSportComponent/Comment/CommentItem';
import CommentsSkeleton from '@/components/Skeleton/CommentsSkeleton';

// fake data giữ nguyên/hoặc thêm nếu muốn
const allFakeComments: Comment[] = [
  { id: 'c1', authorName: 'Nguyễn Văn A', avatarUri: 'https://i.pravatar.cc/100?img=1', content: 'Sân đẹp, rộng rãi lắm mọi người!', createdAt: new Date(Date.now() - 1000 * 60 * 2) },
  { id: 'c2', authorName: 'Trần Thị B', avatarUri: 'https://i.pravatar.cc/100?img=5', content: 'Mình thấy đèn hơi tối một chút.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3) },
  { id: 'c3', authorName: 'Lê Văn C', content: 'Anh chủ sân nhiệt tình, sẽ quay lại lần sau.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
  { id: 'c4', authorName: 'Trần Thị E', avatarUri: 'https://i.pravatar.cc/100?img=5', content: 'Mình thấy đèn hơi tối một chút.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3) },
  { id: 'c5', authorName: 'Lê Văn F', content: 'Anh chủ sân nhiệt tình, sẽ quay lại lần sau.', createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2) },
  { id: 'c6', authorName: 'Phạm Văn G', content: 'Bãi xe rộng, tiện lợi.', createdAt: new Date(Date.now() - 1000 * 60 * 30) },
  { id: 'c7', authorName: 'Đỗ Thị H', content: 'Phòng thay đồ sạch.', createdAt: new Date(Date.now() - 1000 * 60 * 90) },
];

export default function RatingCourtCard({
  title = 'Đánh giá sân',
  courtID,
}: {
  title?: string;
  courtID: string;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // phân trang đơn giản
  const pageSize = 3;
  const [page, setPage] = useState(1);
  const total = allFakeComments.length;
  const hasMore = comments.length < total;

  useEffect(() => {
    // fake gọi API lần đầu
    setInitialLoading(true);
    const t = setTimeout(() => {
      const first = allFakeComments.slice(0, pageSize);
      setComments(first);
      setInitialLoading(false);
      setPage(1);
    }, 700);
    return () => clearTimeout(t);
  }, [courtID]);

  const handleLoadMore = () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    // fake API: delay 600ms
    setTimeout(() => {
      const nextPage = page + 1;
      const nextChunk = allFakeComments.slice(0, nextPage * pageSize);
      setComments(nextChunk);
      setPage(nextPage);
      setLoadingMore(false);
    }, 600);
  };

  return (
    <View>
      <ScrollView
        className="mx-3 rounded-2xl p-4 bg-[#EEE] overflow-hidden"
        style={{ maxHeight: 400 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-xl font-extrabold mb-2 text-primary">{title}</Text>

        {initialLoading ? (
          <CommentsSkeleton rows={4} />
        ) : (
          <>
            <CommentsList comments={comments} hideButton={true} />
            {/* nút xem thêm */}
            {hasMore ? (
              <View className="items-center py-3 mt-1">
                <Button variant="ghost" className="px-3 py-2" onPress={handleLoadMore} disabled={loadingMore}>
                  {loadingMore ? (
                    <View className="flex-row items-center gap-2">
                      <ActivityIndicator size="small" />
                      <Text>Đang tải...</Text>
                    </View>
                  ) : (
                    <>
                      <Text className="mr-1">Xem thêm</Text>
                      <Ionicons name="chevron-down" size={16} />
                    </>
                  )}
                </Button>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}
