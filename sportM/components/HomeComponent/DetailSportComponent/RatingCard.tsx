// components/RatingCard.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Card, CardContent } from "@/components/Card";
import { Input } from "@/components/Input";

export default function RatingCard({
  title = "Đánh giá sân Golf Nem Chua",
  onChange,
}: {
  title?: string;
  onChange?: (rating: number, note: string) => void;
}) {
  const [rating, setRating] = useState<number>(3);
  const [note, setNote] = useState<string>("");

  const handleRate = (n: number) => {
    setRating(n);
    onChange?.(n, note);
  };

  return (
    <Card className="m-3 rounded-2xl p-4 bg-[#EEE]">
      <CardContent className="p-0">
        {/* Title + subtitle */}
        <Text className="text-xl font-extrabold text-primary">{title}</Text>
        <Text className="mt-2 text-[13.5px] leading-5 text-muted-foreground">
          Sau khi trải nghiệm sân, bạn có cảm thấy liệu yêu cầu của bạn đã được thỏa mãn chưa?
        </Text>

        {/* Stars */}
        <View className="mt-4 flex-row items-center gap-3">
          {Array.from({ length: 5 }).map((_, i) => {
            const idx = i + 1;
            const active = idx <= rating;
            return (
              <TouchableOpacity key={idx} onPress={() => handleRate(idx)} hitSlop={8}>
                <Ionicons
                  name={active ? "star" : "star-outline"}
                  size={28}
                  color={active ? "#F59E0B" : "#94A3B8"}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Comment box */}
        <Text className="mt-5 text-[13.5px] font-semibold text-primary">
          Nhập nhận xét của bạn tại đây (Optional)
        </Text>
        <TextInput
          placeholder="Nhập nhận xét"
          multiline
          value={note}
          onChangeText={(t) => {
            setNote(t);
            onChange?.(rating, t);
          }}
          className="mt-2 min-h-[140px] rounded-2xl bg-white text-[15px]"
          editable
          numberOfLines={4}
          style={{ textAlignVertical: "top", padding: 12 }}
        />
      </CardContent>
    </Card>
  );
}
