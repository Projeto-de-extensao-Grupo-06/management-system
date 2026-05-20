import type { AxiosResponse } from 'axios';
import type CalendarEvent from '../interfaces/types/CalendarEvent';
import type { Schedule } from '../interfaces/types/Schedule';
import type { ScheduleSchemaType } from '../schemas/scheduleSchema';
import api from './provider/api';

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  TECHNICAL_VISIT: { bg: '#DDF3FF', text: '#555' },
  INSTALL_VISIT: { bg: '#FFEADD', text: '#555' },
  NOTE: { bg: '#FFF9C4', text: '#555' },
};

function toCalendarEvent(s: Schedule): CalendarEvent {
  const colors = TYPE_COLORS[s.type] ?? { bg: '#E5E7EB', text: '#555' };
  const dateOnly = s.startDate ? s.startDate.substring(0, 10) : '';
  const timeOnly = s.startDate ? s.startDate.substring(11, 16) : '';
  const endDateOnly = s.endDate ? s.endDate.substring(0, 10) : undefined;

  return {
    id: String(s.id),
    title: s.title,
    start: dateOnly,
    end: endDateOnly,
    backgroundColor: colors.bg,
    textColor: colors.text,
    borderColor: 'transparent',
    extendedProps: {
      type: s.type,
      status: s.status,
      time: timeOnly,
      projectId: s.projectId,
      description: s.description ?? '',
    },
  };
}

function toISODateTime(date: string, time: string): string {
  // Monta a data/hora local e converte para UTC antes de enviar ao backend.
  // O backend Java usa LocalDateTime sem fuso e compara com now() UTC,
  // então precisamos enviar sempre em UTC para evitar rejeições incorretas.
  const localDate = new Date(`${date}T${time || '00:00'}:00`);
  // Formata como "YYYY-MM-DDTHH:mm:ss" em UTC (sem o 'Z' final, pois o backend espera LocalDateTime)
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${localDate.getUTCFullYear()}-${pad(localDate.getUTCMonth() + 1)}-${pad(localDate.getUTCDate())}T${pad(localDate.getUTCHours())}:${pad(localDate.getUTCMinutes())}:00`;
}

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

  async getEvents(month?: number, year?: number): Promise<CalendarEvent[]> {
    try {
      let res: AxiosResponse<Schedule[], unknown>;

      if (month && year) {
        res = await api.get<Schedule[]>(`/schedules?month=${month}&year=${year}`);
      } else {
        res = await api.get<Schedule[]>(`/schedules`);
      }

      if(res.status === 204 || !res.data) {
        return [];
      }

      return res.data.map(toCalendarEvent);
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } }).response?.status;
      if (status === 204) return [];
      console.error('Erro ao buscar eventos da agenda:', error);
      return [];
    }
  }

  async createEvent(data: ScheduleSchemaType): Promise<CalendarEvent> {
    const payload = {
      title: data.title,
      description: data.description ?? '',
      startDate: toISODateTime(data.start, data.time),
      endDate: data.endDate ? toISODateTime(data.endDate, data.time) : undefined,
      type: data.type,
      projectId: data.projectId
    };

    const res = await api.post<Schedule>('/schedules', payload);
    return toCalendarEvent(res.data);
  }

  async updateEvent(id: string, data: ScheduleSchemaType): Promise<CalendarEvent> {
    const payload = {
      title: data.title,
      description: data.description ?? '',
      startDate: toISODateTime(data.start, data.time),
      endDate: data.endDate ? toISODateTime(data.endDate, data.time) : undefined,
      type: data.type,
      projectId: data.projectId
    };

    const res = await api.patch<Schedule>(`/schedules/${id}`, payload);
    return toCalendarEvent(res.data);
  }

  async deleteEvent(id: string): Promise<void> {
    await api.delete(`/schedules/${id}`);
  }
}
