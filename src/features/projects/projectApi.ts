import { api } from "../../lib/api";

export const getProjects = async (organizationId: string) => {
  const response = await api.get(`/organizations/${organizationId}/projects`);
  return response.data;
};

export const createProject = async (
  organizationId: string,
  projectData: { name: string; description?: string },
) => {
  const response = await api.post(
    `/organizations/${organizationId}/projects`,
    projectData,
  );
  return response.data;
};

export const updateProject = async (
  projectId: string,
  projectData: { name?: string; description?: string },
) => {
  const response = await api.put(`/projects/${projectId}`, projectData);
  return response.data;
};

export const deleteProject = async (projectId: string) => {
  const response = await api.delete(`/projects/${projectId}`);
  return response.data;
};
