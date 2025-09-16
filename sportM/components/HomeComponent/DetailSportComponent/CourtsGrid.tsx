import React from 'react';
import { FlatList, View } from 'react-native';
import CourtColumn from './CourtColumn';

export default function CourtsGrid({
  courts,
  slots,
  selected,
  locked,
  onToggle,
  iconPack,
}: {
  courts: { id: string; name: string }[];
  slots: { id: string; label: string }[];
  selected: Set<string>;
  locked: Set<string>;
  onToggle: (courtId: string, slotId: string) => void;
  iconPack: any;
}) {
  return (
    <FlatList
      horizontal
      data={courts}
      keyExtractor={c => c.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 16 }}
      renderItem={({ item }) => (
        <CourtColumn
          courtName={item.name}
          courtId={item.id}
          slots={slots}
          selected={selected}
          locked={locked}
          onToggle={onToggle}
          Icon={iconPack}
        />
      )}
      // QUAN TRỌNG: không có ScrollView dọc bên trong
      // -> header “Sân X” và các ô luôn đi liền nhau khi cuộn
      ListFooterComponent={<View style={{ width: 4 }} />}
    />
  );
}
