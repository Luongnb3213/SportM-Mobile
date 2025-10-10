import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Platform,
    Alert
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
import HeaderUser from '@/components/ui/HeaderUser'; // Keep HeaderUser if it's generic, or replace with an owner-specific header
import { useDebounce } from '@/hooks/useDebounce';
import EmptyState from '@/components/ui/EmptyState';
import { useAxios } from '@/lib/api';
import { router, useLocalSearchParams } from 'expo-router'; // Import useLocalSearchParams
import DropDownPicker from 'react-native-dropdown-picker';
import Toast from 'react-native-toast-message';
import { getErrorMessage, toAmPm } from '@/lib/utils';

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
    return found?.icon ? found.icon() : null;
};

/** ------------------ Screen ------------------ */
export default function BookingOwnerScreen() {
    const insets = useSafeAreaInsets();
    const { courtId, courtName } = useLocalSearchParams<{ courtId: string, courtName: string }>();

    // UI states
    const [searchText, setSearchText] = React.useState('');
    const debouncedSearch = useDebounce(searchText, 500);

    const [items, setItems] = React.useState<any[]>([]);
    const [page, setPage] = React.useState(1);
    const [hasMore, setHasMore] = React.useState(false);

    const [loadingInitial, setLoadingInitial] = React.useState(false);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const [processingBookingId, setProcessingBookingId] = React.useState<string | null>(null); // For confirm/complete actions

    // Dropdown for status filter
    const [open, setOpen] = React.useState(false);
    const [statusFilter, setStatusFilter] = React.useState<string | null>(null);
    const [statusItems, setStatusItems] = React.useState(BOOKING_STATUSES.map(item => ({
        label: item.label,
        value: item.value,
        icon: item.icon,
    })));

    const LIMIT = 8;
    const ctrlRef = React.useRef<AbortController | null>(null);

    const fetchBookings = React.useCallback(async (pageNum: number) => {
        if (!courtId) return { data: { data: { items: [] } } }; // Ensure courtId exists

        const ctrl = new AbortController();
        ctrlRef.current = ctrl;

        try {
            const statusParam = statusFilter ? `&status=${statusFilter}` : '';
            const { data } = await useAxios.get(
                `/owner/courts/${courtId}/bookings?page=${pageNum}&limit=${LIMIT}&search=${debouncedSearch}${statusParam}`,
                { signal: ctrl.signal }
            );
            return data;
        } catch (e) {
            console.log("Fetch bookings aborted or failed:", e);
            return { data: { data: { items: [] } } };
        }
    }, [courtId, debouncedSearch, statusFilter]);

    React.useEffect(() => {
        ctrlRef.current?.abort(); // Abort previous requests
        setLoadingInitial(true);
        setPage(1); // Reset page for new search/filter

        (async () => {
            const { data } = await fetchBookings(1);
            setItems(data?.items || []);
            setHasMore(data?.items?.length === LIMIT);
            setLoadingInitial(false);
        })();

        return () => ctrlRef.current?.abort();
    }, [debouncedSearch, statusFilter, courtId, fetchBookings]);

    const onLoadMore = React.useCallback(async () => {
        if (loadingMore || !hasMore || !courtId) return;

        setLoadingMore(true);
        const nextPage = page + 1;
        const { data } = await fetchBookings(nextPage);

        if (data.data?.items?.length > 0) {
            setItems((prev) => [...prev, ...data.data.items]);
            setPage(nextPage);
            setHasMore(data.data.items?.length === LIMIT);
        } else {
            setHasMore(false);
        }
        setLoadingMore(false);
    }, [loadingMore, hasMore, page, courtId, fetchBookings]);

    const refreshBookings = React.useCallback(() => {
        // A simple way to re-trigger the useEffect without changing search/filter is to reset the page.
        // Or, more robustly, call fetchBookings(1) directly and update state.
        setLoadingInitial(true);
        setPage(1);
        (async () => {
            const { data } = await fetchBookings(1);
            setItems(data?.items || []);
            setHasMore(data?.items?.length === LIMIT);
            setLoadingInitial(false);
        })();
    }, [fetchBookings]);


    const handleConfirmBooking = React.useCallback(async (bookingId: string) => {
        setProcessingBookingId(bookingId);
        try {
            await useAxios.patch(`/owner/bookings/${bookingId}/confirm`);
            Toast.show({
                type: 'success',
                text1: 'Xác nhận đặt sân thành công!',
                text2: `Booking ID #${bookingId} đã được xác nhận.`,
            });
            refreshBookings();
        } catch (error: any) {
            console.error('Lỗi khi xác nhận đặt sân:', error);
            Toast.show({
                type: 'error',
                text1: 'Xác nhận đặt sân thất bại!',
                text2: error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.',
            });
        } finally {
            setProcessingBookingId(null);
        }
    }, [refreshBookings]);

    const handleCompleteBookingWithPayment = React.useCallback(async (bookingId: string, paymentMethod: 'CASH' | 'BANK_TRANSFER') => {
        setProcessingBookingId(bookingId);
        try {
            await useAxios.patch(`/owner/bookings/${bookingId}/complete`, { finalPaymentMethod: paymentMethod });
            Toast.show({
                type: 'success',
                text1: 'Hoàn thành đặt sân thành công!',
                text2: `Booking ID #${bookingId} đã được hoàn thành với phương thức ${paymentMethod}.`,
            });
            refreshBookings();
        } catch (error: any) {
            console.error('Lỗi khi hoàn thành đặt sân:', getErrorMessage(error));
            Toast.show({
                type: 'error',
                text1: 'Hoàn thành đặt sân thất bại!',
                text2: error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.',
            });
        } finally {
            setProcessingBookingId(null);
        }
    }, [refreshBookings]);

    const handleInitiateCompleteBooking = React.useCallback((bookingId: string) => {
        Alert.alert(
            "Chọn phương thức thanh toán",
            "Vui lòng chọn phương thức thanh toán cho booking này:",
            [
                {
                    text: "Tiền mặt",
                    onPress: () => handleCompleteBookingWithPayment(bookingId, 'CASH'),
                },
                {
                    text: "Chuyển khoản",
                    onPress: () => handleCompleteBookingWithPayment(bookingId, 'BANK_TRANSFER'),
                },
                {
                    text: "Hủy",
                    style: "cancel",
                },
            ],
            { cancelable: true }
        );
    }, [handleCompleteBookingWithPayment]);




    if (!courtId) {
        return (
            <SafeAreaView className="flex-1 bg-background">
                <View className="px-4">
                    <HeaderUser />
                </View>
                <EmptyState
                    icon="alert-circle-outline"
                    title="Lỗi"
                    description="Không tìm thấy ID sân. Vui lòng thử lại."
                />
            </SafeAreaView>
        );
    }

    return (
        <KeyboardProvider>
            <SafeAreaView className="flex-1 bg-background">
                <View className="px-4">
                    <HeaderUser />
                    <View className="flex-row px-4 items-center bg-white rounded-xl h-20 mb-4">
                        <Feather name="search" size={25} color="#0a0a0a" />
                        <TextInput
                            value={searchText}
                            onChangeText={setSearchText}
                            placeholder="Nhập Booking ID" // Changed placeholder
                            placeholderTextColor="#000000"
                            className="flex-1 text-lg text-black px-2"
                            returnKeyType="search"
                        />
                    </View>
                    <View className="flex-row justify-start">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="flex-row items-center gap-2 py-2"
                        >
                            <Ionicons name="chevron-back" size={22} />
                            <Text className="text-[15px] text-primary font-medium">Trở về trang trước</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="bg-primary px-5 py-5" style={Platform.OS === 'android' ? { zIndex: 10 } : { zIndex: 9999 }}>
                    <View className="flex-row gap-2 flex-wrap items-center justify-between">
                        <Text lineBreakMode='clip' numberOfLines={1} className="text-2xl font-medium text-primary-foreground">
                            Bookings của sân {courtName}
                        </Text>
                        <View className="w-[180px]">
                            <DropDownPicker
                                open={open}
                                value={statusFilter}
                                items={statusItems}
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
                                description="Hiện chưa có lượt đặt nào với trạng thái này cho sân của bạn."
                            />
                        ) : (
                            <>
                                {items.map((item, i) => (
                                    <View key={`group-${i}`}>
                                        {/* Assuming each item is a booking directly, not a group with 'bookings' array */}

                                        {item?.bookings?.map((b: any, j: number) => (
                                            <React.Fragment key={b?.bookingId ?? `${i}`}>
                                                <TouchableOpacity
                                                    activeOpacity={0.8}
                                                >
                                                    <View className="flex-row items-start justify-between py-4 gap-3">
                                                        {/* Left */}
                                                        <View className="flex-1 pr-2">
                                                            <View className="flex-row items-center">
                                                                <Text>
                                                                    {getStatusIcon(b?.status)}
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
                                                            <Text className="text-[12px] mt-1 text-muted-foreground">
                                                                Đặt bởi: {item?.user?.fullName || '—'}
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

                                                            {/* Action Buttons for PENDING_DEPOSIT */}
                                                            {b?.status === 'PENDING_DEPOSIT' && (
                                                                <View className="flex-row mt-3 gap-2">
                                                                    <Button
                                                                        variant="default" // You might want a custom variant for confirm
                                                                        className="px-3 py-1 rounded-full bg-green-500" // Green for confirm
                                                                        onPress={() => handleConfirmBooking(item?.orderId)}
                                                                        disabled={processingBookingId === item?.orderId}
                                                                    >
                                                                        {processingBookingId === item?.orderId ? (
                                                                            <ActivityIndicator color="white" />
                                                                        ) : (
                                                                            <Text className="text-white text-[11px] font-medium">Xác nhận</Text>
                                                                        )}
                                                                    </Button>
                                                                </View>
                                                            )}

                                                            {/* Action Button for CONFIRMED */}
                                                            {b?.status === 'CONFIRMED' && (
                                                                <Button
                                                                    variant="default"
                                                                    className="mt-3 px-3 py-1 rounded-full bg-blue-500"
                                                                    onPress={() => handleInitiateCompleteBooking(item?.orderId)}
                                                                    disabled={processingBookingId === item?.orderId}
                                                                >
                                                                    {processingBookingId === item?.orderId ? (
                                                                        <ActivityIndicator color="white" />
                                                                    ) : (
                                                                        <Text className="text-white text-[11px] font-medium">Hoàn thành</Text>
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