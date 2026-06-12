import { Pressable, Text, View } from 'react-native';

interface ChipOption {
  value: string;
  label: string;
  color?: string;
}

interface ChipSelectorProps {
  options: ChipOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
}

export function ChipSelector({ options, value, onChange, multiple }: ChipSelectorProps) {
  const selectedValues = Array.isArray(value) ? value : [value];

  const handlePress = (optionValue: string) => {
    if (multiple) {
      const current = value as string[];
      if (current.includes(optionValue)) {
        onChange(current.filter((v) => v !== optionValue));
      } else {
        onChange([...current, optionValue]);
      }
    } else {
      onChange(optionValue);
    }
  };

  return (
    <View className="flex-row flex-wrap mb-4">
      {options.map((option) => {
        const selected = selectedValues.includes(option.value);
        const accentColor = option.color ?? '#00875F';

        return (
          <Pressable
            key={option.value}
            onPress={() => handlePress(option.value)}
            className="rounded-[6px] px-3 py-2 mr-2 mb-2 border"
            style={{
              backgroundColor: selected ? accentColor + '33' : '#121214',
              borderColor: selected ? accentColor : '#29292E',
            }}
          >
            <Text
              className="font-roboto text-sm font-normal"
              style={{ color: selected ? accentColor : '#E1E1E6' }}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
