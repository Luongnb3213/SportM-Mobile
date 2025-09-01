import { createContext, useContext, useState } from "react";
import { Text, TouchableOpacity, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { cn } from "@/lib/utils";
import { theme } from "@/styles/theme";

interface RadioGroupContextType {
  value: string;
  setValue: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextType | undefined>(
  undefined
);

interface RadioGroupProps {
  defaultValue: string;
  children: React.ReactNode;
}

function RadioGroup({ defaultValue, children }: RadioGroupProps) {
  const [value, setValue] = useState<string>(defaultValue);
  return (
    <RadioGroupContext.Provider value={{ value, setValue }}>
      {children}
    </RadioGroupContext.Provider>
  );
}

interface RadioGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof TouchableOpacity> {
  value: string;
  label?: string;
  labelClasses?: string;
}

function RadioGroupItem({
  value,
  className,
  label,
  labelClasses,
  ...props
}: RadioGroupItemProps) {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) throw new Error("RadioGroupItem must be used within a RadioGroup");

  const { value: selectedValue, setValue } = ctx;
  const colorScheme = useColorScheme();
  const currentTheme = colorScheme === "dark" ? theme.dark : theme.light;
  const checked = selectedValue === value;

  return (
    <TouchableOpacity
      onPress={() => setValue(value)}
      className={cn("flex flex-row items-center gap-2", className)}
      {...props}
    >
      {checked ? (
        <Ionicons
          name="radio-button-on"
          size={20}
          color={currentTheme.foreground}
        />
      ) : (
        <Ionicons
          name="radio-button-off"
          size={20}
          color={currentTheme.foreground}
        />
      )}

      {label ? (
        <Text className={cn("text-base text-black dark:text-white", labelClasses)}>
          {label}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

interface RadioGroupLabelProps
  extends React.ComponentPropsWithoutRef<typeof TouchableOpacity> {
  value: string;
}

function RadioGroupLabel({ value, className, ...props }: RadioGroupLabelProps) {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) throw new Error("RadioGroupLabel must be used within a RadioGroup");

  const { setValue } = ctx;
  return (
    <TouchableOpacity
      className={className}
      onPress={() => setValue(value)}
      {...props}
    />
  );
}

export { RadioGroup, RadioGroupItem, RadioGroupLabel };
