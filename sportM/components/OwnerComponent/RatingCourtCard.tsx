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
      <ScrollView
        className="mx-3 rounded-2xl p-4 bg-[#EEE] overflow-hidden"
        style={{ maxHeight: 400 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-xl font-extrabold mb-2 text-primary">{title}</Text>
        <CommentsList comments={ratingArray} hideButton={true} />

        <View className="items-center py-3 mt-3">
          <Button
            variant="ghost"
            className="px-3 py-2"
          >
            <Text className="mr-1">Xem thêm</Text>
            <Ionicons name="chevron-down" size={16} />
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}
