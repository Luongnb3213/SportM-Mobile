// components/EmailSubscribeSection.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import { Checkbox } from '@/components/Checkbox';
import Button from '@/components/Button';
import Toast from 'react-native-toast-message';


type Props = {
  onSubmit?: (email: string) => Promise<void> | void;
  privacyUrl?: string;
  defaultEmail?: string;
};

export default function EmailSubscribeSection({
  onSubmit,
  privacyUrl = 'https://example.com/privacy',
  defaultEmail = '',
}: Props) {
  const [email, setEmail] = useState(defaultEmail);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const valid = useMemo(
    () => /^\S+@\S+\.\S+$/.test(email) && agree,
    [email, agree]
  );


  const handleSubmit = async () => {
    if (!valid || loading) return;
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      Toast.show({
        type: 'success',
        text1: 'Cảm ơn bạn đã đăng ký!',
        text2: 'Chúng tôi sẽ gửi thông tin đến email của bạn sớm nhất có thể.',
      })
      if (onSubmit) await onSubmit(email);
      setEmail('');
      setAgree(false);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="px-4 py-6 bg-[#EBE8E8]">
      {/* Eyebrow */}
      <Text className="text-2xl text-[#454545] mb-4">
        Đặt nhiều hơn, chi ít hơn
      </Text>

      {/* Heading */}
      <Text className="text-4xl font-semibold text-[#222222] mb-3">
        Đăng ký làm Chủ Sân
      </Text>

      {/* Subtitle */}
      <Text className="text-lg leading-7 text-muted-foreground mb-6">
        Hãy đăng ký để nhận được thông báo về những đợt sale sập sàn của SportM
      </Text>

      {/* Email label */}
      <View className="flex-col items-start gap-2 mb-2">
        <Text className="text-base">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          className="mb-5 w-full border-b text-lg border-[#000]"
          keyboardType="email-address"
          textContentType="emailAddress"
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />
      </View>

      {/* Terms checkbox row */}
      <View className="flex-row items-start gap-1 mb-6">
        <TouchableOpacity
          onPress={() => setAgree((v) => !v)}
          activeOpacity={0.8}
          className="flex flex-row items-center gap-2"
        >
          <View
            className={`w-5 h-5 border-2 mt-1 rounded-sm flex items-center justify-center ${agree ? 'bg-primary border-primary' : 'border-gray-400'
              }`}
          >
            {agree && <Text className="text-white text-sm">✓</Text>}
          </View>
        </TouchableOpacity>

        <Text className="flex-1 text-base leading-6 text-[#454545] italic">
          Tôi đã đọc, đồng ý với các điều khoản của{' '}
          <Text
            onPress={() => Linking.openURL(privacyUrl).catch(err => console.error('Error opening maps', err))}
            className="underline text-primary/70"
          >
            Chính sách bảo mật
          </Text>
        </Text>
      </View>

      {/* Submit */}
      <Button
        onPress={handleSubmit}
        disabled={!valid || loading}
        className="w-36 h-12 rounded-2xl bg-primary/95 disabled:opacity-40"
        textClassName="text-yellow-300 text-lg"
      >
        {loading ? 'Đang gửi...' : 'Đăng ký'}
      </Button>
    </View>
  );
}
