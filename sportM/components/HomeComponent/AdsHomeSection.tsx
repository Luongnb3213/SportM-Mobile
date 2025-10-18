import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import Button from '@/components/Button';
import { useAxios } from '@/lib/api';
import { router } from 'expo-router';
import EmptyState from '../ui/EmptyState';

type AdItem = {
    advertisementId: string;
    content: string;
    createdAt: string;
    title: string;
    imageUrl: string;
    startDate: string;
    endDate: string;
};


export default function AdsHomeSection() {
    const [items, setItems] = React.useState<AdItem[] | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const { data } = await useAxios.get('/advertisement/home');
                setItems(data.data);
                setLoading(false);
            } catch (error) {
                console.log('Failed to fetch ads:', error);
            }
        })()
    }, []);

    return (
        <View>
            {loading ? (
                <View className="px-4">
                    {Array.from({ length: 3 }).map((_, i) => (
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
                    <>
                        {items?.length === 0 ? (
                            <EmptyState
                                icon="people-outline"
                                title="Không có sự kiện nổi bật nào"
                                description="Hiện chưa có sự kiện nổi bật nào."
                            />
                        ) : (
                                <View className="px-4">
                                    {items?.map((ad, idx) => (
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
                                    <View className="items-center py-3">
                                        <Button onPress={() => {
                                            router.push('/(tabs)/home/ads-page');
                                        }} variant="ghost" className="px-3 py-2">
                                            <Text className="mr-1">Xem thêm</Text>
                                            <Ionicons name="chevron-down" size={16} />
                                        </Button>
                                    </View>
                            </View>
                        )}
                    </>
            )}
        </View>
    );
}
