import type { Schedule } from '../interfaces/types/Schedule';
import api from './provider/api';
  
export default class ScheduleService {

  async listProjectSchedules(projectId: number): Promise<Schedule[]> {
    const res = await api.get<Schedule[]>(
      `/projects/${projectId}/schedules`
    );

    if(!res.data) {
        return [];
    }

    return res.data;
  }
}
