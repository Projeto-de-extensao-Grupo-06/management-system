import type { Schedule } from '../interfaces/types/Schedule';
import api from './provider/api';
import axios from 'axios';
import type CalendarEvent from '../interfaces/types/CalendarEvent';

export default class ScheduleService {

  async listProjectSchedules(projectId: number): Promise<Schedule[]> {
    const res = await api.get<Schedule[]>(
      `/projects/${projectId}/schedules`
    );

    if (!res.data) {
      return [];
    }

    return res.data;
  }

  async getEvents(): Promise<CalendarEvent[]> {
    try {
      const response = await axios.get<CalendarEvent[]>("http://localhost:3000/schedule");
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar eventos do agendamento:", error);
      return [];
    }
  }
}
