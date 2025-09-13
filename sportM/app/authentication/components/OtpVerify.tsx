import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
} from 'react-native';
import Button from '@/components/Button';
import { OTPInput } from '@/components/OTPInput';

type OtpVerifyProps = {
  maskedEmail: string; // ví dụ: mother*****@gmail.com
  length?: number; // default 6
  onResend?: () => void; // handler khi bấm "Gửi lại"
  onConfirm: (code: string) => Promise<void> | void;
  errorText?: string | false; // hiển thị lỗi otp (nếu có)
  submittingText?: string; // "Đang xác nhận..."
};

const OtpVerify: React.FC<OtpVerifyProps> = ({
  maskedEmail,
  length = 6,
  onResend,
  onConfirm,
  errorText = false,
  submittingText = 'Đang xác nhận...',
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onConfirm(code);
    } finally {
      setLoading(false);
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
        Nhập mã OTP đã gửi qua{' '}
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
      >
        {loading ? submittingText : 'Xác nhận'}
      </Button>
    </View>
  );
};


export default OtpVerify;