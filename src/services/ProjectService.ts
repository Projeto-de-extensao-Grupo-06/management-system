import type { ProjectDetails } from '../interfaces/types/ProjectDetails';
import api from './provider/api';
  
export default class ProjectService {
  async getProjectById(projectId: string): Promise<ProjectDetails | null> {
    const res = await api.get<ProjectDetails>(`/projects/${projectId}`);
    return res.data;
  }
};