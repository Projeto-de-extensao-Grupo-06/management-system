import type { ProjectStatusType } from '../interfaces/enum/ProjectStatus';
import type { ProjectDetails } from '../interfaces/types/ProjectDetails';
import api from './provider/api';
  
export default class ProjectService {
  async getProjectById(projectId: string): Promise<ProjectDetails | null> {
    const res = await api.get<ProjectDetails>(`/projects/${projectId}`);
    return res.data;
  }

    async updateProject(
    id: number,
    data: {
      name?: string;
      responsibleId?: number;
      projectType?: "ON_GRID" | "OFF_GRID";
      description?: string;
      status?: ProjectStatusType;
    }
  ): Promise<void> {
    await api.patch(`/projects/${id}`, data);
  }
};