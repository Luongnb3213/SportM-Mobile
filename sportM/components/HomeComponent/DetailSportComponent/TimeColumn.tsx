import React from 'react';
import { Text, View } from 'react-native';

export const ROW_HEIGHT = 40;

export default function TimeColumn({
  slots,
}: {
  slots: { id: string; label: string }[];
}) {
  return (
    <View className="mr-3">
      {/* header trống để canh hàng với header của cột sân */}
      <View style={{ height: ROW_HEIGHT }} />
      {slots.map(s => (
        <View
          key={s.id}
          className="justify-center"
          style={{ height: ROW_HEIGHT, marginVertical: 6 }}
        >
          <Text className="text-xs text-muted-foreground">{s.label}</Text>
        </View>
      ))}
    </View>
  );
}
