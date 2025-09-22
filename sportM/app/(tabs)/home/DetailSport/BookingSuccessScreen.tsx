import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  KeyboardAwareScrollView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/Button';

const BookingSuccessScreen = () => {
  // <CHANGE> Added coordinates for the venue location
  const venueCoordinates = {
    latitude: 10.8231, // Ví dụ tọa độ TP.HCM
    longitude: 106.6297,
  };

  const openGoogleMaps = async () => {
    const { latitude, longitude } = venueCoordinates;

    // URL cho Google Maps với tọa độ
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

    // Hoặc sử dụng URL scheme cho app Google Maps (nếu đã cài)
    const googleMapsUrl = `google.navigation:q=${latitude},${longitude}`;

    try {
      // Kiểm tra xem có thể mở Google Maps app không
      const supported = await Linking.canOpenURL(googleMapsUrl);

      if (supported) {
        // Mở Google Maps app
        await Linking.openURL(googleMapsUrl);
      } else {
        // Mở Google Maps trên web browser
        await Linking.openURL(url);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể mở Google Maps');
      console.error('Error opening maps:', error);
    }
  };

  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1 bg-background">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ backgroundColor: '#1F2257' }}
        >
          <View className="flex-row items-center px-4 py-5">
            <TouchableOpacity className="mr-3">
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-base font-medium">
              Trở về trang trước
            </Text>
          </View>
          <View className="rounded-2xl p-5 bg-[#1F2257]">
            <View className="rounded-2xl -min-h-screen-safe-offset-8 items-center justify-between bg-white px-5 py-6">
              {/* Success Icon */}
              <View className="flex-1 items-center justify-center">
                <View className="w-32 h-32 rounded-full bg-green-500 justify-center items-center mb-8">
                  <Ionicons name="checkmark" size={80} color="white" />
                </View>

                <Text className="text-3xl font-medium text-green-500 mb-4">
                  ĐẶT SÂN THÀNH CÔNG
                </Text>
                <Text className="text-xl text-gray-600 mb-4">
                  Booking ID. #JQKA1234
                </Text>
                <Text className="text-2xl font-medium text-gray-800 mb-5">
                  Thứ 5, ngày 3/6/2036
                </Text>
                <Text className="text-2xl font-medium text-gray-800 mb-1">
                  Sân Golf Nem Chua
                </Text>
              </View>

              <Button
                className="bg-primary w-full h-12 rounded-2xl mb-8"
                size="lg"
                textClassName="text-base"
              >
                Xác nhận
              </Button>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardProvider>
  );
};

export default BookingSuccessScreen;
