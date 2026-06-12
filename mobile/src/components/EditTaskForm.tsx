import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, MutableRefObject } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, View } from 'react-native';
import { TaskFormData, taskFormSchema } from '../schemas/task';
import { Team, TaskStatus } from '../types';
import { STATUS_LABELS, STATUS_OPTIONS } from '../utils/status';
import { SelectField } from './ui/SelectField';
import { TextField } from './ui/TextField';

const EDIT_FIELD_TEXT = 'font-roboto-bold text-base text-[#FFFFFF] leading-4';

export interface TaskFormPlaceholders {
  title: string;
  description: string;
  team: string;
  status: string;
}

export const EDIT_TASK_PLACEHOLDERS: TaskFormPlaceholders = {
  title: 'Título da tarefa',
  description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
  team: 'Selecione um time',
  status: 'Selecione o status',
};

export const NEW_TASK_PLACEHOLDERS: TaskFormPlaceholders = {
  title: 'Título',
  description: 'Descrição',
  team: 'Selecione um time',
  status: 'Selecione um status',
};

interface EditTaskFormProps {
  teams: Team[];
  defaultValues?: Partial<TaskFormData>;
  onSubmit: (data: TaskFormData) => void;
  formRef?: MutableRefObject<(() => void) | null>;
  placeholders?: TaskFormPlaceholders;
}

export function EditTaskForm({
  teams,
  defaultValues,
  onSubmit,
  formRef,
  placeholders = EDIT_TASK_PLACEHOLDERS,
}: EditTaskFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'PENDING',
      teamIds: [],
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (formRef) {
      formRef.current = () => {
        handleSubmit(onSubmit)();
      };
    }
  }, [formRef, handleSubmit, onSubmit]);

  const statusOptions = STATUS_OPTIONS.map((status) => ({
    value: status,
    label: STATUS_LABELS[status],
  }));

  const teamOptions = teams.map((team) => ({
    value: team.id,
    label: team.name,
  }));

  return (
    <View className="flex-1">
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            placeholder={placeholders.title}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            className={`mb-3 bg-[#29292E] ${EDIT_FIELD_TEXT}`}
          />
        )}
      />
      {errors.title ? (
        <Text className="font-roboto text-sm text-[#F87171] mb-3">{errors.title.message}</Text>
      ) : null}

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextField
            placeholder={placeholders.description}
            value={value ?? ''}
            onChangeText={onChange}
            onBlur={onBlur}
            multiline
            numberOfLines={4}
            className={`mb-3 bg-[#29292E] min-h-[120px] ${EDIT_FIELD_TEXT}`}
          />
        )}
      />

      <Controller
        control={control}
        name="teamIds"
        render={({ field: { onChange, value } }) => (
          <SelectField
            value={value[0] ?? ''}
            options={teamOptions}
            placeholder={placeholders.team}
            onChange={(teamId) => onChange(teamId ? [teamId] : [])}
          />
        )}
      />

      <Controller
        control={control}
        name="status"
        render={({ field: { onChange, value } }) => (
          <SelectField
            value={value}
            options={statusOptions}
            placeholder={placeholders.status}
            onChange={(v) => onChange(v as TaskStatus)}
          />
        )}
      />
    </View>
  );
}
