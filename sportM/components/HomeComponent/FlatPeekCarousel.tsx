
import type React from 'react';
import { useMemo } from 'react';
import { Dimensions, FlatList, TouchableOpacity, View } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type Item = {
  id: string | number;
  [key: string]: any;
};

type RenderItemParams<T> = {
  item: T;
};

type Props<T extends Item> = {
  data: T[] | undefined | null;
  onPressItem?: (item: T) => void;
  itemsPerView?: number; // số item full trên màn hình (mặc định 2)
  peekFraction?: number; // phần "lấp ló" của item tiếp theo (0.2 = 20%)
  spacing?: number; // khoảng cách giữa các item
  aspectRatio?: number; // w/h (mặc định 13/9 => thẻ cao)
  renderItem?: (params: RenderItemParams<T>) => React.ReactNode;
};

export default function FlatPeekCarousel<T extends Item>({
  data,
  onPressItem,
  itemsPerView = 2,
  peekFraction = 0.2,
  spacing = 12,
  aspectRatio = 13 / 9,
  renderItem: customRenderItem,
}: Props<T>) {
  const safeData = Array.isArray(data) ? data : [];

  const { cardWidth, cardHeight, snap, sidePad } = useMemo(() => {
    // cardWidth * (itemsPerView + peekFraction) + spacing*(itemsPerView-1) = SCREEN_WIDTH
    const cardW =
      (SCREEN_WIDTH - spacing * (itemsPerView - 1)) /
      (itemsPerView + peekFraction);
    const cardH = Math.round(cardW / (1 / aspectRatio));
    const snapTo = Math.round(cardW + spacing);
    // pad hai bên để 2 item nằm giữa, vẫn còn "peek" ở bên phải
    const totalRowWidth = cardW * itemsPerView + spacing * (itemsPerView - 1);
    const pad = Math.max(0, (SCREEN_WIDTH - totalRowWidth) / 2);
    return {
      cardWidth: Math.round(cardW),
      cardHeight: cardH,
      snap: snapTo,
      sidePad: Math.round(pad),
    };
  }, [itemsPerView, peekFraction, spacing, aspectRatio]);

  const renderFlatListItem = ({ item }: { item: T }) => {
    const onPress = () => onPressItem?.(item);

    const content = customRenderItem
      ? customRenderItem({
          item,
        })
      : null;

    return (
      <TouchableOpacity
        style={{ width: cardWidth, marginRight: spacing, height: cardHeight }}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {content}
      </TouchableOpacity>
    );
  };

  return (
    <View className="w-full">
      <FlatList
        horizontal
        data={safeData}
        keyExtractor={(it: any, idx) => String(it?.id ?? idx)}
        renderItem={renderFlatListItem}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={snap}
        contentContainerStyle={{ paddingLeft: 0, paddingRight: sidePad }}
      />
    </View>
  );
}
