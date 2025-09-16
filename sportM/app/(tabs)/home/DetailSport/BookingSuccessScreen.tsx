import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BookingSuccessScreen = () => {
  // <CHANGE> Added coordinates for the venue location
  const venueCoordinates = {
    latitude: 10.8231, // Ví dụ tọa độ TP.HCM
    longitude: 106.6297,
  };

  const handleCopyCode = () => {
    console.log('Copy code');
  };

  const handleShareLink = () => {
    console.log('Share link');
  };

  // <CHANGE> Added function to open Google Maps
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
    <SafeAreaView className="flex-1 bg-[#3B4CB8]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity className="mr-3">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-base font-medium">
          Trở về trang trước
        </Text>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Success Card */}
        <View className="bg-white rounded-2xl p-6 items-center mb-5">
          {/* Success Icon */}
          <View className="w-16 h-16 rounded-full bg-green-500 justify-center items-center mb-4">
            <Ionicons name="checkmark" size={32} color="white" />
          </View>

          {/* Success Text */}
          <Text className="text-lg font-bold text-green-500 mb-4">
            ĐẶT SÂN THÀNH CÔNG
          </Text>

          {/* Booking Details */}
          <Text className="text-sm text-gray-600 mb-2">
            Booking ID. #JQKA1234
          </Text>
          <Text className="text-base font-semibold text-gray-800 mb-1">
            Thứ 5, ngày 3/6/2036
          </Text>
          
          {/* <CHANGE> Made venue text clickable to open Google Maps */}
          <TouchableOpacity onPress={openGoogleMaps}>
            <Text className="text-sm text-blue-600 underline mb-5">
              Nem Chua • Ngoài trời 📍
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="w-full h-px bg-gray-200 mb-5 border-dashed" />

          {/* Barcode Container */}
          <View className="items-center w-full">
            <View className="flex-row h-15 items-end mb-2">
              {Array.from({ length: 50 }).map((_, index) => (
                <View
                  key={index}
                  className="bg-black h-full mx-px"
                  style={{ width: Math.random() > 0.5 ? 2 : 1 }}
                />
              ))}
            </View>
            <Text className="text-xs text-gray-600 text-center">
              Mã này có thể sử dụng để thay thế vé
            </Text>
          </View>
        </View>

        {/* <CHANGE> Added location button */}
        <TouchableOpacity 
          className="bg-white rounded-2xl p-4 mb-5 flex-row items-center justify-between"
          onPress={openGoogleMaps}
        >
          <View className="flex-row items-center">
            <Ionicons name="location" size={24} color="#3B4CB8" />
            <Text className="text-base font-medium text-gray-800 ml-3">
              Xem vị trí trên bản đồ
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        {/* Referral Section */}
        <View className="bg-white rounded-2xl p-5 mb-5">
          <Text className="text-sm text-gray-800 mb-2 leading-5">
            Giới thiệu thành viên mới ngay để tăng liền tay nhiều phần quà giá trị
          </Text>
          <Text className="text-xs text-gray-600 mb-4">
            Bạn và người giới thiệu đều có cơ hội nhận phần thưởng
          </Text>
          
          <Text className="text-xs text-gray-600 mb-1">
            Mã giới thiệu
          </Text>
          <Text className="text-lg font-bold text-gray-800 mb-5">
            URGAY - METOO
          </Text>

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity 
              className="flex-1 bg-[#3B4CB8] py-3 rounded-lg items-center"
              onPress={handleCopyCode}
            >
              <Text className="text-white text-sm font-medium">
                Sao chép mã
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              className="flex-1 bg-transparent border border-[#3B4CB8] py-3 rounded-lg items-center"
              onPress={handleShareLink}
            >
              <Text className="text-[#3B4CB8] text-sm font-medium">
                Chia sẻ liên kết
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookingSuccessScreen;