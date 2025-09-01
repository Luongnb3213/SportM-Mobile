"use client"

import { useRef, useState } from "react"
import { View, Text, type ScrollView, Dimensions, TouchableOpacity, TextInput } from "react-native"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { useAppTheme } from "@/styles/theme"
import { Feather } from "@expo/vector-icons"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import TrustStatsSection from "./components/TrustStatsSection"
import EmailSubscribeSection from "./components/EmailSubscribeSection"
import { KeyboardAwareScrollView, KeyboardProvider } from "react-native-keyboard-controller"

const { width } = Dimensions.get("window")

const banners = [
  {
    id: "1",
    title: "SÂN GOLF NEM CHUA",
    subtitle: "Mai Lâm, Đông Anh",
    image: "https://images.unsplash.com/photo-1504280390368-3971f660b5f3?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "SÂN GOLF LONG THÀNH",
    subtitle: "Đồng Nai",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2069&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "SÂN GOLF SKYLAKE",
    subtitle: "Chương Mỹ, Hà Nội",
    image: "https://images.unsplash.com/photo-1526404079162-8fc36f2a4f3b?q=80&w=1964&auto=format&fit=crop",
  },
]

export default function HomeScreen() {
  const t = useAppTheme()
  const [guest, setGuest] = useState(2)
  const [loc, setLoc] = useState("")
  const [page, setPage] = useState(0)
  const scrollRef = useRef<ScrollView>(null)
  const insets = useSafeAreaInsets()

  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          extraKeyboardSpace={0}
        >``
          <View style={{ backgroundColor: t.background }}>
            {/* Header */}
            {/* <View className="px-4 pt-5 flex-row items-center gap-3">
            <Image
              source={{ uri: 'https://i.pravatar.cc/100?img=12' }}
              className="w-10 h-10 rounded-full"
            />
            <Text className="flex-1 text-base font-bold text-center">
              Xin chào, Lại Gia Tùng
            </Text>
            <TouchableOpacity>
              <View className="w-8 h-8 rounded-full bg-white items-center justify-center shadow">
                <Feather name="bell" size={18} color={t.foreground} />
              </View>
            </TouchableOpacity>
          </View> */}

            {/* Permission card */}
            {/* <TouchableOpacity className="mx-4 mt-3 rounded-xl bg-[#7CB37A] px-4 py-3 flex-row items-center justify-between">
            <View className="w-9 h-9 rounded-full bg-white/90 items-center justify-center">
              <Ionicons name="location-outline" size={18} color="#4D8A43" />
            </View>
            <View className="flex-1 px-3">
              <Text className="text-white font-semibold">
                Hãy cho phép sportM truy cập vị trí
              </Text>
              <Text className="text-white/90 text-xs">
                để gợi ý chính xác hơn
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color="white" />
          </TouchableOpacity> */}

            {/* Banner carousel */}
            {/* <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const p = Math.round(e.nativeEvent.contentOffset.x / width);
              setPage(p);
            }}
            scrollEventThrottle={16}
            className="mt-2"
          >
            {banners.map((b) => (
              <ImageBackground
                key={b.id}
                source={{ uri: b.image }}
                style={{ width, height: 210 }}
                imageStyle={{ borderRadius: 16 }}
              >
                <View className="flex-1 rounded-2xl p-4 justify-end">
                  <View className="absolute top-3 left-4 flex-row items-center gap-4">
                    {banners.map((x, i) => (
                      <Text
                        key={x.id}
                        className={`font-extrabold tracking-widest ${
                          page === i ? 'text-[#ffd60a]' : 'text-white/60'
                        }`}
                      >
                        {`0${i + 1}`}
                      </Text>
                    ))}
                  </View>
                  <Text className="text-white/90 font-semibold mb-1">
                    Sân đang hot hiện tại
                  </Text>
                  <Text className="text-[#ffd60a] font-black text-2xl">
                    {b.title}
                  </Text>
                  <Text className="text-white mt-1">{b.subtitle}</Text>
                </View>
              </ImageBackground>
            ))}
          </ScrollView> */}

            {/* Search card */}
            <Card className="rounded-2xl p-4 mx-4 -mt-7 bg-white">
              {/* Row 1: search input */}
              <View className="flex-row items-center bg-slate-100 rounded-xl h-12 px-3">
                <Feather name="search" size={18} color="#0a0a0a" />
                <TextInput
                  value={loc}
                  onChangeText={setLoc}
                  placeholder="Nhập địa điểm"
                  placeholderTextColor="#9ca3af"
                  className="flex-1 text-base text-black px-2"
                />
                <Feather name="sliders" size={18} color="#0a0a0a" />
              </View>

              {/* divider */}
              <View className="my-2 h-px bg-black/10" />

              {/* Row 2: pick date */}
              <TouchableOpacity className="flex-row items-center py-2">
                <Feather name="calendar" size={18} color={t.foreground} />
                <Text className="ml-2 text-base font-semibold text-black">Chọn lịch</Text>
              </TouchableOpacity>

              {/* divider */}
              <View className="my-2 h-px bg-black/10" />

              {/* Row 3: guests */}
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Feather name="users" size={18} color={t.foreground} />
                  <Text className="ml-2 text-base font-semibold text-black">Số lượng khách</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Button
                    variant="default"
                    label="-"
                    className="h-9 w-9 rounded-xl"
                    onPress={() => setGuest((g) => Math.max(1, g - 1))}
                  />
                  <Text className="min-w-7 text-center text-base font-bold">{guest}</Text>
                  <Button
                    variant="default"
                    label="+"
                    className="h-9 w-9 rounded-xl"
                    onPress={() => setGuest((g) => g + 1)}
                  />
                </View>
              </View>

              {/* Mã khuyến mại */}
              <TouchableOpacity className="mt-2 flex-row items-center">
                <Feather name="tag" size={18} color="#3b7c2e" />
                <Text className="ml-2 font-bold" style={{ color: "#3b7c2e" }}>
                  Mã khuyến mại
                </Text>
              </TouchableOpacity>
            </Card>

            {/* Golf deal card */}
            {/* <View className="mt-3">
            <GolfDealCard
              title="Trải nghiệm được đầy đủ dịch vụ và tiện nghi khi đặt sân"
              image="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=2069&auto=format&fit=crop"
              placeName="Sân Golf Nem Chua"
              description="Đây là sân golf với sự lâu đời vãi lớn, rất nhiều người đã thuê sân này và một đi không trở lại. Bạn có thể thuê ngay để tìm kho báu của những người đi trước.Hời lắm, thuê đi.Khi bạn tìm được kho báu thì bạn 30 chúng tôi 70. thế nhé.Peace out!"
              discountPercent={36}
              onBook={() => console.log('Đặt ngay')}
            />
          </View> */}

            {/* trust stats section */}
            <View className="mt-3">
              <TrustStatsSection
                heading1="Sẻ chia sự"
                heading2="tin tưởng khi sử dụng"
                paragraph={`Mỗi một đồng bạn đặt xuống là một đồng tôi nhận được. Fact thôi nhưng tôi sẽ cân bạn sâu vcl.
Everybody knows that but who gives a fuck`}
                ctaLabel="Đăng ký hội viên"
                onPressCTA={() => console.log("Đăng ký hội viên")}
                stat1Value="360+"
                stat1Desc="Hơn 360 sân được liệt kê trong hệ thống"
                stat2Value="22k+"
                stat2Desc="Người chủ sân đã tin tưởng chúng tôi"
                hashtags="#sportmlove #ilovenemchua"
              />
            </View>

            <View className="mt-3">
              <EmailSubscribeSection
                defaultEmail="iamgay@gmail.com"
                privacyUrl="https://sportm.vn/privacy"
                onSubmit={async (email) => {
                  // TODO: call API ở đây
                  console.log("subscribe:", email)
                }}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardProvider>
  )
}
