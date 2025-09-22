import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type Props = { leftLabel: string; rightLabel: string };
export default function SegmentedTwoOptions({ leftLabel, rightLabel }: Props) {
  const [val, setVal] = useState<'left' | 'right'>('left');
  return (
    <View className="w-60 flex-row rounded-full bg-gray-100 p-1">
      <TouchableOpacity
        onPress={() => setVal('left')}
        className={`flex-1 items-center justify-center rounded-full ${
          val === 'left' ? 'bg-gray-900' : ''
        } h-9`}
      >
        <Text
          className={`font-bold ${
            val === 'left' ? 'text-white' : 'text-gray-500'
          }`}
        >
          {leftLabel}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setVal('right')}
        className={`flex-1 items-center justify-center rounded-full ${
          val === 'right' ? 'bg-gray-900' : ''
        } h-9`}
      >
        <Text
          className={`font-bold ${
            val === 'right' ? 'text-white' : 'text-gray-500'
          }`}
        >
          {rightLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
