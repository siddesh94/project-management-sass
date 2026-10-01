import { create } from "zustand";
import type { Task } from "../features/tasks/types";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../features/tasks/taskApi";

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;

  fetchTasks: (boardId: string) => Promise<void>;
  addTask: (boardId: string, data: Partial<Task>) => Promise<void>;
  addRealTimeTask: (task: Task) => void;
  updateTask: (taskId: string, data: Partial<Task>) => Promise<void>;
  updateRealTimeTask: (task: Task) => void;
  removeTask: (taskId: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async (boardId: string) => {
    try {
      set({ loading: true, error: null });
      const tasks = await getTasks(boardId);
      set({ tasks, loading: false });
    } catch (error: Error | string | unknown) {
      console.error("Error fetching tasks:", error);
      set({ error: "Failed to fetch tasks", loading: false });
    }
  },
  addTask: async (boardId: string, data: Partial<Task>) => {
    try {
      set({ loading: true, error: null });
      const newTask = await createTask(boardId, data);
      set((state) => ({ tasks: [...state.tasks, newTask], loading: false }));
    } catch (error: Error | string | unknown) {
      console.error("Error updating task:", error);
      set({ error: "Failed to add task", loading: false });
    }
  },
  addRealTimeTask: (task: Task) => {
    set((state) => ({ tasks: [...state.tasks, task] }));
  },
  updateTask: async (taskId: string, data: Partial<Task>) => {
    try {
      set({ loading: true, error: null });
      const updatedTask = await updateTask(taskId, data);
      set((state) => ({
        tasks: state.tasks.map((task) =>
          task.id === taskId ? updatedTask : task,
        ),
        loading: false,
      }));
    } catch (error: Error | string | unknown) {
      console.error("Error updating task:", error);
      set({ error: "Failed to update task", loading: false });
    }
  },
  updateRealTimeTask: (task: Task) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    }));
  },
  removeTask: async (taskId: string) => {
    try {
      set({ loading: true, error: null });
      await deleteTask(taskId);
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId),
        loading: false,
      }));
    } catch (error: Error | string | unknown) {
      console.error("Error deleting task:", error);
      set({ error: "Failed to delete task", loading: false });
    }
  },
}));
