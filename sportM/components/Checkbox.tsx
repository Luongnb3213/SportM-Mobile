import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { cn } from '../lib/utils';

// TODO: make controlled (optional)
interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof View> {
  label?: string;
  labelClasses?: string;
  checkboxClasses?: string;
  checked?: boolean;
}
function Checkbox({
  label,
  labelClasses,
  checkboxClasses,
  className,
  checked,
  ...props
}: CheckboxProps) {
  const [isChecked, setChecked] = useState(checked || false);

  const toggleCheckbox = () => {
    setChecked(prev => !prev);
  };

  return (
    <View
      className={cn('flex flex-row items-center gap-2', className)}
      {...props}
    >
      <TouchableOpacity onPress={toggleCheckbox}>
        <View
          className={cn(
            'w-4 h-4 border border-gray-700 rounded bg-background flex justify-center items-center',
            {
              'bg-foreground': isChecked,
            },
            checkboxClasses
          )}
        >
          {isChecked && <Text className="text-background text-xs">✓</Text>}
        </View>
      </TouchableOpacity>
      {label && (
        <Text className={cn('text-primary', labelClasses)}>{label}</Text>
      )}
    </View>
  );
}

export { Checkbox };
