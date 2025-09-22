import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type Props = {
  thu: string;
  day: string;
  suffix: string;
  active?: boolean;
  onPress?: () => void;
};
export default function DayPill({ thu, day, suffix, active, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
      <View
        className={
          'h-[86px] w-[74px] items-center justify-between rounded-[14px] border px-0 py-2 ' +
          (active
            ? 'border-[#1F2757] bg-[#1F2757]'
            : 'border-[#DFE5F1] bg-white')
        }
      >
        <Text
          className={
            'text-[12px] font-semibold ' +
            (active ? 'text-[#DDE3FF]' : 'text-gray-500')
          }
        >
          {thu}
        </Text>
        <Text
          className={
            'text-[20px] font-extrabold ' +
            (active ? 'text-white' : 'text-gray-900')
          }
        >
          {day}
        </Text>
        <Text
          className={
            'text-[12px] font-semibold ' +
            (active ? 'text-[#DDE3FF]' : 'text-gray-500')
          }
        >
          {suffix}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
