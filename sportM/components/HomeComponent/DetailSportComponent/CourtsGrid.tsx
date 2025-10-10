import React from 'react';
import { FlatList, View } from 'react-native';
import CourtColumn from './CourtColumn';

// Slot now has an ID like '0100-0200'
type Slot = { id: string; label: string };

export default function CourtsGrid({
  courts,
  timeSlots, // Now receives a single set of generic time slots
  selected,
  locked,
  onToggle,
  iconPack,
}: {
  courts: { id: string; name: string }[];
    timeSlots: Slot[]; // Generic time slots for all columns
    selected: Set<string>; // Contains full keys: 'am_slot-0700-0800'
    locked: Set<string>;   // Contains full keys: 'pm_slot-0700-0800'
    onToggle: (courtId: string, timeSlotId: string) => void; // timeSlotId is '0700-0800'
  iconPack: any;
}) {

  return (
    <FlatList
      horizontal
      data={courts}
      keyExtractor={c => c.id}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 16 }}
      extraData={{ selected, locked, timeSlots }} 
      renderItem={({ item }) => (
        <CourtColumn
          courtName={item.name}
          courtId={item.id}
          timeSlots={timeSlots} // Pass the same generic time slots to each column
          selected={selected}
          locked={locked}
          onToggle={onToggle}
          Icon={iconPack}
        />
      )}
      ListFooterComponent={<View style={{ width: 4 }} />}
    />
  );
}