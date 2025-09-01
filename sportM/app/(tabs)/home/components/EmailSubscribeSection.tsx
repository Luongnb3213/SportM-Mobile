// components/EmailSubscribeSection.tsx
import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Input } from '@/components/Input';
import { Checkbox } from '@/components/Checkbox';
import { Button } from '@/components/Button';
import { ExternalLink } from '@/components/ExternalLink';
import { useToast } from '@/components/Toast';

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
  const { toast } = useToast();
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
      toast('Đăng ký thành công! 🎉', 'success', 2500, 'top', true);
      setEmail('');
      setAgree(false);
    } catch (e) {
      toast('Có lỗi xảy ra. Thử lại nhé!', 'destructive');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="px-4 py-6">
      {/* Eyebrow */}
      <Text className="text-2xl text-primary/80 mb-2">
        Đặt nhiều hơn, chi ít hơn
      </Text>

      {/* Heading */}
      <Text className="text-5xl font-extrabold text-primary mb-3">
        Đăng ký nhận Email
      </Text>

      {/* Subtitle */}
      <Text className="text-lg leading-7 text-muted-foreground mb-6">
        Hãy đăng ký để nhận được thông báo về những đợt sale sập sàn của SportM
      </Text>

      {/* Email label */}
      <View className="flex-row items-center gap-2 mb-2">
        <Ionicons name="mail-outline" size={18} />
        <Text className="text-base">Email</Text>
      </View>

      {/* Input – underline style */}

        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.comss"
          className="mb-5"
          inputClasses="rounded-none border-x-0 border-t-0 border-b border-input pb-3 px-0"
        />

      {/* Terms checkbox row */}
      <View className="flex-row items-start gap-3 mb-6">
        <TouchableOpacity
          onPress={() => setAgree((v) => !v)}
          activeOpacity={0.8}
        >
          <Checkbox checkboxClasses="w-5 h-5 rounded-md" className="mt-1" />
        </TouchableOpacity>

        <Text className="flex-1 text-base leading-6 text-primary">
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
        label={loading ? 'Đang gửi...' : 'Đăng ký'}
        onPress={handleSubmit}
        className="w-44 rounded-2xl bg-primary/95 disabled:opacity-40"
        labelClasses="text-yellow-300 text-lg"
      />
    </View>
  );
}
