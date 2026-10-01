import { api } from "../../lib/api";
import type { Task } from "./types";

export const getTasks = async (projectId: string) => {
  const response = await api.get(`/projects/${projectId}/tasks`);
  return response.data;
};

export const createTask = async (
  projectId: string,
  taskData: Partial<Task>,
) => {
  const response = await api.post(`/projects/${projectId}/tasks`, taskData);
  return response.data;
};

export const updateTask = async (
  taskId: string,
  taskData: Partial<Task>,
) => {
  const response = await api.put(`/tasks/${taskId}`, taskData);
  return response.data;
};

export const deleteTask = async (taskId: string) => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};
