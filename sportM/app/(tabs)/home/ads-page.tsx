import React from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import Button from '@/components/Button';
import { KeyboardAwareScrollView, KeyboardProvider } from 'react-native-keyboard-controller';
import HeaderUser from '@/components/ui/HeaderUser';
import { router } from 'expo-router';

type AdItem = {
    title: string;
    content: string;
    imageUrl: string;
    startDate: string;
    endDate: string;
};

const MOCK_ADS: AdItem[] = Array.from({ length: 8 }).map((_, i) => ({
    title: `Banner Ads ${i + 1}`,
    content: 'What They Are & How They Work - Khám phá cách quảng cáo banner hiệu quả.',
    imageUrl:
        'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg',
    startDate: '2025-10-12T08:45:03.130Z',
    endDate: '2025-10-13T08:45:03.130Z',
}));

export default function AdsPage() {
    const [page, setPage] = React.useState(1);
    const [items, setItems] = React.useState<AdItem[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [loadingMore, setLoadingMore] = React.useState(false);
    const [hasMore, setHasMore] = React.useState(true);
    const insets = useSafeAreaInsets();

    React.useEffect(() => {
        setTimeout(() => {
            setItems(MOCK_ADS.slice(0, 4));
            setLoading(false);
        }, 1000);
    }, []);

    const onLoadMore = () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        setTimeout(() => {
            const nextPage = page + 1;
            const more = MOCK_ADS.slice(items.length, items.length + 4);
            setItems(prev => [...prev, ...more]);
            setHasMore(items.length + more.length < MOCK_ADS.length);
            setPage(nextPage);
            setLoadingMore(false);
        }, 800);
    };

    return (
        <KeyboardProvider>
            <SafeAreaView className="flex-1 bg-background">
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ paddingBottom: insets.bottom + 150 }}
                    extraKeyboardSpace={0}
                >
                    <View className="bg-background px-4">
                        <HeaderUser />
                    </View>

                    {/* Header */}
                    <View className="px-4 pb-2 flex-row justify-start border-b border-border">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="flex-row items-center gap-2 py-2"
                        >
                            <Ionicons name="chevron-back" size={22} />
                            <Text className="text-[15px] text-primary font-medium">Trở về trang trước</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Content */}
                    {loading ? (
                        <View className="px-4 py-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Card key={i} className="mb-3 rounded-2xl overflow-hidden">
                                    <Skeleton className="h-36 w-full" />
                                    <View className="p-3">
                                        <Skeleton className="h-4 w-40 mb-2" />
                                        <Skeleton className="h-3 w-56 mb-1" />
                                        <Skeleton className="h-3 w-48" />
                                    </View>
                                </Card>
                            ))}
                        </View>
                    ) : (
                        <View className="px-4 py-4">
                            {items.map((ad, idx) => (
                                <Card key={idx} className="mb-3 rounded-2xl overflow-hidden">
                                    <Image source={{ uri: ad.imageUrl }} style={{ width: '100%', height: 140 }} />
                                    <View className="p-3">
                                        <Text className="text-[15px] font-semibold text-primary" numberOfLines={1}>
                                            {ad.title}
                                        </Text>
                                        <Text className="text-[12px] text-muted-foreground mt-1" numberOfLines={2}>
                                            {ad.content}
                                        </Text>
                                        <View className="mt-2 flex-row items-center">
                                            <Ionicons name="time-outline" size={14} />
                                            <Text className="ml-1 text-[12px] text-muted-foreground">
                                                {new Date(ad.startDate).toLocaleDateString()} -{' '}
                                                {new Date(ad.endDate).toLocaleDateString()}
                                            </Text>
                                        </View>
                                        <Button className="mt-3 h-9" size="sm">
                                            Xem chi tiết
                                        </Button>
                                    </View>
                                </Card>
                            ))}

                            <View className="mt-2 items-center">
                                {loadingMore ? (
                                    <View className="flex-row items-center">
                                        <ActivityIndicator />
                                        <Text className="ml-2">Đang tải thêm…</Text>
                                    </View>
                                ) : hasMore ? (
                                    <Button className="mt-2 px-6" onPress={onLoadMore}>
                                        Xem thêm
                                    </Button>
                                ) : (
                                    <Text className="text-muted-foreground text-sm mt-2">
                                        Đã hiển thị tất cả
                                    </Text>
                                )}
                            </View>
                        </View>
                    )}
                </KeyboardAwareScrollView>
            </SafeAreaView>
        </KeyboardProvider>
    );
}
