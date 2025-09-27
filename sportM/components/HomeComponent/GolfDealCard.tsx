import React from 'react';
import { Image, View, Text, Dimensions } from 'react-native';
import NearByYard from './NearByYard';
import FlatPeekCarousel from './FlatPeekCarousel';

type GolfDealCardProps = {
  heading?: string; // “HÃY ĐẶT SÂN VỚI CHÚNG TÔI”
  title: string; // “Trải nghiệm…”
};

type NearByYardProps = {
  id: string | number;
  title: string;
  pricePerHour: string; // "1.000.000/ giờ"
  rating: number | string; // 4.5
  imageUri: string;
  location?: string; // "Hà Nội"
};

const data: NearByYardProps[] = [
  {
    id: 1,
    title: 'Bíc cờ bôn',
    pricePerHour: '1.000.000/ giờ',
    rating: 4.5,
    imageUri:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600',
    location: 'Hà Nội',
  },
  {
    id: 2,
    title: 'Sân golf xanh',
    pricePerHour: '1.200.000/ giờ',
    rating: 4.7,
    imageUri:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600',
    location: 'Đà Nẵng',
  },
  {
    id: 3,
    title: 'Sân golf tím',
    pricePerHour: '1.500.000/ giờ',
    rating: 4.9,
    imageUri:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600',
    location: 'Hà Nội',
  },
  {
    id: 4,
    title: 'Sân golf cam',
    pricePerHour: '1.800.000/ giờ',
    rating: 4.8,
    imageUri:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600',
    location: 'Hồ Chí Minh',
  },
  {
    id: 5,
    title: 'Sân golf đỏ',
    pricePerHour: '2.000.000/ giờ',
    rating: 5.0,
    imageUri:
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600',
    location: 'Hà Nội',
  },
];

export default function GolfDealCard({
  heading = 'Gợi ý cho bạn',
  title,
}: GolfDealCardProps) {
  return (
    <View className="px-4 pr-0">
      {/* Heading nhỏ */}
      <View className="mb-2 flex-row items-center">
        <Text className="text-base tracking-wide text-muted-foreground">
          {heading}
        </Text>
      </View>

      {/* Tiêu đề lớn */}
      <Text className="text-3xl font-bold leading-snug text-primary mb-4">
        {title}
      </Text>

      <View>
        <FlatPeekCarousel
          data={data}
          itemsPerView={2.1}
          aspectRatio={16 / 9}
          renderItem={({ item }) => (
            <NearByYard
              title={item.title}
              pricePerHour={item.pricePerHour}
              rating={item.rating}
              imageUri={item.imageUri}
              location={item.location}
            />
          )}
        />
      </View>
    </View>
  );
}
