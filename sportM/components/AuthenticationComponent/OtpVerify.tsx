import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Button from '@/components/Button';
import { OTPInput } from '@/components/OTPInput';
import { useAxios } from '@/lib/api';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';

type OtpVerifyProps = {
  maskedEmail: string; // ví dụ: mother*****@gmail.com
  length?: number; // default 6
  errorText?: string | false; // hiển thị lỗi otp (nếu có)
  submittingText?: string; // "Đang xác nhận..."
  from?: string;
};

const OtpVerify: React.FC<OtpVerifyProps> = ({
  maskedEmail,
  length = 6,
  errorText = false,
  submittingText = 'Đang xác nhận...',
  from,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data: res } = await useAxios.post('/auth/verify-otp', {
        email: maskedEmail.trim(),
        otp: code.trim(),
      });
      if (res.status == 'success') {
        if (from === 'signup') {
          router.push({
            pathname: '/authentication',
            params: { screenname: 'signup', email: maskedEmail.trim() },
          });
        } else {
          router.push({
            pathname: '/authentication/ChangePassword',
            params: { screenname: 'forgotpassword', email: maskedEmail.trim() },
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const onResend = async () => {
    setCode('');
    const url = from === 'forgotpassword' ? '/auth/send-otp-forgot-password' : '/auth/send-otp-signup';
    try {
      const { data: res } = await useAxios.post(url, {
        email: maskedEmail.trim(),
      });
      if (res.status == 'success') {
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Mã OTP đã được gửi lại đến email của bạn',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể gửi lại mã OTP',
      });
    }
  };

  return (
    <View>
      {/* Tiêu đề */}
      <Text className="text-xl font-semibold text-black text-center mt-6">
        Nhập mã OTP
      </Text>

      {/* Mô tả + email */}
      <Text className="text-base text-black/70 text-center mt-2">
        Nhập mã OTP đã gửi qua {''}
        <Text className="font-semibold text-black">{maskedEmail}</Text>
      </Text>

      {/* OTP input */}
      <View className="mt-8 items-center">
        <OTPInput
          length={length}
          value={code}
          onChange={setCode}
          error={errorText}
          keyboard="numeric"
          size="sm"
          shouldAutoSubmit={false}
          ariaLabel="OTP Input"
          shouldHandleClipboard={false}
        />
      </View>

      {/* Hàng “Bạn chưa nhận được mã? Gửi lại” */}
      <View className="mt-6 flex-row justify-center gap-2">
        <Text className="text-black/60">Bạn chưa nhận được mã OTP?</Text>
        {onResend ? (
          <Pressable onPress={onResend}>
            <Text className="text-[#1F2257] font-semibold">Gửi lại mã Otp</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Nút xác nhận */}
      <Button
        className="mt-6"
        onPress={handleConfirm}
        disabled={code.length !== length || loading}
        textClassName="text-base"
      >
        {loading ? submittingText : 'Xác nhận'}
      </Button>
    </View>
  );
};

export default OtpVerify;
