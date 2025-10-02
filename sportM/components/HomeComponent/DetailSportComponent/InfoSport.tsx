// InfoOwnerSport.tsx
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';

type CourtDTO = {
  courtId: string;
  courtName: string;
  courtImages: string[];
  address: string;
  description: string;
  subService: string;
  isActive: boolean;
  pricePerHour: number;
  sportType?: { typeName?: string };
  avgRating: number;
  lat?: number;
  lng?: number;
  owner?: {
    fullName?: string;
    phoneNumber?: string;
    avatarUrl?: string;
  };
};

const InfoSport = ({ court }: { court?: CourtDTO }) => {
const openInMaps = (address?: string, lat?: number, lng?: number) => {
  let url = '';
  if (lat != null && lng != null) {
    url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  } else if (address) {
    url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  }

  if (url) {
    Linking.openURL(url).catch(err => console.error('Error opening maps', err));
  }
};
  const priceText =
    typeof court?.pricePerHour === 'number'
      ? `${court.pricePerHour.toLocaleString('vi-VN')} VND`
      : '—';

  return (
    <View>
      <TouchableOpacity
         onPress={() => openInMaps(court?.address, court?.lat, court?.lng)}
      >
        <InfoRow icon="location-outline">
          {court?.address || '—'}
        </InfoRow>
      </TouchableOpacity>

      <InfoRow icon="wallet">{priceText}</InfoRow>

      <InfoRow icon="person-outline">
        Chủ sân: {court?.owner?.fullName || '—'}
      </InfoRow>

      <InfoRow icon="call-outline">
        {court?.owner?.phoneNumber || '—'}
      </InfoRow>

      {court?.sportType?.typeName ? (
        <InfoRow icon="fitness-outline">
          Môn: {court.sportType.typeName}
        </InfoRow>
      ) : null}


      <Text className="mt-4 text-base font-semibold">
        {court?.courtName || '—'}
      </Text>
      <Text className="mt-2 text-[13.5px] leading-5 text-muted-foreground">
        {court?.description || 'Chưa có mô tả.'}
      </Text>


      {court?.subService ? (
        <Text className="mt-3 text-[13.5px] text-primary">
          Dịch vụ: {court.subService}
        </Text>
      ) : null}
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
