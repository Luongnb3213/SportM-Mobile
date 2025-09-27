'use client';

import { useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
  StyleSheet,
} from 'react-native';
import Button from '@/components/Button';
import { Card } from '@/components/Card';
import { useAppTheme } from '@/styles/theme';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import TrustStatsSection from '../../../components/HomeComponent/TrustStatsSection';
import EmailSubscribeSection from '../../../components/HomeComponent/EmailSubscribeSection';
import {
  KeyboardAwareScrollView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import GolfDealCard from '../../../components/HomeComponent/GolfDealCard';
import GolfCourseCard from '@/components/HomeComponent/GolfCourseCard';
import HeaderUser from '@/components/ui/HeaderUser';
import { router } from 'expo-router';

export default function HomeScreen() {
  const t = useAppTheme();
  const [guest, setGuest] = useState(2);
  const [loc, setLoc] = useState('');
  const insets = useSafeAreaInsets();

  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          extraKeyboardSpace={0}
        >
          <View style={{ backgroundColor: t.background }}>
            <View className="bg-background px-4">
              <HeaderUser />
            </View>

            {/* Row 1: search input */}
            <View className="flex-row px-4 items-center bg-[#EEEEEE] rounded-xl h-14 mx-4 mt-4">
              <Feather name="search" size={25} color="#0a0a0a" />
              <TextInput
                value={loc}
                onChangeText={setLoc}
                placeholder="Nhập địa điểm"
                placeholderTextColor="#000000"
                className="flex-1 text-lg text-black px-2"
              />
            </View>

            <View className="gap-5 px-4 mt-4 flex-col">
              <GolfCourseCard
                title="Bíc cờ bôn"
                pricePerHour="1.000.000/ giờ"
                rating={4.5}
                imageUri="https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600"
                onPress={() => {
                  // navigate to detail screen
                  // navigation.navigate('DetailSport');
                  // router.push('/home/booking');
                  router.push({
                    pathname: '/(tabs)/home/DetailSport',
                    params: { courtID: '12345' },
                  });
                }}
              />
              <GolfCourseCard
                title="Bíc cờ bôn"
                pricePerHour="1.000.000/ giờ"
                rating={4.5}
                imageUri="https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600"
              />
            </View>

            {/* Golf deal card */}
            <View className="mt-4">
              <GolfDealCard title="Sân quanh đây" />
            </View>

            {/* trust stats section */}
            <View className="mt-4">
              <TrustStatsSection
                heading1="Sẻ chia sự"
                heading2="tin tưởng khi sử dụng"
                paragraph={`Mỗi một đồng bạn đặt xuống là một đồng tôi nhận được. Fact thôi nhưng tôi sẽ cân bạn sâu vcl.
Everybody knows that but who gives a fuck`}
                ctaLabel="Đăng ký chủ sân"
                onPressCTA={() => console.log('Đăng ký hội viên')}
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
                  console.log('subscribe:', email);
                }}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardProvider>
  );
}
