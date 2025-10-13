import { NotificationPayload } from "@/app/(tabs)/notification";
import { TouchableOpacity, View, Text } from "react-native";
import Button from "../Button";
import { Avatar, AvatarFallback, AvatarImage } from "../Avatar";
import { NotificationType } from "@/constants/NotificationType";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { JSX } from "react";
import { router } from "expo-router";

export function NotificationLine({
    n,
    onAction,
    onMarkAsRead,
}: {
    n: NotificationPayload;
    onAction?: (id: string, action: string) => void;
    onMarkAsRead?: (id: string) => void;
}) {
    const Icon = getIcon(n.type);
    const title = humanizeType(n.type);
    const unread = !n.read;
    const containerClasses = [
        'px-4 py-4',
        unread ? 'bg-accent/30' : 'bg-white/0'
    ].join(' ');

    const ctas = getCTAs(n.type);

    const handleClick = () => {
        if (unread) {
            onMarkAsRead?.(n.id);
        }
        switch (n.type) {
            case NotificationType.BOOKING_SUCCESS:
                router.push(`/(tabs)/home/booking`);
                break;
            case NotificationType.INVITED_TO_BOOKING:
                break;
            case NotificationType.FRIEND_REQUEST:
                router.push(`/(tabs)/addAccount/listFriendRequest`);
                break;
            case NotificationType.FRIEND_ACCEPTED:
                router.push(`/(tabs)/addAccount/listFriendRequest`);
                break;
            case NotificationType.BOOKING_REMINDER:
                router.push(`/(tabs)/home/booking`);
                break;
            default:
                break;
        }

    }

    return (
        <TouchableOpacity onPress={handleClick} activeOpacity={0.7}>
            <View className={containerClasses}>
                <View className="flex-row gap-3 items-start">
                    {unread && <View className="mt-1 h-2 w-2 rounded-full bg-[#90CDF4]" />}
                    {!unread && <View className="mt-1 h-2 w-2 rounded-full bg-transparent" />}
                    <View className="h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                        <Icon size={20} />
                    </View>
                    <View className="flex-1">
                        <Text className="text-[13.5px] leading-5">
                            {n.actor ? (
                                <>
                                    <Text className="font-medium">{n.actor.name}</Text> {n.message}
                                </>
                            ) : (
                                title
                            )}
                        </Text>
                        {ctas.length > 0 && (
                            <View className="mt-3 flex-row gap-3">
                                {ctas.map((cta) => (
                                    <Button
                                        key={cta.key}
                                        variant={cta.variant}
                                        className="px-4 py-1 rounded-md"
                                        onPress={() => {
                                            onAction?.(n.id, cta.key);
                                            // Optionally mark as read when an action is taken
                                            // onMarkAsRead?.(n.id);
                                        }}
                                    >
                                        {cta.label}
                                    </Button>
                                ))}
                            </View>
                        )}
                        <View className="mt-2 flex-row items-center gap-2">
                            {n.actor?.avatar && (
                                <Avatar className="h-5 w-5">
                                    <AvatarImage source={{ uri: n.actor.avatar }} />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                            )}
                            <TimeAgo iso={n.createdAt} />
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}


export function TimeAgo({ iso }: { iso: string }) {
    const d = new Date(iso);
    const diff = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000));
    let text = `${diff} giây trước`;
    if (diff > 59) {
        const m = Math.floor(diff / 60);
        text = `${m} phút trước`;
        if (m > 59) {
            const h = Math.floor(m / 60);
            text = `${h} giờ trước`;
            if (h > 24) {
                const day = Math.floor(h / 24);
                text = `${day} ngày trước`;
            }
        }
    }
    return <Text className="text-[12px] text-muted-foreground">{text}</Text>;
}


// =======================
// Icon mapping
// =======================
const TypeIcon: Record<
    NotificationType | 'DEFAULT',
    (props: { size?: number }) => JSX.Element
> = {
    [NotificationType.BOOKING_SUCCESS]: ({ size = 22 }) => (
        <Ionicons name="checkmark-done-circle" size={size} color="#16a34a" />
    ),
    [NotificationType.INVITED_TO_BOOKING]: ({ size = 22 }) => (
        <Ionicons name="person-add" size={size} color="#2563eb" />
    ),
    [NotificationType.NEW_BOOKING_FOR_OWNER]: ({ size = 22 }) => (
        <Feather name="calendar" size={size} color="#9333ea" />
    ),
    [NotificationType.FRIEND_REQUEST]: ({ size = 22 }) => (
        <Ionicons name="person-add-outline" size={size} color="#2563eb" />
    ),
    [NotificationType.FRIEND_ACCEPTED]: ({ size = 22 }) => (
        <Ionicons name="people-circle-outline" size={size} color="#22c55e" />
    ),
    [NotificationType.BOOKING_REMINDER]: ({ size = 22 }) => (
        <Ionicons name="alarm-outline" size={size} color="#f59e0b" />
    ),
    DEFAULT: ({ size = 22 }) => (
        <AntDesign name="bells" size={size} color="#6b7280" />
    ),
};

function getIcon(type: NotificationType) {
    return TypeIcon[type] ?? TypeIcon.DEFAULT;
}


export function humanizeType(type: NotificationType) {
    const map: Record<NotificationType, string> = {
        [NotificationType.BOOKING_SUCCESS]: 'Đặt sân thành công',
        [NotificationType.INVITED_TO_BOOKING]: 'Lời mời đặt sân',
        [NotificationType.NEW_BOOKING_FOR_OWNER]: 'Đặt sân mới cho chủ sân',
        [NotificationType.FRIEND_REQUEST]: 'Lời mời kết bạn',
        [NotificationType.FRIEND_ACCEPTED]: 'Đã chấp nhận lời mời kết bạn',
        [NotificationType.BOOKING_REMINDER]: 'Nhắc nhở đặt sân',
    };
    return map[type];
}

export function getCTAs(
    type: NotificationType
): Array<{
    key: string;
    label?: string;
    variant?: 'outline' | 'default' | 'destructive';
}> {
    switch (type) {
        case NotificationType.INVITED_TO_BOOKING:
            return [
                { key: 'join', label: 'Tham gia' },
                { key: 'dismiss', label: 'Bỏ qua', variant: 'outline' },
            ];
        case NotificationType.BOOKING_SUCCESS:
            return [{ key: 'view', label: 'Xem chi tiết' }];
        default:
            return [];
    }
}
