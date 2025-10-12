import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import Button from '@/components/Button';
// import { useAxios } from '@/hooks/useAxios'; // bật nếu bạn call API thật

type AdItem = {
    title: string;
    content: string;
    imageUrl: string;
    startDate: string;
    endDate: string;
};

const MOCK_ADS: AdItem[] = [
    {
        title: 'Banner Ads: What They Are & How They Work',
        content: 'Khám phá cách quảng cáo banner giúp doanh nghiệp tiếp cận khách hàng hiệu quả hơn.',
        imageUrl: 'https://sportm.vn/static/meda/san1.2f6f5f5f.jpg',
        startDate: '2025-10-12T08:45:03.130Z',
        endDate: '2025-10-13T08:45:03.130Z',
    },
    {
        title: 'Super Sale Weekend',
        content: 'Giảm giá đến 50% cho các sân chơi cuối tuần này!',
        imageUrl: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg',
        startDate: '2025-10-14T08:45:03.130Z',
        endDate: '2025-10-15T08:45:03.130Z',
    },
    {
        title: 'Member Exclusive Event',
        content: 'Sự kiện đặc biệt dành riêng cho hội viên SportM vào cuối tháng này!',
        imageUrl: 'https://photo.znews.vn/w660/Uploaded/mdf_eioxrd/2021_07_06/2.jpg',
        startDate: '2025-10-18T08:45:03.130Z',
        endDate: '2025-10-19T08:45:03.130Z',
    },
];

export default function AdsHomeSection() {
    const [items, setItems] = React.useState<AdItem[] | null>(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setItems(MOCK_ADS);
            setLoading(false);
        }, 1000);
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
                </View>
            )}
        </View>
    );
}
