import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createTask,
  deleteTask,
  fetchTask,
  fetchTasks,
  ListTasksParams,
  TaskInput,
  updateTask,
} from '../api/tasks';
import { PaginatedResponse, Task, TaskStatus } from '../types';

export const TASKS_KEY = ['tasks'] as const;

export function useTasks(params?: ListTasksParams) {
  return useQuery({
    queryKey: [...TASKS_KEY, params],
    queryFn: () => fetchTasks(params),
  });
}

export function useTask(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['task', id],
    queryFn: () => fetchTask(id),
    enabled: options?.enabled ?? !!id,
  });
}

function removeTaskFromListCache(
  queryClient: ReturnType<typeof useQueryClient>,
  taskId: string,
) {
  queryClient.setQueriesData<PaginatedResponse<Task>>(
    { queryKey: TASKS_KEY },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        data: old.data.filter((task) => task.id !== taskId),
        meta: { ...old.meta, total: Math.max(0, old.meta.total - 1) },
      };
    },
  );
}

function updateTasksListCache(
  queryClient: ReturnType<typeof useQueryClient>,
  taskId: string,
  updater: (task: Task) => Task,
) {
  queryClient.setQueriesData<PaginatedResponse<Task>>(
    { queryKey: TASKS_KEY },
    (old) => {
      if (!old) return old;
      return {
        ...old,
        data: old.data.map((task) => (task.id === taskId ? updater(task) : task)),
      };
    },
  );
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_KEY }),
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TaskInput> }) =>
      updateTask(id, data),
    onSuccess: (response, { id }) => {
      const updatedTask = response.data;

      queryClient.setQueryData(['task', id], response);
      updateTasksListCache(queryClient, id, () => updatedTask);
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: TASKS_KEY });
      await queryClient.cancelQueries({ queryKey: ['task', id] });

      const previousTask = queryClient.getQueryData(['task', id]);
      const previousLists = queryClient.getQueriesData<PaginatedResponse<Task>>({
        queryKey: TASKS_KEY,
      });

      if (data.status || data.title || data.description) {
        updateTasksListCache(queryClient, id, (task) => ({
          ...task,
          ...data,
          status: (data.status ?? task.status) as TaskStatus,
        }));
      }

      return { previousTask, previousLists };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousTask) {
        queryClient.setQueryData(['task', id], context.previousTask);
      }
      context?.previousLists.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_response, taskId) => {
      queryClient.cancelQueries({ queryKey: ['task', taskId] });
      removeTaskFromListCache(queryClient, taskId);
      queryClient.invalidateQueries({ queryKey: TASKS_KEY });
    },
  });
}
