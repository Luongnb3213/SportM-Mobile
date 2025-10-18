import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Keyboard,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardProvider,
} from 'react-native-keyboard-controller';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Carousel from 'react-native-reanimated-carousel';
import MapboxGL from '@rnmapbox/maps';

import HeaderUser from '@/components/ui/HeaderUser';
import Button from '@/components/Button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/Card';
import { uploadToCloudinary } from '@/lib/uploadToCloudinary';
import { useAxios } from '@/lib/api';
import Toast from 'react-native-toast-message';
import { Skeleton } from '@/components/Skeleton';
import { formatPriceVND } from '@/lib/utils';
import { useDebounce } from '@/hooks/useDebounce';
import UpdateCourtSkeleton from '@/components/Skeleton/UpdateCourtSkeleton';
import PillIcon from '@/components/PillIcon';

// ===== small input with icon =====
const PillInput = ({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  onPressIn,
  editable = true,
}: {
  icon: React.ReactNode;
  placeholder: string;
  value?: string;
  onChangeText?: (t: string) => void;
  keyboardType?: 'default' | 'numeric' | 'number-pad' | 'decimal-pad' | 'phone-pad' | 'email-address' | 'url';
  onPressIn?: () => void;
  editable?: boolean;
}) => (
  <View className="w-full">
    <View
      onTouchEnd={onPressIn}
      className="flex-row items-center px-4 h-12 rounded-2xl border border-[#DADADA] bg-white"
      style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6 }}
    >
      <View className="mr-3">{icon}</View>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#C9C9C9"
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        keyboardType={keyboardType}
        className="flex-1 text-base"
      />
    </View>
  </View>
);

type Pill = { sportTypeId: string | null; typeName: string; status: boolean };
type MapboxFeature = { id: string; place_name: string; text: string; center: [number, number] };

const DEFAULT_HERO =
  'https://images.unsplash.com/photo-1506744038136-4627383b3fb?auto=format&fit=crop&w=1470&q=80';
const MAX_IMAGES = 4;

