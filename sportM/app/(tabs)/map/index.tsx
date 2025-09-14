import FlatPeekCarousel from '@/components/HomeComponent/FlatPeekCarousel';
import GolfCourseCard from '@/components/HomeComponent/GolfCourseCard';
import MapboxMap from '@/components/Map/Mapbox-map';
import { Dimensions, Text } from 'react-native';
import { Image, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
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
const { width: screenWidth } = Dimensions.get('window');
const GAP = 14;
const CARD_W = Math.round(screenWidth * 0.86);
const PAGE_W = CARD_W + GAP; 
const CARD_H = 258;
export default function SearchScreen() {
  return (
    <View className="flex-1 relative">
      <MapboxMap />
      <View className="absolute z-10 bottom-[24] left-0 right-0 justify-center items-center overflow-visible">
        <Carousel
          width={screenWidth}
          height={CARD_H}
          data={data}
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
      </View>
    </View>
  );
}

const renderItem = ({ item, index }: { item: any; index: number }) => {
  return (
    <View
      className={`flex-1 relative`}
      key={index}
      style={{ paddingHorizontal: GAP / 2 }}
    >
      <GolfCourseCard
        title={item.title}
        pricePerHour={item.pricePerHour}
        rating={item.rating}
        imageUri={item.imageUri}
      />
    </View>
  );
};
