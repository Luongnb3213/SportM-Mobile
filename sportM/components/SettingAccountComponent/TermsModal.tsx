import React, { useEffect, useRef } from "react";
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Animated,
    ScrollView,
    Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { height: SCREEN_H } = Dimensions.get("window");

export type Section = {
    heading?: string;
    paragraphs: string[]; // mỗi phần là 1 đoạn, sẽ xuống dòng
};

type Props = {
    visible: boolean;
    onClose: () => void;
    title?: string;
    sections?: Section[];
};

export default function TermsModal({
    visible,
    onClose,
    title = "Điều khoản & Chính sách",
    sections = [],
}: Props) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 220,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 220,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 180,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 20,
                    duration: 180,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible, fadeAnim, translateY]);

    return (
        <Modal visible={visible} animationType="none" transparent statusBarTranslucent>
            <View className="flex-1 justify-center items-center bg-black/50 px-4">
                <Animated.View
                    style={{
                        opacity: fadeAnim,
                        transform: [{ translateY }],
                        maxHeight: SCREEN_H * 0.85,
                    }}
                    className="w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
                >
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
                        <Text className="text-lg font-bold">{title}</Text>
                        <TouchableOpacity onPress={onClose} className="p-2 rounded-full">
                            <Ionicons name="close" size={22} />
                        </TouchableOpacity>
                    </View>

                    {/* Content scrollable */}
                    <ScrollView
                        className="px-4 py-3"
                        showsVerticalScrollIndicator
                        contentContainerStyle={{ paddingBottom: 30 }}
                    >
                        {sections.map((sec, idx) => (
                            <View key={idx} className="mb-4">
                                {sec.heading ? (
                                    <Text className="text-base font-semibold mb-2">
                                        {idx + 1}. {sec.heading}
                                    </Text>
                                ) : null}
                                {sec.paragraphs.map((p, i) => (
                                    <Text key={i} className="text-sm text-gray-700 mb-2 leading-5">
                                        {p}
                                    </Text>
                                ))}
                            </View>
                        ))}
                    </ScrollView>

                    {/* Footer */}
                    <View className="px-4 py-3 border-t border-gray-100">
                        <TouchableOpacity
                            onPress={onClose}
                            className="w-full items-center justify-center py-3 rounded-xl bg-[#2E2F68]"
                        >
                            <Text className="text-white font-medium">Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>

    );
}
