import type { Page } from '../interfaces/types/Page';
import type { ProjectNotification } from '../interfaces/types/ProjectNotification';
import type ProjectSummary from '../interfaces/types/ProjectSummary';
import api from './provider/api';

export default class ProjectsService {
  async getProjectLeads(
    minDate?: string,
    maxDate?: string,
    status?: string,
    clientName?: string
  ): Promise<ProjectNotification[]> {
    const params = new URLSearchParams();
    if (minDate) params.append('minDate', minDate);
    if (maxDate) params.append('maxDate', maxDate);
    if (status && status !== 'Todos') params.append('status', status);
    if (clientName) params.append('clientName', clientName);

    const response = await api.get<ProjectNotification[]>('/projects/leads', { params });
    return response.data;
  }
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

  async getProjectById(id: number) {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  }

  async deleteProject(id: number): Promise<void> {
    await api.delete(`/projects/${id}`);
  }

  async createManualProject(data: {
    name: string;
    description: string;
    projectType: 'ON_GRID' | 'OFF_GRID';
    status: string;
    clientId: number;
    responsibleId?: number;
    addressId?: number;
  }) {
    return api.post('/projects/manual', data);
  }


  async getAllCoworkers(
    page: number = 0,
    size: number = 10,
    search: string = ''
  ) {
    const params = new URLSearchParams();

    params.append('page', page.toString());
    params.append('size', size.toString());

    if (search) {
      params.append('search', search);
    }

    const response = await api.get('/coworkers', {
      params,
    });

    return response.data;
  }


  async getProjectFiles(projectId: number) {
    const response = await api.get(`/projects/${projectId}/files`);
    return response.data;
  }
  async getProjectComments(projectId: number) {
    const response = await api.get(`/projects/${projectId}/comments`)
    return response.data.content
  }
}