const UpdateCourt = () => {
  const insets = useSafeAreaInsets();
  const { width } = Dimensions.get('window');
  const { courtID } = useLocalSearchParams<{ courtID: string }>();

  // form states
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  // lat/lng không gửi khi PATCH theo spec của bạn, nhưng vẫn dùng để pick & reverse
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [pricePerHour, setPricePerHour] = useState('');
  const [subService, setSubService] = useState('');
  const [sportTypeList, setSportTypeList] = useState<Pill[] | null>(null);
  const [sportTypeSelected, setSportTypeSelected] = useState<string | null>(null);

  // images
  const [images, setImages] = useState<string[]>([]);
  const heroUri = useMemo(() => images[0] ?? DEFAULT_HERO, [images]);

  // ui
  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);

  // errors
  const [errors, setErrors] = useState<{
    name?: string;
    address?: string;
    description?: string;
    pricePerHour?: string;
    subService?: string;
    images?: string;
    general?: string;
  }>({});

  // ===== sport types (để user chọn lại). Nếu detail không trả id, sẽ map theo typeName =====
  useEffect(() => {
    (async () => {
      try {
        const { data } = await useAxios.get('/sport-type?page=1&limit=100');
        setSportTypeList(data.data.items);
      } catch (e) {
        console.log('Error fetching sport types:', e);
      }
    })();
  }, []);

  // ===== Prefill từ detail court =====
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setInitialLoading(true);
        const { data } = await useAxios.get(`/courts/${courtID}`);
        const c = data.data as {
          courtName: string;
          address: string;
          courtImages: string[];
          description: string;
          subService: string;
          pricePerHour: number;
          sportType?: { typeName?: string };
        };

        if (!mounted) return;

        setName(c.courtName ?? '');
        setAddress(c.address ?? '');
        setImages(Array.isArray(c.courtImages) ? c.courtImages.slice(0, MAX_IMAGES) : []);
        setDescription(c.description ?? '');
        setSubService(c.subService ?? '');
        setPricePerHour(
          typeof c.pricePerHour === 'number' ? String(c.pricePerHour) : (c.pricePerHour as any) ?? ''
        );

        // map sportType theo typeName nếu API không trả id
        if (c.sportType?.typeName && Array.isArray(sportTypeList)) {
          const found = sportTypeList.find((p) => p.typeName?.toLowerCase() === c.sportType!.typeName!.toLowerCase());
          setSportTypeSelected(found?.sportTypeId ?? sportTypeList?.[0]?.sportTypeId ?? null);
        } else {
          // nếu chưa có list thì khi list có sẽ map sau
          setSportTypeSelected((prev) => prev ?? null);
        }
      } catch (e) {
        console.log('Load court detail error:', e);
        setErrors((er) => ({ ...er, general: 'Không tải được dữ liệu sân.' }));
      } finally {
        mounted && setInitialLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courtID, sportTypeList?.length]);

  // ===== Images =====
  const pickImage = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (perm.status !== 'granted') {
        Toast.show({ type: 'error', text1: 'Quyền truy cập', text2: 'Cần quyền thư viện ảnh.' });
        return;
      }
      if (images.length >= MAX_IMAGES) {
        Toast.show({ type: 'error', text1: 'Giới hạn ảnh', text2: `Tối đa ${MAX_IMAGES} ảnh.` });
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.85,
      });
      if (!result.canceled) {
        const next = [...images, result.assets[0].uri].slice(0, MAX_IMAGES);
        setImages(next);
        if (errors.images) setErrors((e) => ({ ...e, images: undefined }));
      }
    } catch (e: any) {
      console.log('pickImage error:', e?.message || e);
    }
  };
  const removeImageAt = (idx: number) => setImages((prev) => prev.filter((_, i) => i !== idx));

  // ===== Validate =====
  const validate = () => {
    const next: typeof errors = {};
    if (!name.trim()) next.name = 'Vui lòng nhập tên sân';
    if (!address.trim()) next.address = 'Vui lòng chọn địa điểm';
    if (!description.trim()) next.description = 'Vui lòng nhập mô tả';
    if (!pricePerHour.trim()) next.pricePerHour = 'Vui lòng nhập giá/giờ';
    if (!subService.trim()) next.subService = 'Vui lòng nhập dịch vụ phụ';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ===== Submit (PATCH) =====
  const axios = useAxios;
  const onSubmit = async () => {
    if (!validate()) return;

    try {
      setSubmitting(true);
      setErrors((e) => ({ ...e, general: undefined }));

      // upload ảnh local → url
      const imgUrls: string[] = [];
      for (const uri of images) {
        const isLocal = uri.startsWith('file://') || uri.startsWith('content://');
        if (isLocal) {
          const up = await uploadToCloudinary(uri, {
            folder: 'courts',
            tags: ['court', 'gallery'],
            context: { screen: 'UpdateCourt' },
          });
          imgUrls.push(up.secure_url || up.url);
        } else {
          imgUrls.push(uri);
        }
      }

      const body = {
        name: name.trim(),
        address: address.trim(),
        imgUrls,
        sportType: sportTypeSelected, // id
        description: description.trim(),
        pricePerHour: Number(String(pricePerHour).replaceAll(',', '')),
        subService: subService.trim(),
      };

      await axios.patch(`/owner/courts/${courtID}`, body);

      console.log('Update court body:', body);
      Toast.show({ type: 'success', text1: 'Thành công', text2: 'Cập nhật sân thành công!' });
      router.push('/owner');
    } catch (err: any) {
      console.log('Update court error:', err?.response?.data || err?.message || err);
      Toast.show({ type: 'error', text1: 'Lỗi', text2: 'Đã có lỗi khi cập nhật sân' });
    } finally {
      setSubmitting(false);
    }
  };

  // ===== Mapbox: search + reverse geocode để set address =====
  const [mapQuery, setMapQuery] = useState('');
  const debouncedQuery = useDebounce(mapQuery, 500);
  const [suggestions, setSuggestions] = useState<MapboxFeature[]>([]);
  const [pickingCenter, setPickingCenter] = useState<[number, number] | null>(null);
  const [pickedCoord, setPickedCoord] = useState<[number, number] | null>(null);
  const DEFAULT_CENTER: [number, number] = [106.660172, 10.762622];
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!debouncedQuery) {
        if (alive) setSuggestions([]);
        return;
      }
      try {
        const prox = pickedCoord ?? pickingCenter ?? DEFAULT_CENTER;
        const feats = await forwardGeocode(debouncedQuery, prox);
        if (alive) setSuggestions(feats);
      } catch { }
    })();
    return () => {
      alive = false;
    };
  }, [debouncedQuery]);

  const handleMapPress = (e: any) => {
    if ('coordinates' in e.geometry && Array.isArray(e.geometry.coordinates)) {
      if (e.geometry.type === 'Point' && 'coordinates' in e.geometry) {
        const [lngTap, latTap] = e.geometry.coordinates as [number, number];
        setPickedCoord([lngTap, latTap]);
      }
    }
  };

  const chooseSuggestion = (f: MapboxFeature) => {
    setPickingCenter(f.center);
    setPickedCoord(f.center);
    setMapQuery(f.place_name);
    setSuggestions([]);
    setSuggestionsOpen(false);
    Keyboard.dismiss();
  };
  const confirmPick = async () => {
    if (!pickedCoord) return;
    setSuggestions([]);
    setSuggestionsOpen(false);
    const [lngPicked, latPicked] = pickedCoord;
    try {
      const pretty = await reverseGeocode(lngPicked, latPicked);
      setLat(latPicked);
      setLng(lngPicked);
      setAddress(pretty);
      setErrors((e) => ({ ...e, address: undefined }));
      setMapVisible(false);
    } catch {
      setLat(latPicked);
      setLng(lngPicked);
      setAddress(`(${latPicked.toFixed(6)}, ${lngPicked.toFixed(6)})`);
      setMapVisible(false);
    }
  };

  async function forwardGeocode(query: string, proximity?: [number, number]) {
    if (!query.trim()) return [] as MapboxFeature[];
    const url = new URL(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`
    );
    url.searchParams.set(
      'access_token',
      'pk.eyJ1IjoibHVvbmdjaGFvaSIsImEiOiJjbWZndzlwNHcwNW52MnJwdDJlaGViMDUxIn0.8D0hYvlEZdwx3GzONsOHpg'
    );
    url.searchParams.set('autocomplete', 'true');
    url.searchParams.set('limit', '6');
    url.searchParams.set('language', 'vi');
    if (proximity) url.searchParams.set('proximity', `${proximity[0]},${proximity[1]}`);
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Geocoding failed');
    const json = await res.json();
    return (json.features || []) as MapboxFeature[];
  }
  async function reverseGeocode(lng: number, lat: number) {
    const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`);
    url.searchParams.set(
      'access_token',
      'pk.eyJ1IjoibHVvbmdjaGFvaSIsImEiOiJjbWZndzlwNHcwNW52MnJwdDJlaGViMDUxIn0.8D0hYvlEZdwx3GzONsOHpg'
    );
    url.searchParams.set('limit', '1');
    url.searchParams.set('language', 'vi');
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Reverse geocoding failed');
    const json = await res.json();
    const f = (json.features || [])[0];
    return (f?.place_name as string) || `(${lat.toFixed(6)}, ${lng.toFixed(6)})`;
  }

  // ===== UI =====
  if (initialLoading) return <UpdateCourtSkeleton />;

  return (
    <KeyboardProvider>
      <SafeAreaView className="flex-1">
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps="handled"
          extraKeyboardSpace={0}
          contentContainerStyle={{ paddingBottom: insets.bottom + 50, flexGrow: 1 }}
        >
          <View className="px-4">
            <HeaderUser />
          </View>

          {/* back */}
          <View className="px-4">
            <TouchableOpacity
              className="flex-row items-center gap-2 py-2"
              onPress={() => router.back()}
              disabled={submitting}
            >
              <Ionicons name="chevron-back" size={20} />
              <Text className="text-base text-primary font-medium">Trở về trang trước</Text>
            </TouchableOpacity>
          </View>

          {/* HERO with Carousel */}
          <View>
            {images.length > 0 ? (
              <View className="w-full" style={{ aspectRatio: 16 / 12 }}>
                <Carousel
                  loop={false}
                  width={width}
                  height={(width * 12) / 16}
                  data={images}
                  scrollAnimationDuration={600}
                  renderItem={({ item, index }) => (
                    <View className="w-full h-full">
                      <ImageBackground source={{ uri: item }} resizeMode="cover" className="w-full h-full">
                        <View className="absolute inset-0 bg-black/20" />
                        <TouchableOpacity
                          onPress={() => removeImageAt(index)}
                          className="absolute top-3 right-3 bg-black/50 rounded-full p-2"
                        >
                          <Ionicons name="trash" size={18} color="white" />
                        </TouchableOpacity>
                      </ImageBackground>
                    </View>
                  )}
                />
              </View>
            ) : (
              <ImageBackground
                source={{ uri: heroUri }}
                resizeMode="cover"
                className="w-full"
                style={{ aspectRatio: 16 / 12 }}
              >
                <View className="absolute inset-0 bg-black/25" />
              </ImageBackground>
            )}

            {/* overlay inputs on hero */}
            <View className="px-5 -mt-9">
              <View className="gap-3">
                <PillInput
                  icon={<Ionicons name="location" size={22} color="#1F2756" />}
                  placeholder="Nhập địa điểm"
                  value={address}
                  onPressIn={() => setMapVisible(true)}
                  editable={false}
                />
                {errors.address ? <Text className="text-red-500 text-sm">{errors.address}</Text> : null}

                <PillInput
                  icon={<Ionicons name="pricetag" size={22} color="#1F2756" />}
                  placeholder="Nhập tên sân"
                  value={name}
                  onChangeText={(t) => {
                    setName(t);
                    if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
                  }}
                />
                {errors.name ? <Text className="text-red-500 text-sm">{errors.name}</Text> : null}

                <Button className="h-12 w-72 mx-auto rounded-xl" onPress={pickImage} disabled={submitting}>
                  <Text className="text-base text-white font-semibold">
                    {images.length > 0 ? `Thêm ảnh (${images.length}/${MAX_IMAGES})` : 'Thêm ảnh'}
                  </Text>
                </Button>
              </View>
            </View>
          </View>

          {/* FORM card */}
          <View className="shadow-2xl">
            <Card className="mx-3 my-3 overflow-hidden rounded-2xl">
              <CardHeader className="p-0">
                <View className="bg-yellow-300 py-3 flex-row px-3 justify-center gap-8">
                  <View className="rounded-full">
                    <Text className="text-lg font-semibold text-primary">Chỉnh sửa thông tin</Text>
                  </View>
                </View>
              </CardHeader>

              <CardContent className="px-3 py-4 bg-white">
                <View className="gap-3">
                  {/* description */}
                  <PillInput
                    icon={<MaterialIcons name="description" size={24} color="black" />}
                    placeholder="Mô tả sân"
                    value={description}
                    onChangeText={(t) => {
                      setDescription(t);
                      if (errors.description) setErrors((e) => ({ ...e, description: undefined }));
                    }}
                  />
                  {errors.description ? <Text className="text-red-500 text-sm">{errors.description}</Text> : null}

                  {/* pricePerHour */}
                  <PillInput
                    icon={<FontAwesome name="hourglass-2" size={24} color="black" />}
                    placeholder="Giá/giờ (VND)"
                    value={formatPriceVND(pricePerHour)}
                    keyboardType="numeric"
                    onChangeText={(t) => {
                      setPricePerHour(t.replace(/[^\d]/g, ''));
                      if (errors.pricePerHour) setErrors((e) => ({ ...e, pricePerHour: undefined }));
                    }}
                  />
                  {errors.pricePerHour ? <Text className="text-red-500 text-sm">{errors.pricePerHour}</Text> : null}

                  {/* subService */}
                  <PillInput
                    icon={<MaterialIcons name="miscellaneous-services" size={24} color="black" />}
                    placeholder="Dịch vụ phụ (VD: Thuê vợt)"
                    value={subService}
                    onChangeText={(t) => {
                      setSubService(t);
                      if (errors.subService) setErrors((e) => ({ ...e, subService: undefined }));
                    }}
                  />
                  {errors.subService ? <Text className="text-red-500 text-sm">{errors.subService}</Text> : null}

                  {/* sport type pills */}
                  <View className="pt-1">
                    <View className="flex-row flex-wrap gap-1">
                      {sportTypeList ? (
                        sportTypeList.map((p) => (
                          <TouchableOpacity
                            onPress={() => setSportTypeSelected(p.sportTypeId)}
                            key={p.sportTypeId || p.typeName}
                            className={`rounded-lg px-3 flex items-center flex-col shadow-xl py-3 ${sportTypeSelected === p.sportTypeId ? 'bg-slate-200' : 'bg-white'
                              }`}
                          >
                            <PillIcon typeName={p.typeName} />
                            <Text className="text-xs"> {p.typeName}</Text>
                          </TouchableOpacity>
                        ))
                      ) : (
                        Array.from({ length: 5 }).map((_, idx) => (
                          <View key={idx} className="rounded-lg px-3 flex items-center flex-col shadow-xl py-3 mr-2 bg-white">
                            <Skeleton className="w-4 h-4 rounded-full" />
                            <Skeleton className="w-10 h-3 rounded-md mt-2" />
                          </View>
                        ))
                      )}
                    </View>
                  </View>
                </View>
              </CardContent>

              <CardFooter className="px-3 pb-4 bg-white">
                {errors.general ? <Text className="text-red-500 text-sm mb-2">{errors.general}</Text> : null}
                <View className="flex-row items-center gap-1 w-full">
                  <Button
                    onPress={() => router.back()}
                    className="h-12 flex-1 bg-white border border-primary w-full rounded-xl"
                    disabled={submitting}
                  >
                    <Text className="text-base text-primary font-semibold">Huỷ</Text>
                  </Button>
                  <Button onPress={onSubmit} className="h-12 flex-1 w-full rounded-xl" disabled={submitting}>
                    {submitting ? (
                      <View className="flex-row items-center justify-center gap-2">
                        <ActivityIndicator size="small" />
                        <Text className="text-base text-white font-semibold">Đang cập nhật...</Text>
                      </View>
                    ) : (
                      <Text className="text-base text-white font-semibold">Xác nhận</Text>
                    )}
                  </Button>
                </View>
              </CardFooter>
            </Card>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>

      {/* Map Modal */}
      <Modal visible={mapVisible} animationType="slide" onRequestClose={() => setMapVisible(false)}>
        <SafeAreaView className="flex-1 bg-white">
          {/* header */}
          <View className="flex-row items-center justify-between px-4 py-2 border-b border-[#eee]">
            <Text className="text-lg font-semibold">Chọn vị trí</Text>
            <TouchableOpacity onPress={() => setMapVisible(false)}>
              <Ionicons name="close" size={22} />
            </TouchableOpacity>
          </View>

          {/* search */}
          <View className="px-4 pt-3 pb-2">
            <View
              className="flex-row items-center px-4 h-12 rounded-2xl border border-[#DADADA] bg-white"
              style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6 }}
            >
              <Ionicons name="search" size={20} color="#1F2756" />
              <TextInput
                placeholder="Tìm kiếm địa điểm"
                placeholderTextColor="#9AA0A6"
                value={mapQuery}
                onChangeText={(t) => {
                  setMapQuery(t);
                  setSuggestionsOpen(!!t.trim());
                }}
                className="flex-1 text-base ml-3"
                onFocus={() => setSuggestionsOpen(!!mapQuery.trim())}
              />
            </View>

            {suggestions.length > 0 && suggestionsOpen && (
              <View className="mt-2 rounded-xl border border-[#eee] bg-white">
                {suggestions.map((s) => (
                  <TouchableOpacity
                    key={s.id}
                    className="px-3 py-2 border-b border-[#f3f3f3]"
                    onPress={() => chooseSuggestion(s)}
                  >
                    <Text className="text-[15px] font-medium">{s.text}</Text>
                    <Text className="text-[13px] text-[#666]">{s.place_name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* map */}
          <View className="flex-1">
            <MapboxGL.MapView
              styleURL="mapbox://styles/mapbox/streets-v9"
              zoomEnabled
              scrollEnabled
              pitchEnabled
              rotateEnabled
              scaleBarEnabled={false}
              style={{ flex: 1 }}
              onPress={handleMapPress}
            >
              <MapboxGL.Camera
                zoomLevel={12}
                centerCoordinate={pickedCoord ?? [lng ?? DEFAULT_CENTER[0], lat ?? DEFAULT_CENTER[1]]}
                animationMode="flyTo"
                animationDuration={900}
              />
              {pickedCoord ? (
                <MapboxGL.PointAnnotation id="picked" coordinate={pickedCoord}>
                  <View style={{ width: 20, height: 20, backgroundColor: 'red', borderRadius: 10 }} />
                </MapboxGL.PointAnnotation>
              ) : null}
            </MapboxGL.MapView>
          </View>

          {/* footer */}
          <View className="px-4 py-3 border-t border-[#eee]">
            <Button onPress={confirmPick} className="h-12 rounded-xl" disabled={!pickedCoord}>
              <Text className="text-base text-white font-semibold">
                {pickedCoord ? `Chọn (${pickedCoord[1].toFixed(5)}, ${pickedCoord[0].toFixed(5)})` : 'Chọn vị trí'}
              </Text>
            </Button>
          </View>
        </SafeAreaView>
      </Modal>
    </KeyboardProvider>
  );
};

export default UpdateCourt;
