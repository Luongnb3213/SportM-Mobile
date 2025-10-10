// components/HomeComponent/DetailSportComponent/Comment/CommentsList.tsx
import React from 'react';
import { View } from 'react-native';
import { Comment, CommentItem } from './CommentItem';
import EmptyState from '@/components/ui/EmptyState';

type ListProps = {
  comments: Comment[];
  currentUserId?: string;
  onDeleted?: (id: string) => void;
  onUpdated?: (id: string, patch: Partial<Pick<Comment, 'content' | 'star'>>) => void;
};

export const CommentsList: React.FC<ListProps> = ({ comments, currentUserId, onDeleted, onUpdated }) => {
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
      {comments.map((c) => {
        const isOwner = currentUserId ? currentUserId === c.ownerId : false;
        return (
          <CommentItem
            key={c.id}
            data={c}
            hideButton={!isOwner}
            onDeleted={onDeleted}
            onUpdated={onUpdated}
          />
        );
      })}
    </View>
  );
};
