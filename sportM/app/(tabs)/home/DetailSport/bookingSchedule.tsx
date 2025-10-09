// bookingSchedule.tsx
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { KeyboardAwareScrollView, KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import BookingScheduleScreen from '@/components/HomeComponent/DetailSportComponent/BookingScheduleScreen';
import BookingSummary from '@/components/HomeComponent/DetailSportComponent/BookingSummary';
import { Card, CardContent } from '@/components/Card';
import Toast from 'react-native-toast-message';
import { useAxios } from '@/lib/api';
import BookingScheduleSkeleton from '@/components/Skeleton/BookingScheduleSkeleton';
import HeaderUser from '@/components/ui/HeaderUser';
import { Ionicons } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';


type CourtDetail = {
  courtId: string;
  courtName: string;
  courtImages: string[];
  address: string;
  description: string;
  subService: string;
  isActive: boolean;
  pricePerHour: number;
  sportType?: { typeName?: string };
  avgRating: number;
  lat?: number;
  lng?: number;
  owner?: {
    fullName?: string;
    phoneNumber?: string;
    avatarUrl?: string;
  };
};

type Slot = { id: string; label: string, locked: boolean };

const fmtDateISO = (d: Date) => d.toISOString().slice(0, 10);

const genDaysNext30 = () => {
  const today = new Date();
  const weekdayVN = (dow: number) => (dow === 0 ? 'CN' : `T${dow + 1}`); // 0=CN, 1..6->T2..T7
  return Array.from({ length: 31 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      id: fmtDateISO(d),
      date: d,
      day: String(d.getDate()).padStart(2, '0'),
      month: d.getMonth() + 1,
      weekdayShort: weekdayVN(d.getDay()),
      isActive: i === 0,
    };
  });
};

