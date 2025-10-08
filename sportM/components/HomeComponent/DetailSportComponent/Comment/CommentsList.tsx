// components/HomeComponent/DetailSportComponent/Comment/CommentsList.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Comment, CommentItem } from './CommentItem';
import EmptyState from '@/components/ui/EmptyState';

type ListProps = {
  comments: Comment[];
  hideButton?: boolean;
};

export const CommentsList: React.FC<ListProps> = ({ comments, hideButton = false }) => {
  if (!comments || comments.length === 0) {
    return (
      <View className="py-3">
        <EmptyState
          icon="golf-outline"
          title="Chưa có lượt feedback"
          description="Hiện chưa có lượt feedback nào."
        />
      </View>
    );
  }

  return (
    <View className="py-2">
      {comments.map((c) => (
        <CommentItem hideButton={hideButton} key={c.id} data={c} />
      ))}
    </View>
  );
};
