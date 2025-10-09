import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
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
import { router } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-toast-message';
import { toAmPm } from '@/lib/utils';

const VI_WEEKDAYS = ['CN', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
function formatViShortDate(input: string | number | Date) {
  const d = new Date(input);
  const weekday = VI_WEEKDAYS[d.getDay()];
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${weekday}, ngày ${day}/${month}/${year}`;
}

// Define Booking Statuses and their corresponding icons and display names
const BOOKING_STATUSES = [
  { label: 'Tất cả trạng thái', value: '' },
  { label: 'Chờ thanh toán', value: 'PENDING_DEPOSIT', icon: () => <Ionicons name="time-outline" size={16} color="#FFD700" /> },
  { label: 'Đã xác nhận', value: 'CONFIRMED', icon: () => <Ionicons name="checkmark-circle-outline" size={16} color="#3CB371" /> },
  { label: 'Đã hoàn thành', value: 'COMPLETED', icon: () => <Ionicons name="trophy-outline" size={16} color="#4682B4" /> },
  { label: 'Đã hủy', value: 'CANCELLED', icon: () => <Ionicons name="close-circle-outline" size={16} color="#DC143C" /> },
];

const getStatusIcon = (status: string) => {
  const found = BOOKING_STATUSES.find(s => s.value == status);
  // Khi hiển thị trong danh sách booking, chúng ta vẫn cần trả về JSX.Element trực tiếp
  // Nên sẽ gọi hàm icon() nếu nó tồn tại
  return found?.icon ? found.icon() : null;
};

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
  const [cancelingBookingId, setCancelingBookingId] = React.useState<string | null>(null);

  // Dropdown for status filter
  const [open, setOpen] = React.useState(false);
  const [statusFilter, setStatusFilter] = React.useState<string | null>(null);
  // Định nghĩa lại type cho items trong DropDownPicker nếu cần thiết
  const [statusItems, setStatusItems] = React.useState(BOOKING_STATUSES.map(item => ({
    label: item.label,
    value: item.value,
    icon: item.icon, // icon ở đây là một hàm, đúng với yêu cầu của DropDownPicker
  })));

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
        const statusParam = statusFilter ? `&status=${statusFilter}` : '';
        const { data } = await useAxios.get(`/bookings/my-bookings?page=1&limit=${LIMIT}&search=${debouncedSearch}${statusParam}`, { signal: ctrl.signal });
        setItems(data.data?.items);
        setHasMore(data.data?.items?.length > 0);
      } catch (e) {
        // bỏ qua nếu bị abort
        console.log("Fetch bookings aborted or failed:", e);
      } finally {
        setLoadingInitial(false);
      }
    })();

    return () => ctrl.abort();
  }, [debouncedSearch, statusFilter]); // Re-fetch when statusFilter changes

  const onLoadMore = React.useCallback(async () => {
    if (loadingMore || !hasMore) return;

    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const statusParam = statusFilter ? `&status=${statusFilter}` : '';
      const { data } = await useAxios.get(`/bookings/my-bookings?page=${nextPage}&limit=${LIMIT}&search=${debouncedSearch}${statusParam}`, { signal: ctrl.signal });
      if (data.data?.items?.length > 0) {
        setItems((prev) => [...prev, ...data.data.items]);
        setPage(nextPage);
        setHasMore(data.data.items?.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      // bỏ qua nếu bị abort
      console.log("Load more bookings aborted or failed:", e);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, page, debouncedSearch, statusFilter]);

  const handleCancelBooking = React.useCallback(async (bookingId: string) => {
    setCancelingBookingId(bookingId);
    try {
      await useAxios.patch(`/bookings/${bookingId}/cancel-by-user`);
      Toast.show({
        type: 'success',
        text1: 'Hủy đặt sân thành công!',
        text2: `Booking ID #${bookingId} đã được hủy.`,
      });
      // Trigger re-fetch after successful cancellation
      // By setting statusFilter to its current value, we ensure useEffect runs
      setStatusFilter('CANCELLED');
    } catch (error: any) {
      console.error('Lỗi khi hủy đặt sân:', error);
      Toast.show({
        type: 'error',
        text1: 'Hủy đặt sân thất bại!',
        text2: error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.',
      });
    } finally {
      setCancelingBookingId(null);
    }
  }, [statusFilter]);


  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1 bg-background">
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

        <View className="bg-primary px-5 py-5" style={Platform.OS === 'android' ? { zIndex: 10 } : { zIndex: 9999 }}>
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-medium text-primary-foreground">
              Tất cả sân đã đặt
            </Text>
            <View className="w-[180px]">
              <DropDownPicker
                open={open}
                value={statusFilter}
                items={statusItems} // items giờ đã có icon là hàm
                setOpen={setOpen}
                setValue={setStatusFilter}
                setItems={setStatusItems}
                placeholder="Trạng thái"
                style={{
                  backgroundColor: 'white',
                  borderColor: 'transparent',
                  borderRadius: 10,
                  minHeight: 40,
                }}
                textStyle={{
                  fontSize: 14,
                  color: '#0a0a0a',
                }}
                dropDownContainerStyle={{
                  backgroundColor: 'white',
                  borderColor: '#ccc',
                  borderRadius: 10,
                }}
                ArrowDownIconComponent={({ style }) => <Ionicons name="chevron-down" size={20} color="#0a0a0a" />}
                ArrowUpIconComponent={({ style }) => <Ionicons name="chevron-up" size={20} color="#0a0a0a" />}
              />
            </View>
          </View>
        </View>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 150 }}
          extraKeyboardSpace={0}
        >
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
                description="Hiện chưa có lượt đặt nào với trạng thái này."
              />
            ) : (
              <>
                {items.map((item, i) => (
                  <View key={`group-${i}`}>
                    {item?.bookings?.map((b: any, j: number) => (
                      <React.Fragment key={b?.bookingId ?? `${i}-${j}`}>
                        <TouchableOpacity
                          onPress={() => {
                            router.push({
                              pathname: '/(tabs)/home/DetailSport',
                              params: { courtID: b?.courtId },
                            })
                          }}
                          activeOpacity={0.8}
                        >
                          <View className="flex-row items-start justify-between py-4 gap-3">
                            {/* Left */}
                            <View className="flex-1 pr-2">
                              <View className="flex-row items-center">
                                <Text>
                                  {getStatusIcon(b?.status)} {/* Vẫn gọi hàm ở đây */}
                                </Text>
                                <Text className="text-lg font-semibold text-[#292929] ml-2">
                                  {b?.court?.courtName || '—'}
                                </Text>
                              </View>
                              <Text className="text-[12px] mt-1 text-muted-foreground">
                                Booking ID: {b?.bookingId ? `#${b.bookingId}` : '—'}
                              </Text>
                              <Text className="text-[12px] mt-1 text-muted-foreground capitalize">
                                Trạng thái: {BOOKING_STATUSES.find(s => s.value === b?.status)?.label || b?.status || '—'}
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
                               <Text
                                numberOfLines={1}
                                className="mt-2 text-[12px] text-muted-foreground text-right"
                              >
                                {toAmPm(b?.startTime)} - {toAmPm(b?.endTime)}
                              </Text>

                              {/* Nút hủy chỉ hiển thị khi trạng thái là PENDING_DEPOSIT */}
                              {b?.status === 'PENDING_DEPOSIT' && (
                                <Button
                                  variant="destructive"
                                  className="mt-3 px-3 py-1 rounded-full"
                                  onPress={() => handleCancelBooking(item?.orderId)}
                                  disabled={cancelingBookingId === b?.bookingId}
                                >
                                  {cancelingBookingId === b?.bookingId ? (
                                    <ActivityIndicator color="white" />
                                  ) : (
                                    <Text className="text-white text-[11px] font-medium">Hủy đặt sân</Text>
                                  )}
                                </Button>
                              )}
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
        <Toast />
      </SafeAreaView>
    </KeyboardProvider>
  );
}