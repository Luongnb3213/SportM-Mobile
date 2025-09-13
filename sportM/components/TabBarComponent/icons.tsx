import type React from "react"
import { Feather } from "@expo/vector-icons"

export type RouteNames = "home" | "search" | "map" | "account" | "settings"

interface IconProps {
  color: string
  size?: number
}

const icons: Record<RouteNames, (props: IconProps) => React.ReactElement> = {
  home: ({ color, size = 23 }) => <Feather name="home" size={size} color={color} />,
  search: ({ color, size = 23 }) => <Feather name="user-plus" size={size} color={color} />,
  map: ({ color, size = 23 }) => <Feather name="map-pin" size={size} color={color} />,
  account: ({ color, size = 23 }) => <Feather name="user" size={size} color={color} />,
  settings: ({ color, size = 23 }) => <Feather name="settings" size={size} color={color} />,

}

export default icons