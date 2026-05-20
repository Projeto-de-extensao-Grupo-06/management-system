import { z } from 'zod';

// Usa a data local do usuário (não UTC) para evitar problemas de fuso horário.
// Ex.: com UTC-3, toISOString() às 21h retornaria o dia seguinte em UTC.
const todayStr = () => {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

export const scheduleSchema = z.object({
    title: z.string().min(1, 'O título é obrigatório'),
    type: z.enum(['TECHNICAL_VISIT', 'INSTALL_VISIT', 'NOTE']),
    start: z.string().min(1, 'Data de início é obrigatória').refine((val) => {
        return val >= todayStr();
    }, { message: 'A data não pode ser no passado' }),
    endDate: z.string().optional().refine((val) => {
        if (!val) return true;
        return val >= todayStr();
    }, { message: 'A data de término não pode ser no passado' }),
    time: z.string().min(1, 'Horário é obrigatório').regex(/^\d{2}:\d{2}$/, 'Horário inválido (use HH:MM)'),
    projectId: z.number().nullable().optional(),
    description: z.string().optional(),
}).refine((data) => {
    if (data.endDate && data.endDate < data.start) {
        return false;
    }
    return true;
}, {
    message: 'Data de término deve ser após a data de início',
    path: ['endDate'],
}).refine((data) => {
    if (data.type !== 'NOTE' && !data.projectId) {
        return false;
    }
    return true;
}, {
    message: 'Projeto é obrigatório para visitas',
    path: ['projectId'],
});

export type ScheduleSchemaType = z.infer<typeof scheduleSchema>;

export const scheduleDefaultValues = (): Partial<ScheduleSchemaType> => ({
    title: '',
    type: 'TECHNICAL_VISIT',
    start: todayStr(),
    endDate: '',
    time: '',
    projectId: null,
    description: '',
});
