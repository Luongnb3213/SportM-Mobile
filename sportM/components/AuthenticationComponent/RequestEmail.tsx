import React, { useState, useMemo } from 'react';
import { View, Text } from 'react-native';
import { Input } from '@/components/Input';
import Button from '@/components/Button';
import { useAxios } from '@/lib/api';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

type RequestEmailProps = {
  defaultEmail?: string;
  submittingText?: string;
  from?: string;
};

const RequestEmail: React.FC<RequestEmailProps> = ({
  defaultEmail = '',
  submittingText = 'Đang gửi...',
  from,
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isValidEmail = useMemo(() => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return re.test(email.trim());
  }, [email]);

  const handleSubmit = async () => {
    if (loading) return;

    if (!email.trim()) {
      setError('Email là bắt buộc');
      return;
    }
    if (!isValidEmail) {
      setError('Email không hợp lệ');
      return;
    }
    setError(null);
    setLoading(true);

    if (from === 'forgotpassword') {
      try {
        const { data: res } = await useAxios.post(
          '/auth/send-otp-forgot-password',
          {
            email: email.trim(),
          }
        );
        if (res.status == 'success') {
          Toast.show({
            type: 'success',
            text1: 'Thành công',
            text2: 'Mã OTP đã được gửi đến email của bạn',
          });
          router.push({
            pathname: '/authentication/VerifyEmail',
            params: { email: email.trim(), mode: from },
          });
        }
      } catch (error: any) {
        console.log(JSON.stringify(error.response));

        if (error.status === 404) {
          Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: 'Email không tồn tại',
          });
        }else{
           Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
          });
        }
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const { data: res } = await useAxios.post('/auth/send-otp-signup', {
          email: email.trim(),
        });
        if (res.status == 'success') {
          Toast.show({
            type: 'success',
            text1: 'Thành công',
            text2: 'Mã OTP đã được gửi đến email của bạn',
          });
          router.push({
            pathname: '/authentication/VerifyEmail',
            params: { email: email.trim(), mode: from },
          });
        }
      } catch (error: any) {
        if (error.status === 409) {
          Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: 'Email đã được sử dụng',
          });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View>
      {/* Tiêu đề */}
      <Text className="text-xl font-semibold text-black text-center mt-6">
        {from === 'forgotpassword' ? 'Quên mật khẩu' : 'Nhập email'}
      </Text>

      {/* Mô tả */}
      <Text className="text-base text-black/70 text-center mt-2">
        Chúng tôi sẽ gửi mã OTP qua email của bạn. OTP có hiệu lực trong vòng 15
        phút
      </Text>

      {/* Form */}
      <View className="mt-8">
        <Input
          label="Email"
          placeholder="Nhập email"
          inputClasses="rounded-lg"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            if (error) setError(null);
          }}
        />
        {error && <Text className="text-red-500 italic mt-1">{error}</Text>}

        <Button
          className="mt-5 bg-[#1F2257]"
          variant="default"
          size="lg"
          onPress={handleSubmit}
          disabled={loading}
          textClassName="text-white text-base font-semibold"
        >
          {loading ? submittingText : `Nhận mã OTP`}
        </Button>
      </View>
    </View>
  );
};

export default RequestEmail;
