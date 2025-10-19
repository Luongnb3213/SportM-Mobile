import type React from 'react';
import { View, StyleSheet } from 'react-native';
import TabBarButton from './TabBarButton';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { RouteNames } from './icons';
import { useNotificationStatus } from '@/providers/NotificationContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FLOAT_GAP = 12;
const TabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const primaryColor = '#1F2257';
  const whiteColor = 'white';
  const { hasUnreadNotifications } = useNotificationStatus();
  const { bottom: insetBottom } = useSafeAreaInsets();
  return (
    <View style={[styles.tabbar, { bottom: insetBottom + FLOAT_GAP }, { paddingBottom: styles.tabbar.paddingVertical + (insetBottom > 0 ? 4 : 0) }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        if (['+not-found', 'index'].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name as RouteNames}
            color={isFocused ? primaryColor : whiteColor}
            hasUnreadNotifications={route.name === 'notification' ? hasUnreadNotifications : false}
            label={label as string}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F2257',
    marginHorizontal: 10,
    paddingVertical: 22,
    paddingHorizontal: 10,
    borderRadius: 50,
    borderCurve: 'continuous',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
  },
});

export default TabBar;
