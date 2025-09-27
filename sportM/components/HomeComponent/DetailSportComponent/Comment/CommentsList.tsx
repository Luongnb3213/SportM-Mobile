import React from 'react';
import { View } from 'react-native';
import { Comment, CommentItem } from './CommentItem';


type ListProps = {
  comments: Comment[];
};
export const CommentsList: React.FC<ListProps> = ({ comments}) => {
  return (
    <View className="py-2">
      {comments.map((c) => (
        <CommentItem key={c.id} data={c} />
      ))}
    </View>
  );
};