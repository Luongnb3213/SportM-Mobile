import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/Card';
import { useAxios } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
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

  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1">
        <Card className="m-4">
          <CardHeader className="flex-row items-center gap-4">
            <TouchableOpacity onPress={pickImage}>
              <Avatar className="h-20 w-20">
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
          </CardHeader>
        </Card>

        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          extraKeyboardSpace={0}
        >
          <Card className="mb-4 p-4">
            <CardContent className="gap-4">
              <Input label="Tên" value={name} onChangeText={setName} />
              <Input
                label="Số điện thoại"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              <Input
                label="Bank Account"
                value={bankAccount}
                onChangeText={setBankAccount}
                keyboardType="numeric"
              />
              <Input label="Bio" value={bio} onChangeText={setBio} multiline />

              {/* Ngày sinh */}
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="border border-input py-2.5 px-4 rounded-lg"
              >
                <Text className="text-base">
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
                <Text className="text-base mb-2">Giới tính</Text>
                <RadioGroup defaultValue="">
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
                </RadioGroup>
              </View>
            </CardContent>
          </Card>
        </KeyboardAwareScrollView>

        {/* Footer cố định */}
        <View className="absolute bottom-0 left-0 right-0 flex-row gap-4 p-4 bg-background border-t border-border">
          <Button
            variant="destructive"
            className="flex-1"
            onPress={handleDelete}
          >
            Xoá tài khoản
          </Button>
          <Button className="flex-1" onPress={handleUpdate}>
            Cập nhật
          </Button>
        </View>
      </SafeAreaView>
    </KeyboardProvider>
  );
};

export default UpdateAccount;
