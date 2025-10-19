// ProfileScreen.tsx
import React, { useEffect } from 'react';
import { Image, View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, Ionicons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/Avatar';
import { Card, CardContent } from '@/components/Card';
import { router } from 'expo-router';
import { clearTokens } from '@/lib/tokenStorage';
import { useAuth } from '@/providers/AuthProvider';
import { useAxios } from '@/lib/api';
import ProfileScreenSkeleton from '@/components/Skeleton/ProfileScreenSkeleton';
import TermsModal from '@/components/SettingAccountComponent/TermsModal';
import terms from '@/components/SettingAccountComponent/termsData';
import termsContact from '@/components/SettingAccountComponent/termsContact';
import { Platform } from 'react-native';


export default function detailAccount() {
  const version = '1.0.0';
  const auth = useAuth();

  const [userData, setUserData] = React.useState(auth.user);
  const [loading, setLoading] = React.useState(false);
  const [showTerms, setShowTerms] = React.useState(false);
  const [showContact, setShowContact] = React.useState(false);


  useEffect(() => {
    if (!auth.user) {
      router.replace('/authentication')
    }
  }, [])

  useEffect(() => {
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

  const handleLogout = () => {
    clearTokens();
    router.replace('/authentication');
    auth.setUser(null);
    console.log('Logging out...');
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <ProfileScreenSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Top bar */}
        <View className="px-4 pb-2 flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
            className="flex-row items-center gap-2 py-2"
          >
            <Ionicons name="chevron-back" size={22} />
            <Text className="text-[15px] text-primary font-medium">
              Trở về trang trước
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.push('/owner/updateAccount');
            }}
          >
            <View className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-2xl">
              <Ionicons name="create-outline" size={24} />
            </View>
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 200 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-4">
            {/* Card container */}
            <View className="rounded-2xl overflow-hidden bg-white">
              <Card className="border-0">
                <CardContent className="p-0">
                  {/* Cover */}
                  <View className="relative">
                    {userData?.avatarUrl ? (
                      <Image
                        source={{ uri: userData?.avatarUrl }}
                        className="w-full"
                        style={{ aspectRatio: 16 / 9 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View
                        className="w-full items-center justify-center"
                        style={{
                          aspectRatio: 16 / 9,
                          backgroundColor: '#e1e1e1',
                        }}
                      >
                        <Text className="text-5xl font-bold text-primary">
                          {userData?.fullName
                            ?.split(' ')
                            .map((w: string) => w[0])
                            .slice(0, 2)
                            .join('') || 'U'}
                        </Text>
                      </View>
                    )}

                    {/* Avatar overlap */}
                    <View className="absolute left-1/2 -translate-x-1/2 -bottom-10">
                      <Avatar className="w-28 h-28 border-4 border-white">
                        {userData?.avatarUrl ? (
                          <AvatarImage source={{ uri: userData.avatarUrl }} />
                        ) : (
                          <AvatarFallback textClassname="text-base">
                            {userData?.fullName
                              ?.split(' ')
                              .map((w: string) => w[0])
                              .slice(0, 2)
                              .join('') || 'U'}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </View>
                  </View>

                  {/* Name */}
                  <View className="items-center mt-14 px-4">
                    <Text className="text-[20px] font-semibold text-primary text-center">
                      {userData?.fullName || ''}
                    </Text>
                  </View>

                  {/* 3 quick actions */}
                  <View className="flex-row gap-3 bg-white px-5 py-1 mt-4 border border-[#eee] shadow-sm rounded-2xl">
                    <QuickAction
                      icon={
                        <Ionicons name="information-circle-outline" size={18} />
                      }
                      label="Thông tin"
                      onPress={() => setShowTerms(true)}
                    />
                    <QuickAction
                      icon={<Octicons name="issue-opened" size={18} />}
                      label="Báo lỗi"
                      onPress={() => setShowContact(true)}
                    />
                    <QuickAction
                      icon={<MaterialCommunityIcons name="logout" size={18} />}
                      label="Đăng xuất"
                      onPress={handleLogout}
                    />
                  </View>

                  {/* Hoạt động */}
                  <SectionHeader title="Hoạt động" className="mt-5 px-4" />
                  <View className="px-4">
                    <ListItem
                      icon={<FontAwesome name="money" size={18} color="black" />}
                      label="Lịch sử thanh toán"
                      onPress={() => { router.push('/owner/my-payments') }}
                    />
                  </View>

                  {/* Hệ thống */}
                  <SectionHeader title="Hệ thống" className="mt-4 px-4" />
                  <View className="px-4">
                    <ListItem
                      icon={
                        <Ionicons name="information-circle-outline" size={18} />
                      }
                      label={`Thông tin phiên bản: ${version}`}
                      onPress={() => { }}
                    />
                    <ListItem
                      icon={<Ionicons name="document-text-outline" size={18} />}
                      label="Điều khoản và chính sách"
                      onPress={() => setShowTerms(true)}
                    />
                  </View>
                </CardContent>
              </Card>
            </View>
          </View>
          <TermsModal
            visible={showTerms}
            onClose={() => setShowTerms(false)}
            title="Điều khoản sử dụng & Chính sách"
            sections={terms}
          />
          <TermsModal
            visible={showContact}
            onClose={() => setShowContact(false)}
            title="Liên hệ với chúng tôi"
            sections={termsContact}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


function SectionHeader({
  title,
  className = '',
}: {
  title: string;
  className?: string;
}) {
  return (
    <View className={`flex-row items-center justify-between ${className}`}>
      <Text className="text-[15px] font-semibold">{title}</Text>
    </View>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}) {
  return (
    <View className="flex-1">
      <TouchableOpacity
        onPress={onPress}
        className="bg-white  h-20 items-center justify-center "
      >
        <View className="w-9 h-9 rounded-full items-center justify-center bg-[#EEF1FF] mb-1">
          {/* để icon mặc định màu theo theme */}
          {icon}
        </View>
        <Text className="text-[12px]">{label}</Text>
      </TouchableOpacity>
    </View>
  );
}

function ListItem({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between bg-white rounded-2xl px-4 py-3 my-2 border border-[#eee] shadow-sm"
    >
      <View className="flex-row items-center gap-3">
        <View className="w-7 h-7 rounded-full items-center justify-center bg-[#EEF1FF]">
          {icon}
        </View>
        <Text className="text-[14px]">{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} />
    </TouchableOpacity>
  );
}
