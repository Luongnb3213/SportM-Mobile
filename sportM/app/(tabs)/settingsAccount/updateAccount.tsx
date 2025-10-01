import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { useAxios } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Button from '@/components/Button';
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup';
import { Input } from '@/components/Input';
import { router } from 'expo-router';
import UpdateAccountSkeleton from '@/components/Skeleton/UpdateAccountSkeleton';
const UpdateAccount = () => {
  const auth = useAuth();

  const [userData, setUserData] = React.useState(auth.user);
  const [loading, setLoading] = React.useState(false);
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const validate = () => {
    if (!name.trim()) return 'Tên không được để trống';
    if (!phone.trim()) return 'SĐT không được để trống';
    if (!gender) return 'Chọn giới tính';
    if (!birthdate) return 'Chọn ngày sinh';
    return null;
  };

  const handleUpdate = () => {
    const error = validate();
    if (error) {
      console.log('Validation error:', error);
      return;
    }
    console.log('Cập nhật thông tin thành công', {
      name,
      phone,
      bankAccount,
      bio,
      gender,
      birthdate,
      avatar,
    });
  };

  const handleDelete = () => {
    console.log('Tài khoản đã bị xoá!');
  };

  useEffect(() => {
    return;
    async function fetchUserData() {
      setLoading(true);
      try {
        const { data } = await useAxios.get(`/users/${auth.user?.userId}`);
        setUserData(data.data);
      } catch (error: any) {
        console.log(
          'Error fetching user data in Detail account:',
          JSON.stringify(error.message)
        );
      } finally {
        setLoading(false);
      }
    }
    fetchUserData();
  }, []);

  if(loading){
     return (
        <UpdateAccountSkeleton />
     )
  }

  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1 bg-white">
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
          className="flex-row items-center gap-2 py-2 px-4 mb-4"
        >
          <Ionicons name="chevron-back" size={22} />
          <Text className="text-[15px] text-primary font-medium">
            Trở về trang trước
          </Text>
        </TouchableOpacity>
        <View className="m-4 pb-4 border-b border-border">
          <View className="flex-col items-center gap-4">
            <TouchableOpacity onPress={pickImage}>
              <Avatar className="h-32 w-32">
                {avatar ? (
                  <AvatarImage source={{ uri: avatar }} />
                ) : (
                  <AvatarFallback textClassname="text-xl">?</AvatarFallback>
                )}
              </Avatar>
              <View className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
                <Ionicons name="camera" size={16} color="white" />
              </View>
            </TouchableOpacity>
            <CardTitle>Thông tin cá nhân</CardTitle>
          </View>
        </View>

        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
          extraKeyboardSpace={0}
        >
          <View className="mb-4 p-4 px-8">
            <View className="gap-4">
              <Input
                label="Tên người dùng"
                labelClasses="text-xl"
                value={name}
                onChangeText={setName}
              />
              <View className="flex flex-col gap-1.5">
                <Text className="text-xl">Số điện thoại</Text>
                <View className="flex-row items-center border border-input rounded-lg px-3">
                  {/* Prefix cố định */}
                  <Text className="text-base text-foreground mr-2">+84</Text>
                  <Ionicons
                    name="chevron-down"
                    size={16}
                    color="#666"
                    style={{ marginRight: 8 }}
                  />
                  <Input
                    className="flex-1"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    inputClasses="border-0 px-0"
                    style={{ borderWidth: 0 }}
                  />
                </View>
              </View>

              <Input
                label="Tài khoản ngân hàng"
                labelClasses="text-xl"
                value={bankAccount}
                onChangeText={setBankAccount}
                keyboardType="numeric"
              />

              <Text className="text-xl">Bio</Text>

              <TextInput
                placeholder="Nhập Bio"
                multiline
                value={bio}
                onChange={() => {}}
                className="min-h-[140px] rounded-2xl bg-white border border-input text-[15px]"
                editable
                numberOfLines={4}
                style={{ textAlignVertical: 'top', padding: 12 }}
              />

              {/* Ngày sinh */}
              <Text className="text-xl">Ngày sinh</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="border border-input py-2.5 px-4 rounded-lg"
              >
                <Text className="text-xl">
                  {birthdate
                    ? birthdate.toLocaleDateString('vi-VN')
                    : 'Chọn ngày sinh'}
                </Text>
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={showDatePicker}
                mode="date"
                onConfirm={(date) => {
                  setBirthdate(date);
                  setShowDatePicker(false);
                }}
                onCancel={() => setShowDatePicker(false)}
              />

              {/* Giới tính */}
              <View>
                <Text className="text-xl mb-2">Giới tính</Text>
                <RadioGroup defaultValue="">
                  <View className="flex-row gap-6">
                    <RadioGroupItem
                      value="male"
                      label="Nam"
                      onPress={() => setGender('male')}
                    />
                    <RadioGroupItem
                      value="female"
                      label="Nữ"
                      onPress={() => setGender('female')}
                    />
                  </View>
                </RadioGroup>
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>

        {/* Footer cố định */}
        <View className="absolute bottom-32 left-0 right-0 flex-row gap-4 p-4 bg-background border-t border-border">
          <Button className="flex-1" onPress={handleUpdate}>
            Cập nhật
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onPress={handleDelete}
          >
            Xoá tài khoản
          </Button>
        </View>
      </SafeAreaView>
    </KeyboardProvider>
  );
};

export default UpdateAccount;
