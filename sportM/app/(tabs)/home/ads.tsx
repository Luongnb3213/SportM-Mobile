import React from 'react';
import {
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Skeleton } from '@/components/Skeleton';
import { useAxios } from '@/lib/api';

type Advertisement = {
    advertisementId: string;
    title: string;
    content: string;
    imageUrl: string;
    startDate: string;
    endDate: string;
    status: boolean;
    displayOrder: string;
    displayHome: boolean;
    createdAt: string;
};

export default function AdvertisementDetailScreen() {
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams<{ id: string }>();

    const [data, setData] = React.useState<Advertisement | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    const fetchData = React.useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await useAxios.get(`/advertisement/${id}`);
            setData(res.data?.data ?? null);
        } catch (e: any) {
            setError(e?.response?.data?.message || 'Không thể tải quảng cáo');
        } finally {
            setLoading(false);
        }
    }, [id]);

    React.useEffect(() => {
        fetchData();
    }, [fetchData]);

    const isActive = React.useMemo(() => {
        if (!data) return false;
        const now = Date.now();
        const start = new Date(data.startDate).getTime();
        const end = new Date(data.endDate).getTime();
        return data.status && now >= start && now <= end;
    }, [data]);

    const dateRange = React.useMemo(() => {
        if (!data) return '';
        const fmt = (d: string) =>
            new Date(d).toLocaleString('vi-VN', { hour12: false });
        return `${fmt(data.startDate)}  →  ${fmt(data.endDate)}`;
    }, [data]);

    const tryOpenFirstUrl = React.useCallback(() => {
        if (!data?.content) return;
        // bắt link đầu tiên (nếu có) trong content
        const match = data.content.match(
            /(https?:\/\/[^\s)]+)|(www\.[^\s)]+)|(\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b)/i
        );
        if (match) {
            const url = match[0].startsWith('http') ? match[0] : `https://${match[0]}`;
            Linking.openURL(url).catch(() => { });
        }
    }, [data]);

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View
                className="flex-row items-center justify-between px-4 py-3"
                style={{ paddingTop: insets.top }}
            >
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-2xl items-center justify-center bg-[#F2F3F5]"
                >
                    <Ionicons name="chevron-back" size={20} />
                </TouchableOpacity>
                <Text className="text-lg font-semibold">Chi tiết ưu đãi</Text>
                <View className="w-10" />
            </View>

            {/* Content */}
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
            >
                {/* Hero Image / Skeleton */}
                <View className="px-4">
                    {loading ? (
                        <Skeleton className="w-full rounded-2xl" style={{ aspectRatio: 6 / 5 }} />
                    ) : data?.imageUrl ? (
                        <Image
                            source={{ uri: data.imageUrl }}
                            className="w-full rounded-2xl"
                            style={{ aspectRatio: 6 / 5 }}
                            resizeMode="cover"
                        />
                    ) : (
                        <View
                            className="w-full rounded-2xl bg-[#f2f2f2] items-center justify-center"
                            style={{ aspectRatio: 6 / 5 }}
                        >
                            <Ionicons name="image-outline" size={30} color="#999" />
                        </View>
                    )}
                </View>

                {/* Title & Status */}
                <View className="px-4 mt-4">
                    {loading ? (
                        <>
                            <Skeleton className="h-6 w-3/4 rounded-md mb-2" />
                            <Skeleton className="h-4 w-1/2 rounded-md" />
                        </>
                    ) : (
                        <>
                            <Text className="text-2xl font-extrabold text-[#1f2756]">
                                {data?.title || '—'}
                            </Text>

                            <View className="flex-row items-center mt-3 space-x-2">
                                <View
                                    className={`px-3 py-1 rounded-full ${isActive ? 'bg-green-100' : 'bg-gray-100'
                                        }`}
                                >
                                    <Text
                                        className={`text-xs font-semibold ${isActive ? 'text-green-700' : 'text-gray-600'
                                            }`}
                                    >
                                        {isActive ? 'ĐANG DIỄN RA' : 'HẾT HẠN / ẨN'}
                                    </Text>
                                </View>

                                <View className="flex-row items-center px-3 py-1 rounded-full bg-[#f6f7f9]">
                                    <Ionicons name="calendar-outline" size={14} color="#5c6370" />
                                    <Text className="ml-1 text-xs text-[#5c6370]">{dateRange}</Text>
                                </View>
                            </View>
                        </>
                    )}
                </View>

                {/* Content Card */}
                <View className="px-4 mt-4">
                    <View className="rounded-2xl bg-white border border-[#eee] shadow-sm">
                        <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#f0f0f0]">
                            <View className="flex-row items-center">
                                <Ionicons name="document-text-outline" size={18} color="#1f2756" />
                                <Text className="ml-2 text-base font-semibold text-[#1f2756]">
                                    Nội dung khuyến mãi
                                </Text>
                            </View>
                        </View>

                        <View className="px-4 py-4">
                            {loading ? (
                                <>
                                    <Skeleton className="h-4 w-11/12 rounded-md mb-2" />
                                    <Skeleton className="h-4 w-10/12 rounded-md mb-2" />
                                    <Skeleton className="h-4 w-8/12 rounded-md" />
                                </>
                            ) : error ? (
                                <View className="items-start">
                                    <Text className="text-red-600 mb-3">{error}</Text>
                                    <TouchableOpacity
                                        onPress={fetchData}
                                        className="px-4 py-2 rounded-xl bg-primary"
                                    >
                                        <Text className="text-white font-semibold">Thử lại</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <Text className="text-[15px] leading-6 text-[#292929]">
                                    {data?.content || '—'}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>

                {/* Meta */}
                {!loading && data && (
                    <View className="px-4 mt-4 mb-2">
                        <Text className="text-xs text-[#8b8f98]">
                            Tạo lúc:{' '}
                            {new Date(data.createdAt).toLocaleString('vi-VN', { hour12: false })}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
