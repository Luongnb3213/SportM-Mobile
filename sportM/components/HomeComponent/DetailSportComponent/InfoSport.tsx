import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text } from 'react-native';
import { View } from 'react-native';

const InfoSport = () => {
  return (
    <View>
      {/* các hàng thông tin */}
      <InfoRow icon="location-outline">
        Lộc Hà, Mai Lâm, Đông Anh, Hà Nội
      </InfoRow>

      <InfoRow icon="time-outline">3:00 - 6:00</InfoRow>

      <InfoRow icon="person-outline">Chủ sân: Nguyễn Đỗ Lâm Anh</InfoRow>

      <InfoRow icon="call-outline">0321456688{'\n'}0321456688</InfoRow>

      {/* tiêu đề + mô tả */}
      <Text className="mt-4 text-base font-semibold">Sân Golf Nem Chua</Text>
      <Text className="mt-2 text-[13.5px] leading-5 text-muted-foreground">
        Đây là sân golf với sử lâu đời vài lớn, rất nhiều người đã thuê sân này
        và một đi không trở lại. Bạn có thể thuê ngay để tìm kho báu của những
        người đi trước. Hơi lắm, thuê đi. Khi bạn tìm dc kho báu thì bạn 30
        chúng tôi 70. Thẻ nhé. Peace out!
      </Text>
    </View>
  );
};

export default InfoSport;

function InfoRow({
  icon,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}) {
  return (
    <View className="my-2 rounded-xl bg-gray-100 px-4 py-3">
      <View className="flex-row items-center gap-2">
        <Ionicons name={icon} size={18} />
        <Text className="text-[15px] text-primary">{children}</Text>
      </View>
    </View>
  );
}
