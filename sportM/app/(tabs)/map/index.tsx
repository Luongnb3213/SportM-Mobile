import FlatPeekCarousel from '@/components/HomeComponent/FlatPeekCarousel';
import GolfCourseCard from '@/components/HomeComponent/GolfCourseCard';
import MapboxMap from '@/components/Map/Mapbox-map';
import { useEffect, useState } from 'react';
import { Dimensions, Text } from 'react-native';
import { Image, View } from 'react-native';
import * as Location from 'expo-location';
import Carousel from 'react-native-reanimated-carousel';
import { useAxios } from '@/lib/api';
import { GolfCourseCardSkeleton } from '@/components/Skeleton/GolfCourseCardSkeleton';
import { router } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
type NearByYardProps = {
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

const dataMock = [
  1, 2, 3
]

const { width: screenWidth } = Dimensions.get('window');
const GAP = 14;
const CARD_W = Math.round(screenWidth * 0.86);
const PAGE_W = CARD_W + GAP;
const CARD_H = 258;
export default function SearchScreen() {
  const [listCourt, setListCourt] = useState<NearByYardProps[] | undefined>(undefined);
  const { user } = useAuth();

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
        setListCourt(undefined);
      }
    })();
  }, []);

  useEffect(() => {
    if (!user) {
      router.replace('/authentication')
    }
  }, [])

  return (
    <View className="flex-1 relative">
      <MapboxMap />
      <View className="absolute z-10 bottom-[24] left-0 right-0 justify-center items-center overflow-visible">
        {listCourt ? (
          <Carousel
            width={screenWidth}
            height={CARD_H}
            data={listCourt}
            scrollAnimationDuration={500}
            renderItem={renderItem}
            loop={false}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
            }}
            style={{
              width: screenWidth,
            }}
          />
        ) : (
          <Carousel
            width={screenWidth}
            height={CARD_H}
            data={dataMock}
            scrollAnimationDuration={500}
            renderItem={() => <GolfCourseCardSkeleton />}
            loop={false}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 50,
            }}
            style={{
              width: screenWidth,
            }}
          />
        )}
      </View>
    </View>
  );
}

const renderItem = ({ item, index }: { item: NearByYardProps; index: number }) => {
  return (
    <View
      className={`flex-1 relative`}
      key={index}
    >
      <GolfCourseCard
        title={item.name}
        pricePerHour={item.pricePerHour?.toString()}
        rating={item.avgRating ?? 0}
        imageUri={item.imageUrl || 'https://sportm.vn/static/me/san1.2f6f5f5f.jpg'}
        onPress={() => {
          router.push({
            pathname: '/(tabs)/home/DetailSport',
            params: { courtID: item.id },
          });
        }}
      />
    </View>
  );
};
