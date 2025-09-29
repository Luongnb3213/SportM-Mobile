import GolfCourseCard from '@/components/HomeComponent/GolfCourseCard';
import HeaderUser from '@/components/ui/HeaderUser';
import { useAuth } from '@/providers/AuthProvider';
import { useAppTheme } from '@/styles/theme';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

type Pill = { id: string | number; label: string; icon?: React.ReactNode };

const pills: Pill[] = [
  { id: 1, label: 'Cầu lông' },
  { id: 2, label: 'Cầu lông' },
  { id: 3, label: 'Cầu lông' },
  { id: 4, label: 'Cầu lông' },
  { id: 5, label: 'Cầu lông' },
];
const index = () => {
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const t = useAppTheme();

  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: insets.bottom + 50,
            backgroundColor: t.background,
          }}
          extraKeyboardSpace={0}
        >
          <View>
            <View className="bg-background px-4">
              <HeaderUser />
            </View>

            <View className="flex-row px-14 items-center rounded-xl h-20 mb-4">
              <Feather name="search" size={25} color="#0a0a0a" />
              <TextInput
                placeholder="Tìm kiếm"
                placeholderTextColor="#000000"
                className="flex-1 text-lg text-black px-2 "
              />
            </View>

            {/* Hàng pill */}
            <View className="pt-3 px-4">
              <View className="flex-row flex-wrap gap-1">
                {pills.map((p) => (
                  <View
                    key={p.id}
                    className="rounded-lg px-3 flex items-center flex-col shadow-xl py-3 bg-white"
                  >
                    <MaterialCommunityIcons name="badminton" size={14} />
                    <Text className="text-xs"> {p.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className="gap-5 px-4 mt-4 flex-col">
              <GolfCourseCard
                title="Bíc cờ bôn"
                pricePerHour="1.000.000/ giờ"
                rating={4.5}
                imageUri="https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1600"
                onPress={() => {
                  router.push({
                    pathname: '/owner/detailCourt',
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
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardProvider>
  );
};

export default index;
