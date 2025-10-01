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

/** ------------------ Fake data & API ------------------ */
type Booking = {
  id: string;
  name: string;
  bookingId: string;
  dateLabel: string;
  location: string;
};

const ALL_BOOKINGS: Booking[] = Array.from({ length: 37 }).map((_, idx) => ({
  id: String(idx + 1),
  name: 'Sân Gold Nem Chua',
  bookingId: `#JQKA${(1000 + idx).toString()}`,
  dateLabel: 'Thứ 5, ngày 3/6/2036',
  location: idx % 2 === 0 ? 'Mai Lâm, Đông Anh' : 'Long Biên, Hà Nội',
}));

/**
 * Giả lập API: filter theo search (theo name/location),
 * phân trang theo page & limit, có delay.
 */
function mockFetchBookings({
  search = '',
  page = 1,
  limit = 8,
  signal,
}: {
  search?: string;
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}): Promise<{ items: Booking[]; hasMore: boolean }> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      const q = search.trim().toLowerCase();
      const filtered = q
        ? ALL_BOOKINGS.filter(
          (b) =>
            b.name.toLowerCase().includes(q) ||
            b.location.toLowerCase().includes(q) ||
            b.bookingId.toLowerCase().includes(q)
        )
        : ALL_BOOKINGS;

      const start = (page - 1) * limit;
      const end = start + limit;
      const items = filtered.slice(start, end);
      const hasMore = end < filtered.length;

      resolve({ items, hasMore });
    }, 800);

    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
    });
  });
}

/** ------------------ Screen ------------------ */
export default function BookingsScreen() {
  const insets = useSafeAreaInsets();

  // UI states
  const [searchText, setSearchText] = React.useState('');
  const debouncedSearch = useDebounce(searchText, 500);

  const [items, setItems] = React.useState<Booking[]>([]);
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
        const { items: firstPage, hasMore } = await mockFetchBookings({
          search: debouncedSearch,
          page: 1,
          limit: LIMIT,
          signal: ctrl.signal,
        });
        setItems(firstPage);
        setHasMore(hasMore);
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
      const { items: nextItems, hasMore: nextHasMore } = await mockFetchBookings(
        {
          search: debouncedSearch,
          page: nextPage,
          limit: LIMIT,
          signal: ctrl.signal,
        }
      );
      // nếu API trả về rỗng -> không cập nhật page, đồng thời ẩn nút
      if (nextItems.length > 0) {
        setItems((prev) => [...prev, ...nextItems]);
        setPage(nextPage);
        setHasMore(nextHasMore);
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
                {items.map((item) => {
                  return (
                    <TouchableOpacity key={item.id} activeOpacity={0.8}>
                      <View className="flex-row items-start justify-between py-4">
                        {/* Left */}
                        <View className="flex-1 pr-2">
                          <Text className="text-lg font-medium text-[#292929]">
                            {item.name}
                          </Text>
                          <Text className="text-[12px] mt-1 text-muted-foreground">
                            Booking ID: {item.bookingId}
                          </Text>
                        </View>

                        {/* Right */}
                        <View className="items-end">
                          <Badge
                            label={item.dateLabel}
                            className="p-3 py-1 rounded-full bg-muted"
                            labelClasses="text-[11px] text-foreground"
                          />
                          <Text className="mt-2 text-[12px] text-muted-foreground">
                            {item.location}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}

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
