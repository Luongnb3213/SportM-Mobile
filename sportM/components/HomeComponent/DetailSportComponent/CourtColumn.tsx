import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ROW_HEIGHT } from './TimeColumn';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { cn } from '@/lib/utils';

type IconType = React.ComponentType<{
  name: any;
  size?: number;
  color?: string;
}>;

// Slot now has an ID like '0100-0200'
type Slot = { id: string; label: string };

export default function CourtColumn({
  courtName,
  courtId,
  timeSlots, // These are the generic slots with IDs like '0100-0200'
  selected,
  locked,
  onToggle,
  Icon,
}: {
  courtName: string;
    courtId: string; // 'am' or 'pm'
    timeSlots: Slot[]; // Generic time slots (e.g., 0100-0200, 0200-0300, ...)
    selected: Set<string>; // Contains full keys: 'am_slot-0100-0200'
    locked: Set<string>;   // Contains full keys: 'pm_slot-0100-0200'
    onToggle: (courtId: string, timeSlotId: string) => void; // timeSlotId is '0100-0200'
  Icon: IconType;
}) {
  return (
    <View className="mr-3 w-32">
      {/* HEADER của cột sân nằm CHUNG item */}
      <View
        className="items-center justify-center rounded-md bg-muted"
        style={{ height: ROW_HEIGHT }}
      >
        <Text className="text-sm font-medium text-foreground">{courtName}</Text>
      </View>

      {timeSlots.map((s) => { // Iterate through the generic time slots
        // The key for a specific bookable slot is a combination of courtId and generic slot id
        // e.g., 'am_slot-0100-0200' or 'pm_slot-0100-0200'
        const key = `${courtId}_slot-${s.id}`; 
        const isLocked = locked.has(key);
        const isSelected = selected.has(key);

        return (
          <Pressable
            key={s.id} // Use s.id here for React key, as it's unique for each time row
            disabled={isLocked}
            onPress={() => onToggle(courtId, s.id)} // Pass the generic slot ID to onToggle
            className={cn(
              'rounded-full border',
              isLocked
                ? 'border-muted bg-muted'
                : 'border-input bg-white dark:bg-card',
              isSelected && 'bg-primary border-primary'
            )}
            style={{ height: ROW_HEIGHT, marginVertical: 6 }}
          >
            <View className="h-full items-center justify-center">
              {isLocked ? (
                <Icon name="lock-outline" size={16} />
              ) : isSelected ? (
                <Entypo name="check" size={16} color="white" />
              ) : (
                <Text className="text-transparent">•</Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}