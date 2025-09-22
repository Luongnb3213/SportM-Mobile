// PriceTableCard.tsx
import React, { useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Card, CardHeader, CardContent } from '@/components/Card'; // :contentReference[oaicite:2]{index=2}
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/Tabs'; // :contentReference[oaicite:3]{index=3}

type Row = { day: string; slot: string; price: string };

const INDOOR: Row[] = [
  { day: 'T2 - T6', slot: '5h - 17h', price: '80.000' },
  { day: 'T2 - T6', slot: '17h - 21h', price: '140.000' },
  { day: 'T2 - T6', slot: '21h - 24h', price: '120.000' },
  { day: 'T7 - CN', slot: '5h - 17h', price: '90.000' },
  { day: 'T7 - CN', slot: '17h - 21h', price: '150.000' },
  { day: 'T7 - CN', slot: '21h - 24h', price: '130.000' },
];

const OUTDOOR: Row[] = [
  { day: 'T2 - T6', slot: '5h - 17h', price: '70.000' },
  { day: 'T2 - T6', slot: '17h - 21h', price: '120.000' },
  { day: 'T7 - CN', slot: '5h - 17h', price: '85.000' },
  { day: 'T7 - CN', slot: '17h - 21h', price: '140.000' },
];

function Table({ rows }: { rows: Row[] }) {
  // dựng một “table” 3 cột bằng flex
  const header = useMemo(
    () => (
      <View className="mb-2 flex-row items-center rounded-xl px-3 py-2">
        <Text className="w-[28%] text-center font-semibold text-primary">
          Thứ
        </Text>
        <Text className="w-[42%] text-center font-semibold text-primary">
          Khung giờ
        </Text>
        <Text className="w-[30%] text-center font-semibold text-primary">
          Giá/tiếng
        </Text>
      </View>
    ),
    []
  );

  return (
    <View className="rounded-2xl bg-[#EEEEEE] p-2 shadow-sm">
      {header}
      {rows.map((r, idx) => (
        <View
          key={idx}
          className="flex-row items-center px-3 py-2"
          style={{
            borderTopWidth: 1,
            borderTopColor: 'rgba(0,0,0,0.08)',
          }}
        >
          <Text className="w-[28%] text-center text-[15px] text-primary">
            {r.day}
          </Text>
          <Text className="w-[42%] text-center text-[15px] text-primary">
            {r.slot}
          </Text>
          <Text className="w-[30%] text-center text-[15px] font-semibold text-primary">
            {r.price}
          </Text>
        </View>
      ))}
    </View>
  );
}

export default function PriceTableCard() {
  return (
    <Card
      className="mx-3 mt-3 rounded-2xl overflow-hidden"
      style={{ borderWidth: 0 }}
    >
      {/* Header tab ở trên; có thể đặt trong FlatList ngang nếu bạn muốn kéo nhiều tab */}
      <CardHeader className="p-0">
        <Tabs defaultValue="indoor">
          <TabsList className="px-3 py-2">
            <TabsTrigger
              value="indoor"
              title="Trong nhà"
              className="mr-3 rounded-full"
            >
              {/* text mặc định của TabsTrigger đã render; title đủ */}
            </TabsTrigger>
            <TabsTrigger
              value="outdoor"
              title="Ngoài trời"
              className="rounded-full"
            />
          </TabsList>

          {/* Nội dung từng tab (cuộn dọc khi dài) */}
          <TabsContent value="indoor" className="bg-transparent border-0">
            <View className="pb-4">
              <Table rows={INDOOR} />
            </View>
          </TabsContent>

          <TabsContent value="outdoor" className="bg-transparent border-0">
            <View className="pb-4">
              <Table rows={OUTDOOR} />
            </View>
          </TabsContent>
        </Tabs>
      </CardHeader>
    </Card>
  );
}
