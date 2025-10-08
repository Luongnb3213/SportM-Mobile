// BottomSheet.tsx (sửa)
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  TouchableOpacity,
  View,
} from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  height?: number;
  children: React.ReactNode;
  backdropOpacity?: number;
  // tuỳ chọn: có cho kéo từ nội dung không (mặc định false)
  dragOnContent?: boolean;
};

export default function BottomSheet({
  open,
  onClose,
  height = Math.round(SCREEN_HEIGHT * 0.7),
  children,
  backdropOpacity = 0.45,
  dragOnContent = false,
}: BottomSheetProps) {
  const translateY = useRef(new Animated.Value(height)).current;

  const close = () =>
    Animated.timing(translateY, {
      toValue: height,
      duration: 220,
      useNativeDriver: true,
    }).start(onClose);

  const snapOpen = () =>
    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start();

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => {
        return Math.abs(g.dy) > 6;
      },
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(Math.min(g.dy, height));
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > height * 0.25 || g.vy > 1.2) {
          close();
        } else {
          snapOpen();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (open) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }).start();
    } else {
      translateY.setValue(height);
    }
  }, [open, height, translateY]);

  return (
    <Modal transparent visible={open} animationType="none" onRequestClose={onClose}>
      <View style={{ flex: 1 }}>
        {/* Backdrop */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          style={{
            position: 'absolute',
            left: 0, right: 0, top: 0, bottom: 0,
            backgroundColor: `rgba(0,0,0,${backdropOpacity})`,
          }}
        />

        {/* Sheet */}
        <Animated.View
          className="absolute left-0 right-0 rounded-t-3xl bg-white dark:bg-card"
          style={{
            height,
            bottom: 0,
            transform: [{ translateY }],
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 10,
            overflow: 'hidden', // tránh nội dung tràn
          }}
        >
          <View
            {...panResponder.panHandlers}
            className="items-center py-2"
            onStartShouldSetResponder={() => true}
          >
            <View className="w-12 h-1.5 rounded-full bg-black/15 dark:bg-white/20" />
          </View>
          <View
            {...(dragOnContent ? panResponder.panHandlers : {})}
            style={{ flex: 1 }}
          >
            {children}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
