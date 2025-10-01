// components/EmptyState.tsx
import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "../Button";


type EmptyStateProps = {
  icon?: string;          // tên icon Ionicons, vd "alert-circle-outline"
  title?: string;         // tiêu đề
  description?: string;   // mô tả ngắn
  actionLabel?: string;   // nhãn nút
  onAction?: () => void;  // callback khi bấm nút
  className?: string;
};

export default function EmptyState({
  icon = "alert-circle-outline",
  title = "Không có dữ liệu",
  description = "Hiện tại chưa có thông tin nào để hiển thị.",
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <View className={`justify-center items-center p-6 ${className || ""}`}>
      <Ionicons name={icon as any} size={48} color="#999" />
      <Text className="text-lg font-semibold text-gray-700 mt-4">{title}</Text>
      <Text className="text-base text-gray-500 text-center mt-2">{description}</Text>

      {actionLabel && onAction && (
        <Button
          onPress={onAction}
          className="mt-4 px-5 py-2 rounded-lg bg-primary"
        >
          <Text className="text-white font-medium">{actionLabel}</Text>
        </Button>
      )}
    </View>
  );
}
