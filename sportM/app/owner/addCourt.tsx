import Button from '@/components/Button';
import AddCourtCard from '@/components/OwnerComponent/AddCourtComponent/AddCourtCard';
import HeaderUser from '@/components/ui/HeaderUser';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';


const AddCourt = () => {
  const insets = useSafeAreaInsets();
  const { courtID } = useLocalSearchParams<{
    courtID: string;
  }>();
  const [image, setImage] = React.useState<string | null>(null);

 const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };


  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1">
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
          {/* header back */}
          <View className="px-4">
            <TouchableOpacity
              className="flex-row items-center gap-2 py-2"
              onPress={() => {
                router.back();
              }}
            >
              <Ionicons name="chevron-back" size={20} />
              <Text className="text-base text-primary font-medium">
                Trở về trang trước
              </Text>
            </TouchableOpacity>
          </View>

          <View className="">
            <ImageBackground
              source={{
                uri: image || 'https://images.unsplash.com/photo-1506744038136-4627383b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
              }}
              resizeMode="cover"
              className="w-full"
              style={{ aspectRatio: 16 / 12 }}
            >
              {/* overlay làm tối ảnh một chút để chữ nổi bật */}
              <View className="absolute inset-0 bg-black/25" />
              {/* texts */}
              <View className="px-10 mt-14 flex flex-col gap-3">
                <TextInput
                  placeholder="Nhập địa điểm"
                  className="text-lg px-4 border rounded-md h-12 border-[#BDBDBD]"
                  placeholderTextColor="#DCDCDC"
                />
                <TextInput
                  placeholder="Nhập tên sân"
                  className="text-2xl px-4 border rounded-md h-14 border-[#BDBDBD]"
                  placeholderTextColor="#DCDCDC"
                />
                <Button
                  className="h-12 w-72 mx-auto rounded-xl"
                  onPress={pickImage}
                >
                  <Text className="text-base text-white font-semibold">
                   Thêm ảnh
                  </Text>
                </Button>
              </View>
            </ImageBackground>
          </View>
          <View className="shadow-2xl">
            <AddCourtCard courtID={courtID} />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardProvider>
  );
};

export default AddCourt;
