import React from 'react';
import { View } from 'react-native';
import { Comment, CommentItem } from './CommentItem';


type ListProps = {
  comments: Comment[];
  hideButton?: boolean;
};
export const CommentsList: React.FC<ListProps> = ({ comments, hideButton = false }) => {
  return (
    <View className="py-2">
      {comments.map((c) => (
        <CommentItem hideButton={hideButton} key={c.id} data={c} />
      ))}
    </View>
  );
};