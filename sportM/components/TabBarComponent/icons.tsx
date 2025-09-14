import type React from 'react';
import { Feather } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
export type RouteNames =
  | 'home'
  | 'map'
  | 'addAccount'
  | 'notification'
  | 'settingsAccount';

interface IconProps {
  color: string;
  size?: number;
}

const icons: Record<RouteNames, (props: IconProps) => React.ReactElement> = {
  home: ({ color, size = 23 }) => (
    <Feather name="home" size={size} color={color} />
  ),
  addAccount: ({ color, size = 23 }) => (
    <Feather name="user-plus" size={size} color={color} />
  ),
  map: ({ color, size = 23 }) => (
    <Feather name="map-pin" size={size} color={color} />
  ),
  notification: ({ color, size = 23 }) => (
    <Ionicons name="notifications-outline" size={size} color={color} />
  ),
  settingsAccount: ({ color, size = 23 }) => (
    <Feather name="settings" size={size} color={color} />
  ),
};

export default icons;
