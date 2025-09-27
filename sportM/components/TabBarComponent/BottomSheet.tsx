// BottomSheet.tsx
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
  height?: number; // px, mặc định 70% màn
  children: React.ReactNode;
  backdropOpacity?: number;
};

export default function BottomSheet({
  open,
  onClose,
  height = Math.round(SCREEN_HEIGHT * 0.7),
  children,
  backdropOpacity = 0.45,
}: BottomSheetProps) {
  const translateY = useRef(new Animated.Value(height)).current;

  // Drag to close
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 6,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(Math.min(g.dy, height));
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > height * 0.25 || g.vy > 1.2) {
          // close
          Animated.timing(translateY, {
            toValue: height,
            duration: 220,
            useNativeDriver: true,
          }).start(onClose);
        } else {
          // snap back
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // open/close animation
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
    <Modal
      transparent
      visible={open}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1 }}>
        {/* Backdrop đứng sau, full màn, chỉ nhận press ngoài sheet */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: `rgba(0,0,0,${backdropOpacity})`,
          }}
        />

        {/* Sheet là SIBLING, không còn là con của backdrop */}
        <Animated.View
          {...panResponder.panHandlers}
          className="absolute left-0 right-0 rounded-t-3xl bg-white dark:bg-card"
          style={{
            height,
            bottom: 0,
            transform: [{ translateY }],
            shadowColor: '#000',
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 10,
          }}
          // chặn responder nổi lên backdrop khi bắt đầu chạm trong sheet
          onStartShouldSetResponder={() => true}
        >
          {/* Handle bar */}
          <View className="items-center py-2">
            <View className="w-12 h-1.5 rounded-full bg-black/15 dark:bg-white/20" />
          </View>

          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}
