"use client"

import { Pressable, StyleSheet, type PressableProps } from "react-native"
import type React from "react"
import { useEffect } from "react"
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated"
import icons, { RouteNames } from "./icons"

interface TabBarButtonProps extends PressableProps {
  isFocused: boolean
  label: string | React.ReactNode
  routeName: RouteNames
  color: string
}

const TabBarButton: React.FC<TabBarButtonProps> = (props) => {
  const { isFocused, routeName, color } = props

  const backgroundScale = useSharedValue(0)

  useEffect(() => {
    backgroundScale.value = withSpring(isFocused ? 1 : 0, {
      duration: 300,
      dampingRatio: 0.8,
      stiffness: 100,
    })
  }, [backgroundScale, isFocused])

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: backgroundScale.value }],
      opacity: backgroundScale.value,
    }
  })

  return (
    <Pressable {...props} style={styles.container}>
      <Animated.View style={[styles.focusedContainer, animatedBackgroundStyle]} />
      {icons[routeName]({ color: isFocused ? "#1F2257" : color })}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  focusedContainer: {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: 25,
    padding: 23,
  },
})

export default TabBarButton
