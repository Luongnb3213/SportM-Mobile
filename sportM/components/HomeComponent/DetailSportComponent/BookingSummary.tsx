import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import InviteFriendsSheet from './InviteFriendsSheet';

type Props = {
  totalHours: number;
  totalPrice: number;
  onCancel: () => void;
  onSubmit: () => void;
  onPressCoupon?: () => void;
  note?: string;
  onChangeNote?: (v: string) => void;
};

const formatVND = (n: number) => `${n.toLocaleString('vi-VN')} VND`;

export default function BookingSummary({
  totalHours,
  totalPrice,
  onCancel,
  onSubmit,
  onPressCoupon,
  note,
  onChangeNote,
}: Props) {
  const [open, setOpen] = React.useState(false);
  return (
    <View className="mx-3 mb-6">
      <Text className="mb-2 text-[20px] font-medium text-[#292929]">
        Ghi chú
      </Text>
      <TextInput
        placeholder="Nhập ghi chú"
        value={note}
        onChangeText={onChangeNote}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        className="h-28 rounded-2xl border border-gray-200 bg-white px-3 py-3 placeholder:text-gray-400"
      />

      <View className="h-4" />

      <TouchableOpacity
        onPress={() => setOpen(true)}
        className="flex-row items-center justify-between"
      >
        <Text className="text-[20px] font-medium text-[#292929]">
          Mời bạn bè
        </Text>
        <AntDesign name="plus" size={24} color="black" />
      </TouchableOpacity>

      <View className="h-4" />
      <Text className="mb-2 text-[20px] font-medium text-[#292929]">
        Thành tiền
      </Text>
      <View className="rounded-xl border border-gray-200 bg-white">
        <View className="flex-row items-center justify-between px-4 py-3">
          <Text className="text-[14px] text-gray-700">Tổng số giờ</Text>
          <Text className="text-[14px] font-medium text-gray-700">
            {totalHours} giờ
          </Text>
        </View>
        <View className="mx-4 border-t border-gray-200" />
        <View className="flex-row items-center justify-between px-4 py-3">
          <Text className="text-[16px] font-extrabold text-[#292929]">
            TỔNG TIỀN
          </Text>
          <Text className="text-[16px] font-semibold text-[#292929]">
            {formatVND(totalPrice)}
          </Text>
        </View>
      </View>

      <View className="mt-4 flex-row gap-3">
        <Pressable
          onPress={onCancel}
          className="flex-1 items-center justify-center rounded-2xl border border-[#1F2757] px-4 py-3"
        >
          <Text className="text-[16px] font-semibold text-[#1F2757]">Hủy</Text>
        </Pressable>
        <Pressable
          onPress={onSubmit}
          className="flex-1 items-center justify-center rounded-2xl bg-[#1F2757] px-4 py-3"
        >
          <Text className="text-[16px] font-semibold text-white">Đặt lịch</Text>
        </Pressable>
      </View>
      <InviteFriendsSheet open={open} onClose={() => setOpen(false)} />
    </View>
  );
}
