// components/RatingCard.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Card, CardContent, CardFooter } from '@/components/Card';
import { Input } from '@/components/Input';
import Button from '@/components/Button';
import Toast from 'react-native-toast-message';
import { useAxios } from '@/lib/api';
import { CommentsList } from '../HomeComponent/DetailSportComponent/Comment/CommentsList';
import { Comment } from '../HomeComponent/DetailSportComponent/Comment/CommentItem';


const fakeComments: Comment[] = [
  {
    id: 'c1',
    authorName: 'Nguyễn Văn A',
    avatarUri: 'https://i.pravatar.cc/100?img=1',
    content: 'Sân đẹp, rộng rãi lắm mọi người!',
    createdAt: new Date(Date.now() - 1000 * 60 * 2), // 2 phút trước
  },
  {
    id: 'c2',
    authorName: 'Trần Thị B',
    avatarUri: 'https://i.pravatar.cc/100?img=5',
    content: 'Mình thấy đèn hơi tối một chút.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 giờ trước
  },
  {
    id: 'c3',
    authorName: 'Lê Văn C',
    content: 'Anh chủ sân nhiệt tình, sẽ quay lại lần sau.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 ngày trước
  },
  {
    id: 'c4',
    authorName: 'Trần Thị E',
    avatarUri: 'https://i.pravatar.cc/100?img=5',
    content: 'Mình thấy đèn hơi tối một chút.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 giờ trước
  },
  {
    id: 'c5',
    authorName: 'Lê Văn F',
    content: 'Anh chủ sân nhiệt tình, sẽ quay lại lần sau.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 ngày trước
  },
];

export default function RatingCourtCard({
  title = 'Đánh giá sân Golf Nem Chua',
  onChange,
  courtID,
}: {
  title?: string;
  onChange?: (rating: number, note: string) => void;
  courtID: string;
}) {
  const [rating, setRating] = useState<number>(3);
  const [note, setNote] = useState<string>('');
  const [ratingArray, setRatingArray] = useState<Comment[]>(fakeComments);
  const handleRate = (n: number) => {
    setRating(n);
    onChange?.(n, note);
  };

  useEffect(() => {
    (async () => {
      return;
      try {
        const { data } = await useAxios.get(`/rating/${courtID}`);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    })();
  }, []);

  const handleSubmitRating = async () => {
    try {
      const { data } = await useAxios.post('/rating', {
        courtId: courtID,
        star: rating,
        content: note.trim(),
      });
      Toast.show({
        type: 'success',
        text1: 'Thành công',
        text2: 'Cảm ơn bạn đã gửi đánh giá!',
      });
    } catch (error) {
      console.error('Error submitting rating:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Đã có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.',
      });
    }
  };

  return (
    <View>
      {ratingArray?.length > 0 ? (
        <ScrollView
          className="mx-3 rounded-2xl p-4 bg-[#EEE] overflow-hidden"
          style={{ maxHeight: 400 }}
          contentContainerStyle={{ paddingBottom: 16 }}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
        >
          <Text className="text-xl font-extrabold mb-2 text-primary">{title}</Text>
          <CommentsList comments={ratingArray} />
        </ScrollView>
      ) : (
        <View>
          <Card className="m-3 rounded-2xl p-4 bg-[#EEE]">
            <CardContent className="p-0">
              {/* Title + subtitle */}
              <Text className="text-xl font-extrabold text-primary">
                {title}
              </Text>
              <Text className="mt-2 text-[13.5px] leading-5 text-muted-foreground">
                Sau khi trải nghiệm sân, bạn có cảm thấy liệu yêu cầu của bạn đã
                được thỏa mãn chưa?
              </Text>

              {/* Stars */}
              <View className="mt-4 flex-row items-center gap-3">
                {Array.from({ length: 5 }).map((_, i) => {
                  const idx = i + 1;
                  const active = idx <= rating;
                  return (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleRate(idx)}
                      hitSlop={8}
                    >
                      <Ionicons
                        name={active ? 'star' : 'star-outline'}
                        size={28}
                        color={active ? '#F59E0B' : '#94A3B8'}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Comment box */}
              <Text className="mt-5 text-[13.5px] font-semibold text-primary">
                Nhập nhận xét của bạn tại đây (Optional)
              </Text>
              <TextInput
                placeholder="Nhập nhận xét"
                multiline
                value={note}
                onChangeText={(t) => {
                  setNote(t);
                  onChange?.(rating, t);
                }}
                className="mt-2 min-h-[140px] rounded-2xl bg-white text-[15px]"
                editable
                numberOfLines={4}
                style={{ textAlignVertical: 'top', padding: 12 }}
              />
            </CardContent>
          </Card>
          <Button
            className="mx-3 rounded-2xl"
            textClassName="text-base"
            onPress={handleSubmitRating}
          >
            Xác nhận
          </Button>
        </View>
      )}
    </View>
  );
}
