import GolfCourseCard from '@/components/HomeComponent/GolfCourseCard';
import PillIcon from '@/components/PillIcon';
import { Skeleton } from '@/components/Skeleton';
import { GolfCourseCardSkeleton } from '@/components/Skeleton/GolfCourseCardSkeleton';
import EmptyState from '@/components/ui/EmptyState';
import HeaderUser from '@/components/ui/HeaderUser';
import Pagination from '@/components/ui/Pagination';
import { useDebounce } from '@/hooks/useDebounce';
import { useAxios } from '@/lib/api';
import { formatPriceVND } from '@/lib/utils';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

type Pill = { sportTypeId: string | null; typeName: string; status: boolean };




const Search = () => {
  const insets = useSafeAreaInsets();
  const [sportTypeList, setSportTypeList] = React.useState<Pill[] | null>(null);
  const [sportTypeSelected, setSportTypeSelected] = React.useState<string | null>(null);
  const [searchText, setSearchText] = React.useState<string>('');
  const debouncedSearch = useDebounce(searchText, 500);
  const [listCourt, setListCourt] = React.useState<any[] | null>(null);
  const [page, setPage] = React.useState<number>(1);
  const [totalPage, setTotalPage] = React.useState<number>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const ctrlRef = useRef<AbortController | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await useAxios.get('/sport-type?page=1&limit=100');
        setSportTypeList(data.data.items);
      } catch (error) {
        console.log('Error fetching sport types:', error);
      }

    })();
  }, [])

  useEffect(() => {
    ctrlRef.current?.abort();
    const ctrl = new AbortController();
    ctrlRef.current = ctrl;
    (async () => {
      try {
        setLoading(true);
        const { data } = await useAxios.get(`/courts?page=${page}&limit=5${debouncedSearch ? `&search=${debouncedSearch}` : ''}${sportTypeSelected ? `&sportTypeId=${sportTypeSelected}` : ''}`, { signal: ctrl.signal });
        setListCourt(data.data.items);
        setTotalPage(data.data.meta.totalItems % 5 === 0 ? Math.floor(data.data.meta.totalItems / 5) : Math.floor(data.data.meta.totalItems / 5) + 1);
      } catch (error) {
        console.log('Error fetching courts:', error);
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();

  }, [sportTypeSelected, debouncedSearch, page]);

  const handleChoosePill = (pill: Pill) => {
    if (loading) return;
    if (sportTypeSelected === pill.sportTypeId) {
      setSportTypeSelected(null);
    } else {
      setSportTypeSelected(pill.sportTypeId);
    }
    setPage(1);
  };

  const handleTextChange = (text: string) => {
    setSearchText(text);
    setPage(1);
  }

  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: insets.bottom + 150,
            backgroundColor: 'white',
          }}
          extraKeyboardSpace={0}
        >
          <View>
            <View className="bg-background px-4">
              <HeaderUser />
            </View>

            <View className="flex-row px-14 items-center rounded-xl h-20 mb-1">
              <Feather name="search" size={25} color="#0a0a0a" />
              <TextInput
                value={searchText}
                onChangeText={handleTextChange}
                placeholder="Tìm kiếm"
                placeholderTextColor="#000000"
                className="flex-1 text-lg text-black px-2 "
              />
            </View>

            {/* Hàng pill */}
            <View className="pt-1 px-4">
              <View className="flex-row flex-wrap gap-1">
                {
                  sportTypeList ? (
                    sportTypeList?.map((p) => (
                      <TouchableOpacity
                        onPress={() => handleChoosePill(p)}
                        key={p.sportTypeId}
                        className={`rounded-lg px-3 flex items-center flex-col shadow-xl py-3 bg-white ${sportTypeSelected === p.sportTypeId ? 'bg-slate-200' : ''}`}
                      >
                        <PillIcon typeName={p.typeName} />
                        <Text className="text-xs"> {p.typeName}</Text>
                      </TouchableOpacity>
                    ))
                  ) : (
                    Array.from({ length: 5 }).map((_, idx) => (
                      <View
                        key={idx}
                        className="rounded-lg px-3 flex items-center flex-col shadow-xl py-3 mr-2 bg-white"
                      >
                        <Skeleton className="w-4 h-4 rounded-full" />
                        <Skeleton className="w-10 h-3 rounded-md mt-2" />
                      </View>
                    ))
                  )
                }
              </View>
            </View>

            <View className="gap-5 px-4 mt-4 flex-col">

              {
                listCourt && !loading ?
                  listCourt.length === 0 ? (
                    <EmptyState
                      icon="golf-outline"
                      title="Chưa có sân nào"
                      description="Hiện chưa có sân nào được đăng."
                    />
                  ) : (
                    listCourt.map((court, index) => {
                      return (
                        <GolfCourseCard
                          key={court?.courtId + index}
                          title={court?.courtName || ''}
                          pricePerHour={`${formatPriceVND(court?.pricePerHour)} đ/h`}
                          rating={court?.avgRating || "N/A"}
                          imageUri={court?.courtImages[0] || "https://images.unsplash.com/photo-150287733853-766e1452684a?q=80&w=1600"}
                          onPress={() => {
                            router.push({
                              pathname: '/(tabs)/home/DetailSport',
                              params: { courtID: court?.courtId },
                            });
                          }}
                        />
                      )
                    })
                  )
                  :
                  (
                    Array.from({ length: 3 }).map((_, idx) => (
                      <GolfCourseCardSkeleton key={idx} />
                    ))
                  )
              }

            </View>

            <View className='items-center mt-8 mb-4'>
              <Pagination
                page={page}
                count={totalPage || 1}
                onChange={setPage}
                boundaryCount={1}
                siblingCount={0}
                showPrevNext={false}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </KeyboardProvider>
  );
};

export default Search;
