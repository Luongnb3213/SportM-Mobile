import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar';
import { CardTitle } from '@/components/Card';
import { useAxios } from '@/lib/api';
import { useAuth } from '@/providers/AuthProvider';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
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
import { Input } from '@/components/Input';
import { router } from 'expo-router';
import UpdateAccountSkeleton from '@/components/Skeleton/UpdateAccountSkeleton';
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';
import Toast from 'react-native-toast-message';
import { jwtDecode } from 'jwt-decode';

type Gender = 'male' | 'female' | '';

type ServerUser = {
  userId: string;
  fullName: string | null;
  email: string | null;
  phoneNumber: string | null;
  avatarUrl: string | null;
  role?: string | null;
  status?: boolean | null;

  // thêm các field mới từ BE
  accountName?: string | null;
  accountNumber?: string | null;
  bankName?: string | null;
  qrCodeUrl?: string | null;

  // có thể có sau:
  birthDate?: string | null;
  gender?: boolean | 'male' | 'female' | null;
  bio?: string | null;
  paymentInfo?: any;
};

const UpdateAccount = () => {
  const auth = useAuth();

  const [userData, setUserData] = React.useState(auth.user);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const insets = useSafeAreaInsets();

  // form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [gender, setGender] = useState<Gender>('');
  const [birthdate, setBirthdate] = useState<Date | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  // NEW: payment info states
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null); // local uri hoặc url

  const [showDatePicker, setShowDatePicker] = useState(false);

  // error states
  const [errors, setErrors] = useState<{
    name?: string;
    phone?: string;
    bio?: string;
    gender?: string;
    birthdate?: string;
    general?: string;

    // NEW:

    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    qrCode?: string;
  }>({});

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

  const pickQrImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // QR thường là ảnh hình vuông
      aspect: [1, 1],
      quality: 0.9,
    });
    if (!result.canceled) {
      setQrCode(result.assets[0].uri);
      if (errors.qrCode) setErrors((e) => ({ ...e, qrCode: undefined }));
    }
  };

  // simple VN-ish rules you can tweak later
  const validate = () => {
    const next: typeof errors = {};

    // Info cơ bản
    if (!name.trim()) next.name = 'Tên không được để trống';
    if (!phone.trim()) next.phone = 'SĐT không được để trống';
    else if (!/^\d{9,11}$/.test(phone.trim())) next.phone = 'SĐT không hợp lệ (9–11 số)';
    if (!bio.trim()) next.bio = 'Bio không được để trống';
    if (!gender) next.gender = 'Vui lòng chọn giới tính';
    if (!birthdate) next.birthdate = 'Vui lòng chọn ngày sinh';

    // Payment info
    if (!accountName.trim()) next.accountName = 'Chủ tài khoản là bắt buộc';
    else if (!/^[\p{L}\s'.-]{2,50}$/u.test(accountName.trim()))
      next.accountName = 'Chủ tài khoản chỉ chứa chữ/cách (2–50 ký tự)';

    if (!accountNumber.trim()) next.accountNumber = 'Số tài khoản là bắt buộc';
    else if (!/^\d{8,19}$/.test(accountNumber.trim()))
      next.accountNumber = 'Số tài khoản phải là số (8–19 chữ số)';

    if (!bankName.trim()) next.bankName = 'Tên ngân hàng là bắt buộc';
    else if (bankName.trim().length < 2) next.bankName = 'Tên ngân hàng quá ngắn';

    if (!qrCode) next.qrCode = 'Vui lòng chọn ảnh QR chuyển khoản';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);
      setErrors((e) => ({ ...e, general: undefined }));

      // 1) Upload avatar nếu có chọn ảnh mới
      let avatarUrlFinal: string | undefined = undefined;
      if (avatar && !avatar.startsWith('http')) {
        const up = await uploadToCloudinary(avatar, {
          folder: 'mobile_uploads',
          tags: ['avatar', 'user'],
          context: { screen: 'UpdateAccount' },
        });
        avatarUrlFinal = up.secure_url || up.url;
      } else if (avatar) {
        avatarUrlFinal = avatar; // đã là URL
      }

      // 2) Upload QR nếu là ảnh local
      let qrCodeUrlFinal: string | undefined = undefined;
      if (qrCode && !qrCode.startsWith('http')) {
        const upQR = await uploadToCloudinary(qrCode, {
          folder: 'payment_qr',
          tags: ['qr', 'payment'],
          context: { screen: 'UpdateAccount' },
        });
        qrCodeUrlFinal = upQR.secure_url || upQR.url;
      } else if (qrCode) {
        qrCodeUrlFinal = qrCode; // đã là URL
      }

      // 3) Cập nhật thông tin user cơ bản
      const userId = auth.user?.userId as string | undefined;
      if (!userId) {
        throw new Error('Thiếu userId. Hãy truyền hoặc gán userId trước khi gọi API.');
      }

      const bodyUser = {
        fullName: name.trim(),
        avatarUrl: avatarUrlFinal,
        phoneNumber: phone.trim(),
        bio: bio.trim(),
        birthDate: birthdate ? new Date(birthdate).toISOString().slice(0, 10) : undefined,
        gender: gender === 'male',
      };

      const { data: patchUserRes } = await useAxios.patch(`/users/${userId}`, bodyUser);
      const newUser = jwtDecode(patchUserRes?.data?.token);
      auth.setUser(newUser);

      // 4) Cập nhật payment info owner
      const paymentPayload = {
        accountName: accountName.trim(),
        accountNumber: accountNumber.trim(),
        bankName: bankName.trim(),
        qrCodeUrl: qrCodeUrlFinal as string, // đã validate bắt buộc
      };

      await useAxios.put('/admin/users/payment-info', paymentPayload);

      Toast.show({
        type: 'success',
        text1: 'Cập nhật thành công',
        text2: 'Thông tin tài khoản & thanh toán đã được cập nhật.',
      });
    } catch (err: any) {
      console.log('Lỗi cập nhật:', JSON.stringify(err) || err);
      Toast.show({
        type: 'error',
        text1: 'Cập nhật thất bại',
        text2: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = () => {
    router.back();
  };

  const hydrateFormFromUser = (u?: Partial<ServerUser> | null) => {
    if (!u) return;
    setName(u.fullName ?? '');
    setPhone(u.phoneNumber ?? '');
    setAvatar(u.avatarUrl ?? null);
    setBio(u.bio ?? '');

    if (u.birthDate) {
      const d = new Date(u.birthDate);
      if (!Number.isNaN(d.getTime())) setBirthdate(d);
    }

    if (typeof u.gender === 'boolean') {
      setGender(u.gender ? 'male' : 'female');
    } else if (u.gender === 'male' || u.gender === 'female') {
      setGender(u.gender);
    } else {
      setGender('');
    }

    // NEW: hydrate payment info
    setAccountName(u?.paymentInfo?.accountName ?? '');
    setAccountNumber(u?.paymentInfo?.accountNumber ?? '');
    setBankName(u?.paymentInfo.bankName ?? '');
    setQrCode(u?.paymentInfo.qrCodeUrl ?? null);
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchUserData() {
      setLoading(true);
      try {
        const { data } = await useAxios.get(`/users/${auth.user?.userId}`);
        const userFromServer: ServerUser = data.data;
        console.log('Fetched user data:', userFromServer);
        if (isMounted) {
          setUserData(userFromServer as any);
          hydrateFormFromUser(userFromServer);
        }
      } catch (error: any) {
        console.log('Error fetching user data in Detail account:', JSON.stringify(error?.message));
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchUserData();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return <UpdateAccountSkeleton />;
  }

  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1 bg-white">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-2 py-2 px-4 mb-4"
        >
          <Ionicons name="chevron-back" size={22} />
          <Text className="text-[15px] text-primary font-medium">
            Trở về trang trước
          </Text>
        </TouchableOpacity>

        <View className="m-4 pb-4 border-b border-border">
          <View className="flex-col items-center gap-4">
            {/* Avatar */}
            <TouchableOpacity onPress={pickImage} disabled={submitting}>
              <Avatar className="h-32 w-32">
                {avatar ? (
                  <AvatarImage source={{ uri: avatar }} />
                ) : (
                  <AvatarFallback textClassname="text-xl">?</AvatarFallback>
                )}
              </Avatar>
              <View className="absolute bottom-0 right-0 bg-primary rounded-full p-1 opacity-90">
                <Ionicons name="camera" size={16} color="white" />
              </View>
            </TouchableOpacity>
            <CardTitle>Thông tin cá nhân & thanh toán</CardTitle>
          </View>
        </View>

        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 180 }}
          extraKeyboardSpace={0}
        >
          <View className="mb-4 p-4 px-8">
            <View className="gap-4">
              {/* Tên */}
              <View>
                <Input
                  label="Tên người dùng"
                  labelClasses="text-xl"
                  className={`${errors.name ? 'border-red-500' : 'border-input'}`}
                  value={name}
                  onChangeText={(t) => {
                    setName(t);
                    if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
                  }}
                  editable={!submitting}
                  style={{ borderColor: errors.name ? 'red' : "#ebebeb" }}
                />
                {errors.name ? (
                  <Text className="text-red-500 text-sm mt-1">{errors.name}</Text>
                ) : null}
              </View>

              {/* Số điện thoại */}
              <View>
                <View className="flex flex-col gap-1.5">
                  <Text className="text-xl">Số điện thoại</Text>
                  <View className={`flex-row items-center rounded-lg px-3 border ${errors.phone ? 'border-red-500' : 'border-input'}`}>
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
                      onChangeText={(t) => {
                        setPhone(t);
                        if (errors.phone) setErrors((e) => ({ ...e, phone: undefined }));
                      }}
                      keyboardType="phone-pad"
                      inputClasses="border-0 px-0"
                      style={{ borderWidth: 0 }}
                      editable={!submitting}
                    />
                  </View>
                </View>
                {errors.phone ? (
                  <Text className="text-red-500 text-sm mt-1">{errors.phone}</Text>
                ) : null}
              </View>

              {/* Bio */}
              <View>
                <Text className="text-xl">Bio</Text>
                <TextInput
                  placeholder="Nhập Bio"
                  multiline
                  value={bio}
                  onChange={(e) => {
                    setBio(e.nativeEvent.text);
                    if (errors.bio) setErrors((er) => ({ ...er, bio: undefined }));
                  }}
                  className={`min-h-[140px] rounded-2xl bg-white border text-[15px] ${errors.bio ? 'border-red-500' : 'border-input'}`}
                  editable={!submitting}
                  numberOfLines={4}
                  style={{ textAlignVertical: 'top', padding: 12 }}
                />
                {errors.bio ? (
                  <Text className="text-red-500 text-sm mt-1">{errors.bio}</Text>
                ) : null}
              </View>

              {/* Ngày sinh */}
              <View>
                <Text className="text-xl">Ngày sinh</Text>
                <TouchableOpacity
                  onPress={() => !submitting && setShowDatePicker(true)}
                  className={`py-2.5 px-4 rounded-lg border ${errors.birthdate ? 'border-red-500' : 'border-input'}`}
                  disabled={submitting}
                >
                  <Text className="text-xl">
                    {birthdate ? birthdate.toLocaleDateString('vi-VN') : 'Chọn ngày sinh'}
                  </Text>
                </TouchableOpacity>
                {errors.birthdate ? (
                  <Text className="text-red-500 text-sm mt-1">{errors.birthdate}</Text>
                ) : null}
              </View>

              <View>
                <DateTimePickerModal
                  isVisible={showDatePicker}
                  mode="date"
                  onConfirm={(date) => {
                    setBirthdate(date);
                    setErrors((e) => ({ ...e, birthdate: undefined }));
                    setShowDatePicker(false);
                  }}
                  onCancel={() => setShowDatePicker(false)}
                />
              </View>

              {/* Giới tính — segmented buttons */}
              <View>
                <Text className="text-xl mb-2 mt-2">Giới tính</Text>
                <View className="flex-row gap-3">
                  <Button
                    variant={gender === 'male' ? 'default' : 'outline'}
                    onPress={() => {
                      setGender('male');
                      if (errors.gender) setErrors((e) => ({ ...e, gender: undefined }));
                    }}
                    className="flex-1"
                    disabled={submitting}
                  >
                    Nam
                  </Button>
                  <Button
                    variant={gender === 'female' ? 'default' : 'outline'}
                    onPress={() => {
                      setGender('female');
                      if (errors.gender) setErrors((e) => ({ ...e, gender: undefined }));
                    }}
                    className="flex-1"
                    disabled={submitting}
                  >
                    Nữ
                  </Button>
                </View>
                {errors.gender ? (
                  <Text className="text-red-500 text-sm mt-1">{errors.gender}</Text>
                ) : null}
              </View>

              {/* --- PAYMENT INFO --- */}
              <View className="mt-4 border-t border-border pt-4">
                <Text className="text-xl font-semibold mb-2">Thông tin thanh toán (bắt buộc)</Text>

                {/* Account Name */}
                <Input
                  label="Chủ tài khoản"
                  labelClasses="text-base"
                  value={accountName}
                  onChangeText={(t) => {
                    setAccountName(t);
                    if (errors.accountName) setErrors((e) => ({ ...e, accountName: undefined }));
                  }}
                  editable={!submitting}
                  autoCapitalize="characters"
                  style={{ borderColor: errors.accountName ? 'red' : '#ebebeb' }}
                />
                {errors.accountName ? (
                  <Text className="text-red-500 text-sm mt-1">{errors.accountName}</Text>
                ) : null}

                {/* Account Number */}
                <Input
                  label="Số tài khoản"
                  labelClasses="text-base mt-3"
                  value={accountNumber}
                  onChangeText={(t) => {
                    setAccountNumber(t);
                    if (errors.accountNumber) setErrors((e) => ({ ...e, accountNumber: undefined }));
                  }}
                  keyboardType="number-pad"
                  editable={!submitting}
                  style={{ borderColor: errors.accountNumber ? 'red' : '#ebebeb' }}
                />
                {errors.accountNumber ? (
                  <Text className="text-red-500 text-sm mt-1">{errors.accountNumber}</Text>
                ) : null}

                {/* Bank Name */}
                <Input
                  label="Ngân hàng"
                  labelClasses="text-base mt-3"
                  value={bankName}
                  onChangeText={(t) => {
                    setBankName(t);
                    if (errors.bankName) setErrors((e) => ({ ...e, bankName: undefined }));
                  }}
                  editable={!submitting}
                  style={{ borderColor: errors.bankName ? 'red' : '#ebebeb' }}
                />
                {errors.bankName ? (
                  <Text className="text-red-500 text-sm mt-1">{errors.bankName}</Text>
                ) : null}

                {/* QR Code Picker */}
                <View className="mt-4">
                  <Text className="text-base mb-2">QR chuyển khoản</Text>
                  <TouchableOpacity
                    onPress={pickQrImage}
                    activeOpacity={0.85}
                    disabled={submitting}
                    className={`rounded-xl border ${errors.qrCode ? 'border-red-500' : 'border-border'
                      } overflow-hidden`}
                    style={{ width: '100%', aspectRatio: 1 }}
                  >
                    {qrCode ? (
                      <Image source={{ uri: qrCode }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                    ) : (
                      <View className="flex-1 items-center justify-center bg-muted">
                        <Ionicons name="qr-code-outline" size={40} color="#888" />
                        <Text className="mt-2 text-muted-foreground">Chạm để chọn ảnh QR</Text>
                      </View>
                    )}
                    <View className="absolute bottom-2 right-2 bg-primary rounded-full p-2 opacity-90">
                      <Ionicons name="camera" size={16} color="white" />
                    </View>
                  </TouchableOpacity>
                  {errors.qrCode ? (
                    <Text className="text-red-500 text-sm mt-1">{errors.qrCode}</Text>
                  ) : null}
                </View>
              </View>

              {/* Lỗi chung */}
              {errors.general ? (
                <Text className="text-red-500 text-sm mt-2">{errors.general}</Text>
              ) : null}
            </View>
          </View>
        </KeyboardAwareScrollView>

        {/* Footer cố định */}
        <View className="absolute bottom-[40px] left-0 right-0 flex-row gap-4 p-4 bg-background border-t border-border">
          <Button className="flex-1" onPress={handleUpdate} disabled={submitting}>
            {submitting ? (
              <View className="flex-row items-center justify-center gap-2">
                <ActivityIndicator size="small" />
                <Text className="text-base">Đang cập nhật...</Text>
              </View>
            ) : (
              'Cập nhật'
            )}
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onPress={handleDelete}
            disabled={submitting}
          >
            Huỷ
          </Button>
        </View>
      </SafeAreaView>
    </KeyboardProvider>
  );
};

export default UpdateAccount;
