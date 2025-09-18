import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
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
import HeaderUser from '@/components/ui/HeaderUser';

type Booking = {
  id: string;
  name: string;
  bookingId: string;
  dateLabel: string;
  location: string;
};

const DATA: Booking[] = [
  {
    id: '1',
    name: 'Sân Gold Nem Chua',
    bookingId: '#JQKA1234',
    dateLabel: 'Thứ 5, ngày 3/6/2036',
    location: 'Mai Lâm, Đông Anh',
  },
  // ... nhân bản cho đủ danh sách như ảnh
  {
    id: '2',
    name: 'Sân Gold Nem Chua',
    bookingId: '#JQKA1234',
    dateLabel: 'Thứ 5, ngày 3/6/2036',
    location: 'Mai Lâm, Đông Anh',
  },
  {
    id: '3',
    name: 'Sân Gold Nem Chua',
    bookingId: '#JQKA1234',
    dateLabel: 'Thứ 5, ngày 3/6/2036',
    location: 'Mai Lâm, Đông Anh',
  },
  {
    id: '4',
    name: 'Sân Gold Nem Chua',
    bookingId: '#JQKA1234',
    dateLabel: 'Thứ 5, ngày 3/6/2036',
    location: 'Mai Lâm, Đông Anh',
  },
  {
    id: '5',
    name: 'Sân Gold Nem Chua',
    bookingId: '#JQKA1234',
    dateLabel: 'Thứ 5, ngày 3/6/2036',
    location: 'Mai Lâm, Đông Anh',
  },
  {
    id: '6',
    name: 'Sân Gold Nem Chua',
    bookingId: '#JQKA1234',
    dateLabel: 'Thứ 5, ngày 3/6/2036',
    location: 'Mai Lâm, Đông Anh',
  },
  {
    id: '7',
    name: 'Sân Gold Nem Chua',
    bookingId: '#JQKA1234',
    dateLabel: 'Thứ 5, ngày 3/6/2036',
    location: 'Mai Lâm, Đông Anh',
  },
  {
    id: '8',
    name: 'Sân Gold Nem Chua',
    bookingId: '#JQKA1234',
    dateLabel: 'Thứ 5, ngày 3/6/2036',
    location: 'Mai Lâm, Đông Anh',
  },
];

export default function BookingsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1 bg-background">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          extraKeyboardSpace={0}
        >
          <View className="px-4">
            <HeaderUser />
            {/* Row 1: search input */}
            <View className="flex-row px-4 items-center bg-white rounded-xl h-20 mb-4">
              <Feather name="search" size={25} color="#0a0a0a" />
              <TextInput
                placeholder="Nhập địa điểm"
                placeholderTextColor="#000000"
                className="flex-1 text-lg text-black px-2"
              />
            </View>
          </View>
          {/* Top bar */}
          <View className="bg-primary px-5 py-5">
            <Text className="text-2xl font-medium text-primary-foreground">
              Tất cả sân đã đặt
            </Text>
          </View>

          {/* Content card-like container */}
          <Card
            className="m-4 bg-background rounded-2xl overflow-hidden"
            style={{ borderWidth: 0 }}
          >
            {DATA.map((item: Booking) => {
              return (
                <TouchableOpacity key={item.id} activeOpacity={0.8}>
                  <View className="flex-row items-start justify-between py-4">
                    {/* Left: name + booking id */}
                    <View className="flex-1 pr-2">
                      <Text className="text-lg font-medium text-[#292929]">
                        {item.name}
                      </Text>
                      <Text className="text-[12px] mt-1 text-muted-foreground">
                        Booking ID: {item.bookingId}
                      </Text>
                    </View>

                    {/* Right: pill date + location */}
                    <View className="items-end">
                      <Badge
                        label={item.dateLabel}
                        className="p-3 py-1 rounded-full bg-muted"
                        labelClasses="text-[11px] text-foreground"
                      />
                      <Text className="mt-2 text-[12px] text-muted-foreground">
                        {item.location}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Footer: Xem thêm */}
            <View className="items-center py-3">
              <Button variant="ghost" className="px-3 py-2">
                <Text className="mr-1">Xem thêm</Text>
                <Ionicons name="chevron-down" size={16} />
              </Button>
            </View>
          </Card>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardProvider>
  );
}