export default function bookingSchedule() {
  const insets = useSafeAreaInsets();
  const { courtID } = useLocalSearchParams<{ courtID: string }>();
  const { width } = Dimensions.get('window');


  // court detail
  const [court, setCourt] = useState<CourtDetail | null>(null);
  const [loadingCourt, setLoadingCourt] = useState(true);

  // days
  const [days] = useState(() => genDaysNext30());
  const [activeDayId, setActiveDayId] = useState(days[0].id);

  // slots & selections per-day
  const [slotsByDay, setSlotsByDay] = useState<Record<string, Slot[]>>({});
  // selected key: 'am_t0','pm_t3',...
  const [selectedByDay, setSelectedByDay] = useState<Record<string, Set<string>>>({});

  // invited
  type Friend = { userId: string; fullName: string; avatarUrl?: string };
  const [invited, setInvited] = useState<Friend[]>([]);
  const invitedIds = useMemo(() => invited.map(f => f.userId), [invited]);

  // note
  const [note, setNote] = useState('');

  // fetch court
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingCourt(true);
      try {
        const { data } = await useAxios.get(`/courts/${courtID}`);
        if (!mounted) return;
        const c: CourtDetail = {
          courtId: data?.data?.courtId,
          courtName: data?.data?.courtName,
          pricePerHour: data?.data?.pricePerHour ?? 0,
          courtImages: data?.data?.courtImages ?? [],
          address: data?.data?.address ?? '',
          description: data?.data?.description ?? '',
          subService: data?.data?.subService ?? '',
          isActive: data?.data?.isActive ?? false,
          sportType: data?.data?.sportType ?? { typeName: '' },
          avgRating: data?.data?.avgRating ?? 0,
          lat: data?.data?.lat ?? 0,
          lng: data?.data?.lng ?? 0,
          owner: data?.data?.owner ?? {
            fullName: '',
            phoneNumber: '',
            avatarUrl: '',
          },
        };
        setCourt(c);
      } catch (e) {
        setCourt(null);
        Toast.show({ type: 'error', text1: 'Không tải được thông tin sân' });
      } finally {
        setLoadingCourt(false);
      }
    })();
    return () => { mounted = false; };
  }, [courtID]);

  // fetch slots per day (mock or real)
  const fetchSlotsForDate = useCallback(async (date: string) => {
    const { data } = await useAxios.get(`/courts/${courtID}/slots`, { params: { date } });
    const slots: Slot[] = data.data.map((x: any) => ({ id: x.id, label: `${x.start} - ${x.end}`, locked: x.locked, }));
    setSlotsByDay(prev => ({ ...prev, [date]: slots }));
    setSelectedByDay(prev => prev[date] ? prev : ({ ...prev, [date]: new Set() }));
  }, [useAxios, courtID]);

  useEffect(() => {
    setSelectedByDay(prev => prev[activeDayId] ? prev : ({ ...prev, [activeDayId]: new Set() }));
  }, [activeDayId]);

  useEffect(() => {
    if (!slotsByDay[activeDayId]) {
      fetchSlotsForDate(activeDayId);
    }
  }, [activeDayId, slotsByDay, fetchSlotsForDate]);

  // toggle slot theo cột AM/PM
  const onToggleSlot = useCallback((courtId: 'am' | 'pm', slotId: string) => {
    setSelectedByDay(prev => {
      const next = { ...prev };
      const cur = new Set(next[activeDayId] ?? new Set());
      const key = `${courtId}_${slotId}`;
      cur.has(key) ? cur.delete(key) : cur.add(key);
      next[activeDayId] = cur;
      return next;
    });
  }, [activeDayId]);

  // totals
  const totalHours = useMemo(
    () => Object.values(selectedByDay).reduce((sum, set) => sum + (set?.size ?? 0), 0),
    [selectedByDay]
  );
  const totalPrice = useMemo(
    () => (court?.pricePerHour ?? 0) * totalHours,
    [court?.pricePerHour, totalHours]
  );

  // invite handlers
  const onPickFriend = (f: Friend) => setInvited(prev => prev.find(x => x.userId === f.userId) ? prev : [...prev, f]);
  const removeInvited = (id: string) => setInvited(prev => prev.filter(f => f.userId !== id));

  // submit
  const handleSubmit = async () => {
    if (!note.trim()) {
      Toast.show({ type: 'error', text1: 'Vui lòng nhập ghi chú' });
      return;
    }
    const anySelected = Object.values(selectedByDay).some(set => set && set.size > 0);
    if (!anySelected) {
      Toast.show({ type: 'error', text1: 'Bạn chưa chọn giờ nào' });
      return;
    }

    const selections = Object.entries(selectedByDay)
      .filter(([_, s]) => s && s.size > 0)
      .map(([date, s]) => {
        const keys = Array.from(s); // ['am_t0','pm_t3',...]
        const amIds = keys.filter(k => k.startsWith('am_')).map(k => k.split('_')[1]);
        const pmIds = keys.filter(k => k.startsWith('pm_')).map(k => k.split('_')[1]);

        const all = slotsByDay[date] || [];
        const toRanges = (ids: string[]) =>
          all
            .filter(sl => ids.includes(sl.id))
            .map(sl => {
              const [start, end] = sl.label.split(' - ').map(x => x.trim());
              return { start, end };
            });
        return {
          date,
          am: { slotIds: amIds },
          pm: { slotIds: pmIds },
        };
      });

    const body = {
      courtId: court?.courtId,
      selections,               // tách rõ AM/PM cho BE
      inviteeIds: invitedIds,
      notes: note.trim(),
    };

    console.log('submitting booking:', JSON.stringify(body));

    try {
     const {data } =  await useAxios.post('/bookings', body);
      router.push({
         pathname: '/(tabs)/home/DetailSport/BookingSuccessScreen',
         params: {
           orderId: data.data.orderId,
           createdAt: data.data.createdAt
         }
      })
      Toast.show({ type: 'success', text1: 'Đặt lịch thành công!' });
    } catch (e: any) {
      console.log('Booking error', JSON.stringify(e));
      if (e.status == 409) {
        Toast.show({ type: 'error', text1: 'Đặt lịch thất bại', text2: 'Một hoặc nhiều khung giờ bạn chọn đã được đặt.' });
      } else {
        Toast.show({ type: 'error', text1: 'Đặt lịch thất bại', text2: 'Vui lòng thử lại' });
      }
    }
  };

  const images = court?.courtImages?.length ? court.courtImages : [
    'https://images.unsplash.com/poto-1502877338535-766e1452684a?q=80&w=1600',
  ];

  if (loadingCourt) return <BookingScheduleSkeleton />;

  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          extraKeyboardSpace={0}
          contentContainerStyle={{ paddingBottom: insets.bottom + 150, flexGrow: 1 }}
        >

          <View className="px-4">
            <HeaderUser />
          </View>

          {/* header back */}
          <View className="px-4">
            <TouchableOpacity
              className="flex-row items-center gap-2 py-2"
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={20} />
              <Text className="text-base text-primary font-medium">Trở về trang trước</Text>
            </TouchableOpacity>
          </View>


          {/* HERO carousel */}
          <View>
            <View className="w-full" style={{ aspectRatio: 16 / 12 }}>
              <Carousel
                loop={false}
                width={width}
                height={(width * 12) / 16}
                data={images}
                scrollAnimationDuration={600}
                renderItem={({ item }) => (
                  <ImageBackground
                    source={{ uri: item }}
                    resizeMode="cover"
                    className="w-full h-full"
                  >
                    <View className="absolute inset-0 bg-black/25" />
                    {/* texts overlay — bind từ data */}
                    <View className="px-4 mt-2">
                      <Text className="text-lg text-gray-200">
                        {court?.address || '—'}
                      </Text>

                      <Text
                        style={{ color: '#FFF200' }}
                        className="mt-2 text-4xl font-medium leading-tight"
                        numberOfLines={2}
                      >
                        {court?.courtName?.toUpperCase?.() || '—'}
                      </Text>

                      <View className="mt-3 flex-row items-center">
                        <View className="flex-row items-center gap-1 rounded-full bg-black/60 px-3 py-1.5">
                          <Text className="text-white text-base font-semibold">
                            {typeof court?.avgRating === 'number'
                              ? court.avgRating.toFixed(1)
                              : '0.0'}
                          </Text>
                          <Ionicons name="star" size={14} color="#FFD54F" />
                        </View>
                      </View>
                    </View>
                  </ImageBackground>
                )}
              />
            </View>
          </View>

          {/* Lịch chọn giờ */}
          <BookingScheduleScreen
            key={`${activeDayId}-${(slotsByDay[activeDayId]?.length || 0)}`}
            days={days}
            activeDayId={activeDayId}
            setActiveDayId={(id) => {
              setActiveDayId(id);
              if (!selectedByDay[id]) {
                setSelectedByDay(prev => ({ ...prev, [id]: new Set() }));
              }
            }}
            slots={slotsByDay[activeDayId] || []}
            selected={selectedByDay[activeDayId] || new Set()}
            onToggle={onToggleSlot}
            pricePerHour={court?.pricePerHour ?? 0}
            sportType={court?.sportType}
            lockedSlot={new Set(
              (slotsByDay[activeDayId] || [])
                .filter(x => x.locked)
                .map(x => [`am_${x.id}`, `pm_${x.id}`])
                .flat()
            )}
          />

          {/* Chi tiết giờ đã chọn: nhóm AM/PM */}
          <View className="px-4">
            <Card className="rounded-2xl" style={{ borderWidth: 0 }}>
              <CardContent className="px-4 py-4">
                <Text className="text-[20px] font-medium text-[#292929] mb-2">
                  Chi tiết giờ đã chọn
                </Text>
                {Object.entries(selectedByDay).filter(([_, s]) => s && s.size > 0).length === 0 ? (
                  <Text className="text-gray-500">Chưa chọn khung giờ nào.</Text>
                ) : (
                  Object.entries(selectedByDay).map(([date, set]) => {
                    if (!set || set.size === 0) return null;
                    const keys = Array.from(set);
                    const amIds = keys.filter(k => k.startsWith('am_')).map(k => k.split('_')[1]);
                    const pmIds = keys.filter(k => k.startsWith('pm_')).map(k => k.split('_')[1]);

                    const allSlots = slotsByDay[date] || [];
                    const labels = (ids: string[]) => allSlots
                      .filter(sl => ids.includes(sl.id))
                      .map(sl => sl.label)
                      .join(', ');

                    const hours = set.size;
                    return (
                      <View key={date} className="mb-3">
                        <Text className="text-[15px] font-semibold">
                          {date} — {hours} giờ
                        </Text>
                        {amIds.length > 0 && (
                          <Text className="text-[14px] text-gray-700 mt-1">AM: {labels(amIds)}</Text>
                        )}
                        {pmIds.length > 0 && (
                          <Text className="text-[14px] text-gray-700 mt-1">PM: {labels(pmIds)}</Text>
                        )}
                      </View>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </View>

          {/* Summary + Invite + Submit */}
          <View className="px-4">
            <BookingSummary
              totalHours={totalHours}
              totalPrice={totalPrice}
              onCancel={() => { }}
              onSubmit={handleSubmit}
              note={note}
              onChangeNote={setNote}
              onPickFriend={onPickFriend}
              invited={invited}
              onRemoveInvited={removeInvited}
            />
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>

      {/* Toast container */}
      <Toast />
    </KeyboardProvider>
  );
}
