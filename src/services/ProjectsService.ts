import type { Page } from '../interfaces/types/Page';
import type ProjectSummary from '../interfaces/types/ProjectSummary';
import api from './provider/api';

export default class ProjectsService {
 async getAllProjects(
  page: number = 0,
  size: number = 20,
  search: string = '',
  status: string[] = [],
  clientId?: number,
)
  : Promise<Page<ProjectSummary>> {

    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());

    if (search) params.append('search', search);
    if (clientId) params.append('clientId', clientId.toString());

    status.forEach(s => params.append('status', s));

    const response = await api.get<Page<ProjectSummary>>('/projects', {
      params,
    });

    return response.data;
  }

  async deleteProject(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
  }

  async getProjectById(id: number) {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  }
  
  createManualProject(data: {
    name: string;
    clientId: number;
    addressId: number | null;
    projectType: 'ON_GRID' | 'OFF_GRID';
  }) {
    return api.post('/projects/manual', data);
  }

}
