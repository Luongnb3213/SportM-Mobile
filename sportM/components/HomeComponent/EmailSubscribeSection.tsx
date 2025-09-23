// components/EmailSubscribeSection.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import { Checkbox } from '@/components/Checkbox';
import Button from '@/components/Button';
import { ExternalLink } from '@/components/ExternalLink';


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
    try {
      setLoading(true);
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
        />
      </View>

      {/* Terms checkbox row */}
      <View className="flex-row items-start gap-3 mb-6">
        <TouchableOpacity
          onPress={() => setAgree((v) => !v)}
          activeOpacity={0.8}
        >
          <Checkbox checkboxClasses="w-5 h-5" className="mt-1" />
        </TouchableOpacity>

        <Text className="flex-1 text-base leading-6 text-[#454545] italic">
          Tôi đã đọc, đồng ý với các điều khoản của{' '}
          <ExternalLink
            href={privacyUrl as any}
            className="underline text-primary/70"
          >
            Chính sách bảo mật
          </ExternalLink>
        </Text>
      </View>

      {/* Submit */}
      <Button
        onPress={handleSubmit}
        className="w-36 h-12 rounded-2xl bg-primary/95 disabled:opacity-40"
        textClassName="text-yellow-300 text-lg"
      >
        {loading ? 'Đang gửi...' : 'Đăng ký'}
      </Button>
    </View>
  );
}
