import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { ROW_HEIGHT } from './TimeColumn';

type IconType = React.ComponentType<{
  name: any;
  size?: number;
  color?: string;
}>;

export default function CourtColumn({
  courtName,
  courtId,
  slots,
  selected,
  locked,
  onToggle,
  Icon,
}: {
  courtName: string;
  courtId: string;
  slots: { id: string; label: string }[];
  selected: Set<string>;
  locked: Set<string>;
  onToggle: (courtId: string, slotId: string) => void;
  Icon: IconType;
}) {
  return (
    <View className="w-24 mr-3">
      {/* HEADER của cột sân nằm CHUNG item */}
      <View
        className="items-center justify-center rounded-md bg-muted"
        style={{ height: ROW_HEIGHT }}
      >
        <Text className="text-sm font-medium text-foreground">{courtName}</Text>
      </View>

      {slots.map(s => {
        const key = `${courtId}_${s.id}`;
        const isLocked = locked.has(key);
        const isSelected = selected.has(key);

        return (
          <Pressable
            key={s.id}
            disabled={isLocked}
            onPress={() => onToggle(courtId, s.id)}
            className={[
              'rounded-full border',
              isLocked ? 'border-muted bg-muted' : 'border-input bg-white dark:bg-card',
              isSelected && 'bg-primary border-primary',
            ].join(' ')}
            style={{ height: ROW_HEIGHT, marginVertical: 6 }}
          >
            <View className="h-full items-center justify-center">
              {isLocked ? (
                <Icon name="lock-outline" size={16} />
              ) : isSelected ? (
                <Icon name="check" size={18} color="white" />
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
