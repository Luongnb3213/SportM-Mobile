import BookingScheduleScreen from '@/components/HomeComponent/DetailSportComponent/BookingScheduleScreen';
import BookingSummary from '@/components/HomeComponent/DetailSportComponent/BookingSummary';
import HeaderUser from '@/components/ui/HeaderUser';
import React from 'react';
import { View } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

const bookingSchedule = () => {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          extraKeyboardSpace={0}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 50,
            flexGrow: 1,
          }}
        >
          <View className="px-4">
            <HeaderUser />
          </View>
          <BookingScheduleScreen />
          <View className="px-4">
            <BookingSummary
              totalHours={4}
              totalPrice={36}
              onCancel={() => {}}
              onSubmit={() => {}}
              onPressCoupon={() => {}}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardProvider>
  );
};

export default bookingSchedule;
