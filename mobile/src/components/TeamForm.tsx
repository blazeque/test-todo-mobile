import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, MutableRefObject } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { DEFAULT_TEAM_COLOR, TEAM_COLOR_PRESETS, TeamFormData, teamFormSchema } from '../schemas/team';
import { ColorField } from './ui/ColorField';
import { TextField } from './ui/TextField';

const TEAM_FIELD_TEXT = 'font-roboto-bold text-base text-[#FFFFFF] leading-4';

export interface TeamFormPlaceholders {
  name: string;
  color: string;
}

export const NEW_TEAM_PLACEHOLDERS: TeamFormPlaceholders = {
  name: 'Nome do time',
  color: 'Cor do time',
};

interface TeamFormProps {
  defaultValues?: Partial<TeamFormData>;
  onSubmit: (data: TeamFormData) => void;
  formRef?: MutableRefObject<(() => void) | null>;
  placeholders?: TeamFormPlaceholders;
}

export function TeamForm({
  defaultValues,
  onSubmit,
  formRef,
  placeholders = NEW_TEAM_PLACEHOLDERS,
}: TeamFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      name: '',
      colorHex: DEFAULT_TEAM_COLOR,
      description: '',
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (formRef) {
      formRef.current = handleSubmit(onSubmit);
    }
  }, [formRef, handleSubmit, onSubmit]);

  return (
    <View>
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            placeholder={placeholders.name}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            className={`mb-3 bg-[#29292E] ${TEAM_FIELD_TEXT}`}
          />
        )}
      />
      {errors.name ? (
        <Text className="font-roboto text-sm text-[#F87171] mb-3">{errors.name.message}</Text>
      ) : null}

      <Controller
        control={control}
        name="colorHex"
        render={({ field: { onChange, value } }) => (
          <ColorField
            value={value}
            options={TEAM_COLOR_PRESETS}
            onChange={onChange}
            placeholder={placeholders.color}
          />
        )}
      />
      {errors.colorHex ? (
        <Text className="font-roboto text-sm text-[#F87171] mb-3">{errors.colorHex.message}</Text>
      ) : null}
    </View>
  );
}
