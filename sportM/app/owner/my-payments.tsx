import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import EmptyState from '@/components/ui/EmptyState';
import { useAxios } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import { formatPriceVND } from '@/lib/utils';
import HeaderUser from '@/components/ui/HeaderUser';
import { router } from 'expo-router';
import { ScrollView } from 'react-native';

const getStatusStyle = (status: string) => {
    switch (status) {
        case 'SUCCESS':
            return { color: '#3CB371', icon: 'checkmark-circle-outline' };
        case 'FAILED':
            return { color: '#DC143C', icon: 'close-circle-outline' };
        case 'PENDING':
        default:
            return { color: '#FFD700', icon: 'time-outline' };
    }
};

export default function MyPaymentsScreen() {
    const [searchText, setSearchText] = React.useState('');
    const debouncedSearch = useDebounce(searchText, 500);
    const insets = useSafeAreaInsets();

    const [page, setPage] = React.useState(1);
    const [hasMore, setHasMore] = React.useState(false);
    const [items, setItems] = React.useState<any[]>([]);
    const [loadingInitial, setLoadingInitial] = React.useState(false);
    const [loadingMore, setLoadingMore] = React.useState(false);

    const [open, setOpen] = React.useState(false);
    const [status, setStatus] = React.useState<string>('');
    const [statusItems, setStatusItems] = React.useState([
        { label: 'Tất cả trạng thái', value: '' },
        { label: 'Đang xử lý', value: 'PENDING', icon: () => <Ionicons name="time-outline" size={16} color="#FFD700" /> },
        { label: 'Hoàn tất', value: 'SUCCESS', icon: () => <Ionicons name="checkmark-circle-outline" size={16} color="#3CB371" /> },
        { label: 'Thất bại', value: 'FAILED', icon: () => <Ionicons name="close-circle-outline" size={16} color="#DC143C" /> },
    ]);

    const LIMIT = 12;
    const ctrlRef = React.useRef<AbortController | null>(null);

    const fetchPayments = React.useCallback(async (pageNum = 1) => {
        ctrlRef.current?.abort();
        const ctrl = new AbortController();
        ctrlRef.current = ctrl;

        try {
            if (pageNum === 1) setLoadingInitial(true);
            const { data } = await useAxios.get(
                `/payments/my-payments?page=${pageNum}&limit=${LIMIT}&search=${debouncedSearch}&status=${status}`,
                { signal: ctrl.signal }
            );
            const newItems = data?.data?.items || [];
            if (pageNum === 1) setItems(newItems);
            else setItems((prev) => [...prev, ...newItems]);
            setHasMore(newItems.length === LIMIT);
            setPage(pageNum);
        } catch (e) {
            console.log('Fetch payments failed:', e);
        } finally {
            setLoadingInitial(false);
            setLoadingMore(false);
        }
    }, [debouncedSearch, status]);

    React.useEffect(() => {
        fetchPayments(1);
    }, [debouncedSearch, status]);

    const onLoadMore = () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        fetchPayments(page + 1);
    };

    return (
        <SafeAreaView className="flex-1 bg-[#f9fafb]">
            {/* Header Search */}
            <View className="px-4 mt-3">
                <HeaderUser />
                <View className="pb-2 flex-row justify-start">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="flex-row items-center gap-2 py-2"
                    >
                        <Ionicons name="chevron-back" size={22} />
                        <Text className="text-[15px] text-primary font-medium">Trở về trang trước</Text>
                    </TouchableOpacity>
                </View>
                <View className="flex-row px-4 items-center bg-white rounded-xl h-16 shadow-sm">
                    <Feather name="search" size={22} color="#555" />
                    <TextInput
                        value={searchText}
                        onChangeText={setSearchText}
                        placeholder="Tìm mã giao dịch hoặc số tiền..."
                        placeholderTextColor="#888"
                        className="flex-1 text-base text-black px-2"
                        returnKeyType="search"
                    />
                </View>
            </View>

            {/* Dropdown trạng thái */}
            <View className="px-5 mt-3 mb-2" style={Platform.OS === 'android' ? { zIndex: 10 } : { zIndex: 9999 }}>
                <DropDownPicker
                    open={open}
                    value={status}
                    items={statusItems}
                    setOpen={setOpen}
                    setValue={setStatus}
                    setItems={setStatusItems}
                    placeholder="Chọn trạng thái"
                    style={{
                        backgroundColor: 'white',
                        borderColor: '#ddd',
                        borderRadius: 12,
                    }}
                    textStyle={{
                        fontSize: 14,
                        color: '#222',
                    }}
                    dropDownContainerStyle={{
                        backgroundColor: 'white',
                        borderColor: '#ddd',
                        borderRadius: 12,
                    }}
                />
            </View>
            <ScrollView
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                automaticallyAdjustKeyboardInsets
                contentInsetAdjustmentBehavior="always"
                contentContainerStyle={{
                    paddingBottom: (insets?.bottom ?? 0) + 24,
                }}
            >
                <Card className="mx-4 bg-white rounded-2xl p-4 shadow-sm">
                    {loadingInitial ? (
                        <View className="py-8 items-center">
                            <ActivityIndicator size="large" color="#1F2257" />
                            <Text className="mt-2 text-gray-500">Đang tải giao dịch...</Text>
                        </View>
                    ) : items.length === 0 ? (
                        <EmptyState
                            icon="wallet-outline"
                            title="Chưa có giao dịch"
                            description="Không tìm thấy giao dịch nào phù hợp."
                        />
                    ) : (
                        <>
                            {items.map((item, idx) => {
                                const statusStyle = getStatusStyle(item.paymentStatus);
                                return (
                                    <View
                                        key={item.paymentId || idx}
                                        className="border border-gray-200 bg-[#fcfcfc] rounded-xl p-3 mb-3 shadow-sm"
                                    >
                                        <View className="flex-row justify-between items-center mb-1">
                                            <View className="flex-row items-center">
                                                <Ionicons
                                                    name={statusStyle.icon as any}
                                                    size={20}
                                                    color={statusStyle.color}
                                                />
                                                <Text className="font-semibold text-[15px] ml-2 text-[#222]">
                                                    {item.transactionCode}
                                                </Text>
                                            </View>
                                            <Text style={{ color: statusStyle.color, fontWeight: '600' }}>
                                                {item.paymentStatus}
                                            </Text>
                                        </View>

                                        <Text className="text-[13px] text-gray-600">
                                            Phương thức: {item.paymentMethod}
                                        </Text>
                                        <Text className="text-[13px] text-gray-600">
                                            Số tiền: {formatPriceVND(item.amount)} VNĐ
                                        </Text>

                                        {/* Booking Order Info */}
                                        <View className="mt-2 pl-3 border-l-2 border-gray-300">
                                            <Text className="text-[12px] text-gray-700">
                                                Mã đơn: {item.bookingOrder?.orderId}
                                            </Text>
                                            <Text className="text-[12px] text-gray-700">
                                                Tổng: {formatPriceVND(item.bookingOrder?.totalPrice)} VNĐ
                                            </Text>
                                            <Text className="text-[12px] text-gray-700">
                                                Cọc: {formatPriceVND(item.bookingOrder?.totalDeposit)} VNĐ
                                            </Text>
                                            <Text className="text-[12px] text-gray-500 mt-1 italic">
                                                Ghi chú: {item.bookingOrder?.notes || 'Không có ghi chú'}
                                            </Text>
                                        </View>
                                    </View>
                                );
                            })}

                            {/* Load More */}
                            {hasMore && (
                                <View className="items-center py-3">
                                    {loadingMore ? (
                                        <View className="px-3 py-2 flex-row items-center">
                                            <ActivityIndicator />
                                            <Text className="ml-2">Đang tải thêm...</Text>
                                        </View>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            onPress={onLoadMore}
                                            className="flex-row items-center px-4 py-2 rounded-full bg-[#eef2ff]"
                                        >
                                            <Ionicons name="chevron-down" size={16} color="#1F2257" />
                                            <Text className="ml-1 text-[#1F2257] font-medium">
                                                Xem thêm
                                            </Text>
                                        </Button>
                                    )}
                                </View>
                            )}
                        </>
                    )}
                </Card>
            </ScrollView>
        </SafeAreaView>

    );
}
