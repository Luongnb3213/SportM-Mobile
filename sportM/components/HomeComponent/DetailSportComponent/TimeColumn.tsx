import React from 'react';
import { Text, View } from 'react-native';

export const ROW_HEIGHT = 40;

// Slot now has an ID like '0100-0200'
type Slot = { id: string; label: string };

export default function TimeColumn({
  timeSlots, // Now expects a single array of generic time slots
}: {
    timeSlots: Slot[]; // Generic time slots (e.g., 01:00-02:00, 02:00-03:00, ...)
}) {
  return (
    <View className="mr-3">
      {/* header trống để canh hàng với header của cột sân */}
      <View style={{ height: ROW_HEIGHT }} />
      {timeSlots.map(s => (
        <View
          key={s.id} // Use s.id here, which is '0100-0200'
          className="justify-center"
          style={{ height: ROW_HEIGHT, marginVertical: 6 }}
        >
          <Text className="text-xs text-muted-foreground">{s.label}</Text>
        </View>
      ))}
    </View>
  );
}