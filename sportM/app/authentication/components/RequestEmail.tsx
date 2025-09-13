import React, { useState } from 'react';
import {
  View,
  Text,
} from 'react-native';
import { Input } from '@/components/Input';
import Button from '@/components/Button';

type RequestEmailProps = {
  onSubmit: (email: string) => Promise<void> | void;
  defaultEmail?: string;
  submittingText?: string; // ví dụ: "Đang gửi..."
};
 const RequestEmail: React.FC<RequestEmailProps> = ({
  onSubmit,
  defaultEmail = '',
  submittingText = 'Đang gửi...',
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onSubmit(email.trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>

      {/* Tiêu đề */}
      <Text className="text-xl font-semibold text-black text-center mt-6">
        Quên mật khẩu
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
          onChangeText={setEmail}
        />

        <Button
          className="mt-5 bg-[#1F2257]"
          variant='default'
          size='lg'
          onPress={handleSubmit}
          textClassName='text-white text-base font-semibold'
        >
          {loading ? (
            submittingText
          ) : (
            `Nhận mã OTP`
          )}
        </Button>
      </View>
    </View>
  );
};

export default RequestEmail;