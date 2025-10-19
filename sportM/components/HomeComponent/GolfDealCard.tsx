import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import NearByYard from './NearByYard';
import FlatPeekCarousel from './FlatPeekCarousel';
import { NearByYardSkeleton } from '../Skeleton/NearByYardSkeleton';
import { useAxios } from '@/lib/api';
import * as Location from 'expo-location';
import { formatPriceVND } from '@/lib/utils';
import EmptyState from '../ui/EmptyState';

type GolfDealCardProps = {
  heading?: string; // “Gợi ý cho bạn”
  title: string;    // “Trải nghiệm…”
};

// Kiểu dữ liệu sân gần đây từ API near-by (ví dụ bạn đưa)
type CourtItem = {
  id: string;
  name: string;
  pricePerHour: number;
  avgRating: number | null;
  imageUrl: string | null;
  address?: string;
  distance?: number;
  latitude?: number;
  longitude?: number;
};

export default function GolfDealCard({
  heading = 'Gợi ý cho bạn',
  title,
}: GolfDealCardProps) {
  const [listCourt, setListCourt] = React.useState<CourtItem[] | undefined>();

  useEffect(() => {
    (async () => {
      try {
        const perm = await Location.getForegroundPermissionsAsync();
        if (perm.status !== 'granted') return;

        const loc = await Location.getCurrentPositionAsync({});
        const { data } = await useAxios.get(
          `/courts/near-by?lat=${loc?.coords.latitude}&lng=${loc?.coords.longitude}`
        );
        setListCourt(Array.isArray(data?.data) ? data.data : []);
      } catch (error) {
        console.log('error', error);
        setListCourt([]); // fallback để không crash UI
      }
    })();
  }, []);

  // Skeleton items để hiển thị lúc đầu load
  const skeletonItems = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

  const hasCourts = Array.isArray(listCourt) && listCourt.length > 0;
  const isLoading = typeof listCourt === 'undefined';

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
        {isLoading ? (
          // Lúc đầu load: skeleton
          <FlatPeekCarousel
            data={skeletonItems}
            itemsPerView={2.1}
            aspectRatio={16 / 9}
            renderItem={({ item }) => <NearByYardSkeleton key={String(item.id)} />}
          />
        ) : hasCourts ? (
          // Có dữ liệu thật
          <FlatPeekCarousel
            data={listCourt}
            itemsPerView={2.1}
            aspectRatio={16 / 9}
            renderItem={({ item }) => (
              <NearByYard
                courtId={item?.id}
                key={item?.id}
                title={item?.name || ''}
                pricePerHour={formatPriceVND(item?.pricePerHour)}
                  rating={item?.avgRating ?? 0}
                  imageUri={
                    item?.imageUrl ||
                    'https://images.unsplash.com/photo-150287733855-766e1452684a?q=80&w=1600'
                  }
                  location={item?.address}
                />
              )}
            />
          ) : (
            // Không có sân gần nhất
            <EmptyState
              icon="golf-outline"
              title="Chưa có sân nào gần nhất"
              description="Hiện chưa có sân nào gần nhất."
            />
        )}
      </View>
    </View>
  );
}
