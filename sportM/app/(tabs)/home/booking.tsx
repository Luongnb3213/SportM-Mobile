import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import {
  KeyboardAwareScrollView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import HeaderUser from '@/components/ui/HeaderUser';
import { useDebounce } from '@/hooks/useDebounce';
import EmptyState from '@/components/ui/EmptyState';
import { useAxios } from '@/lib/api';

const VI_WEEKDAYS = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
function formatViShortDate(input: string | number | Date) {
  const d = new Date(input);
  const weekday = VI_WEEKDAYS[d.getDay()];
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${weekday}, ngày ${day}/${month}/${year}`;
}
/** ------------------ Screen ------------------ */
export default function BookingsScreen() {
  const insets = useSafeAreaInsets();

  // UI states
  const [searchText, setSearchText] = React.useState('');
  const debouncedSearch = useDebounce(searchText, 500);

  const [items, setItems] = React.useState<any[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(false);

  const [loadingInitial, setLoadingInitial] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);

  const LIMIT = 8;
  const ctrlRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    (async () => {
      try {
        setLoadingInitial(true);
        setPage(1);
        const { data } = await useAxios.get(`/bookings/my-bookings?page=1&limit=${LIMIT}&search=${debouncedSearch}`, { signal: ctrl.signal });
        console.log('Fetched bookings:', JSON.stringify(data.data?.items));
        setItems(data.data?.items);
        setHasMore(data.data?.items?.length > 0);
      } catch (e) {
        // bỏ qua nếu bị abort
      } finally {
        setLoadingInitial(false);
      }
    })();

    return () => ctrl.abort();
  }, [debouncedSearch]);

  const onLoadMore = React.useCallback(async () => {
    if (loadingMore || !hasMore) return;

    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const { data } = await useAxios.get(`/bookings/my-bookings?page=${page}&limit=${LIMIT}&search=${debouncedSearch}`, { signal: ctrl.signal });
      if (data.data?.items?.length > 0) {
        setItems((prev) => [...prev, ...data.data.items]);
        setPage(nextPage);
        setHasMore(data.data.items?.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      // bỏ qua nếu bị abort
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page, debouncedSearch]);

  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1 bg-background">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 150 }}
          extraKeyboardSpace={0}
        >
          <View className="px-4">
            <HeaderUser />
            {/* Search */}
            <View className="flex-row px-4 items-center bg-white rounded-xl h-20 mb-4">
              <Feather name="search" size={25} color="#0a0a0a" />
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Nhập địa điểm / tên sân / Booking ID"
                placeholderTextColor="#000000"
                className="flex-1 text-lg text-black px-2"
                returnKeyType="search"
              />
            </View>
          </View>

          {/* Top bar */}
          <View className="bg-primary px-5 py-5">
            <Text className="text-2xl font-medium text-primary-foreground">
              Tất cả sân đã đặt
            </Text>
          </View>

          {/* Content */}
          <Card
            className="m-4 bg-background rounded-2xl overflow-hidden"
            style={{ borderWidth: 0 }}
          >
            {/* Loading initial */}
            {loadingInitial ? (
              Array.from({ length: 4 }).map((_, i) => (
                <View key={i} className="py-4">
                  <View className="h-5 w-80 bg-muted rounded mb-2" />
                  <View className="h-3 w-96 bg-muted rounded" />
                </View>
              ))
            ) : items.length === 0 ? (
              <EmptyState
                icon="golf-outline"
                title="Chưa có lượt đặt nào"
                description="Hiện chưa có lượt đặt nào."
              />
            ) : (
              <>
                {items.map((item, i) => (
                  <View key={`group-${i}`}>
                    {item?.bookings?.map((b: any, j: number) => (
                      <React.Fragment key={b?.bookingId ?? `${i}-${j}`}>
                        <TouchableOpacity activeOpacity={0.8}>
                          <View className="flex-row items-start justify-between py-4 gap-3">
                            {/* Left */}
                            <View className="flex-1 pr-2">
                              <Text className="text-lg font-semibold text-[#292929]">
                                {b?.court?.courtName || '—'}
                              </Text>
                              <Text className="text-[12px] mt-1 text-muted-foreground">
                                Booking ID: {b?.bookingId ? `#${b.bookingId}` : '—'}
                              </Text>
                            </View>

                            {/* Right */}
                            <View className="items-end max-w-[48%]">
                              <Badge
                                label={formatViShortDate(b?.bookingDate)}
                                className="px-3 py-1 rounded-full bg-transparent border border-[#1F2257]"
                                labelClasses="text-[11px] text-[#1F2257] font-medium"
                              />
                              <Text
                                numberOfLines={1}
                                className="mt-2 text-[12px] text-muted-foreground text-right"
                              >
                                {b?.court?.address || '—'}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>

                        {/* Divider giữa các booking */}
                        <View className="h-[1px] bg-black/5" />
                      </React.Fragment>
                    ))}
                  </View>
                ))}

                {/* Load more */}
                {hasMore ? (
                  <View className="items-center py-3">
                    {loadingMore ? (
                      <View className="px-3 py-2 flex-row items-center">
                        <ActivityIndicator />
                        <Text className="ml-2">Đang tải...</Text>
                      </View>
                    ) : (
                      <Button
                        variant="ghost"
                        className="px-3 py-2"
                        onPress={onLoadMore}
                      >
                        <Text className="mr-1">Xem thêm</Text>
                        <Ionicons name="chevron-down" size={16} />
                      </Button>
                    )}
                  </View>
                ) : null}
              </>
            )}
          </Card>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardProvider>
  );
}
