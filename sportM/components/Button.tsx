"use client"

import React, { useState } from "react"
import { Pressable, Text, type TouchableOpacityProps, type StyleProp, type ViewStyle } from "react-native"
import { cn } from "@/lib/utils"
interface ButtonProps extends TouchableOpacityProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
  className?: string
  textClassName?: string
  style?: StyleProp<ViewStyle>
  mode?: "light" | "dark"
  children: React.ReactNode
  asChild?: boolean
}

// Type for icon elements
interface IconElement extends React.ReactElement {
  props: {
    svg?: boolean
    color?: string
    className?: string
    [key: string]: any
  }
  type: string | React.JSXElementConstructor<any>
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "default",
  disabled = false,
  className = "",
  textClassName = "",
  style,
  mode = "light",
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false)

  const containerClasses = cn(
    buttonClassNames.base,
    buttonClassNames[`size_${size}`],
    buttonClassNames[`${mode}_variant_${variant}`],
    isPressed && buttonClassNames.pressed[variant],
    disabled && buttonClassNames.disabled,
    className,
  )

  const textClasses = cn(
    textClassNames.base,
    textClassNames.size[size],
    textClassNames[mode][variant],
    // Override leading-none with leading-none only for single characters
    "leading-tight", // Better line height for text visibility
    textClassName,
  )

  const isIconButton = size === "icon"

  return (
    <Pressable
      {...props}
      disabled={disabled}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      android_ripple={variant !== "link" ? { color: "rgba(0, 0, 0, 0.1)" } : null}
      className={containerClasses}
      style={[style, isPressed && !buttonClassNames.pressed[variant] && { opacity: 0.95 }]}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const elementChild = child as IconElement

          if (elementChild.type === "svg" || elementChild.props.svg) {
            return React.cloneElement(elementChild, {
              ...elementChild.props,
              size: isIconButton ? 20 : 16,
              color: elementChild.props.color || iconColors[mode][variant],
              className: cn(isIconButton ? "w-5 h-5" : "w-4 h-4 shrink-0", elementChild.props.className),
            })
          }
        }

        if (typeof child === "string" || typeof child === "number") {
          return (
            <Text
              className={textClasses}
              style={{
                textAlign: "center",
                textAlignVertical: "center",
                includeFontPadding: false, // Remove extra padding on Android
              }}
            >
              {child}
            </Text>
          )
        }

        return child
      })}
    </Pressable>
  )
}

export default Button

export { Button }

// NativeWind classes
export const buttonClassNames = {
  base: "rounded-md items-center justify-center",

  // Size variants
  size_default: "h-10 px-4 py-2 flex-row gap-2",
  size_sm: "h-9 rounded-sm px-3 flex-row gap-2",
  size_lg: "h-11 rounded-lg px-8 flex-row gap-2",
  size_icon: "h-10 w-10 p-0",

  // Light mode variants
  light_variant_default: "bg-primary text-primary-foreground",
  light_variant_destructive: "bg-destructive text-destructive-foreground",
  light_variant_outline: "border border-dark-input text-foreground hover:bg-accent hover:text-accent-foreground",
  light_variant_secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  light_variant_ghost: "hover:bg-accent hover:text-accent-foreground",
  light_variant_link: "text-primary underline-offset-4 hover:underline",

  // Dark mode variants
  dark_variant_default: "bg-dark-primary text-dark-primary-foreground",
  dark_variant_destructive: "bg-dark-destructive text-dark-destructive-foreground",
  dark_variant_outline:
    "border border-input text-dark-foreground hover:bg-dark-accent hover:text-dark-accent-foreground",
  dark_variant_secondary: "bg-dark-secondary text-dark-secondary-foreground hover:bg-dark-secondary/80",
  dark_variant_ghost: "hover:bg-dark-accent hover:text-dark-accent-foreground",
  dark_variant_link: "text-dark-primary underline-offset-4 hover:underline",

  // States
  pressed: {
    default: "opacity-90",
    destructive: "opacity-90",
    outline: "bg-accent text-accent-foreground dark:bg-dark-accent dark:text-dark-accent-foreground",
    secondary: "opacity-80",
    ghost: "bg-accent text-accent-foreground dark:bg-dark-accent dark:text-dark-accent-foreground",
    link: "underline",
  },

  disabled: "opacity-50 pointer-events-none",
}

// Text classNames for different variants and modes
export const textClassNames = {
  base: "text-sm font-medium",
  size: {
    default: "text-sm",
    sm: "text-xs",
    lg: "text-sm",
    icon: "text-sm",
  },
  light: {
    default: "text-primary-foreground",
    destructive: "text-white",
    secondary: "text-secondary-foreground",
    outline: "text-accent-foreground",
    ghost: "text-accent-foreground",
    link: "text-dark-primary-foreground underline-offset-4 underline",
  },
  dark: {
    default: "text-dark-primary-foreground",
    destructive: "text-dark-destructive-foreground",
    secondary: "text-dark-secondary-foreground",
    outline: "text-dark-accent-foreground",
    ghost: "text-dark-accent-foreground",
    link: "text-primary-foreground underline-offset-4 underline",
  },
}

// Icon colors for different variants and modes
export const iconColors = {
  light: {
    default: "#FFFFFF",
    destructive: "#FFFFFF",
    secondary: "#000000",
    outline: "#000000",
    ghost: "#000000",
    link: "#2563EB",
  },
  dark: {
    default: "#FFFFFF",
    destructive: "#FFFFFF",
    secondary: "#FFFFFF",
    outline: "#FFFFFF",
    ghost: "#FFFFFF",
    link: "#2563EB",
  },
}
