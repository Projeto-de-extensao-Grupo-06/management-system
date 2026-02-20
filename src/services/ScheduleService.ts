import type { Schedule } from '../interfaces/types/Schedule';
import api from './provider/api';
import axios from 'axios';
import type CalendarEvent from '../interfaces/types/CalendarEvent';

const JSON_SERVER_URL = 'http://localhost:3000/schedule';

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
      const response = await axios.get<CalendarEvent[]>(JSON_SERVER_URL);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar eventos do agendamento:', error);
      return [];
    }
  }

  async createEvent(data: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent> {
    const response = await axios.post<CalendarEvent>(JSON_SERVER_URL, data);
    return response.data;
  }

  async updateEvent(id: string, data: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const response = await axios.patch<CalendarEvent>(`${JSON_SERVER_URL}/${id}`, data);
    return response.data;
  }

  async deleteEvent(id: string): Promise<void> {
    await axios.delete(`${JSON_SERVER_URL}/${id}`);
  }
}

