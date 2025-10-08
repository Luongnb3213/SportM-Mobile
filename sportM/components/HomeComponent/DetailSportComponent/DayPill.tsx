// DayPill.tsx
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default function DayPill({
  monthText,
  dayText,
  weekdayText,
  active,
  onPress,
}: {
  monthText: string;   // "TH 9"
  dayText: string;     // "05"
  weekdayText: string; // "T5" | "CN"
  active?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className={`w-[64px] h-[92px] rounded-2xl border items-center justify-between py-2
        ${active ? 'bg-[#E9EDFF] border-[#1F2757]' : 'bg-white border-gray-300'}`}
      style={{ shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6 }}
    >
      <Text className="text-[12px] text-[#1F2757]">{monthText}</Text>
      <Text className="text-[20px] font-extrabold text-[#1F2757]">
        {dayText}
      </Text>
      <Text className="text-[12px] text-[#1F2757]">{weekdayText}</Text>
    </TouchableOpacity>
  );
}
