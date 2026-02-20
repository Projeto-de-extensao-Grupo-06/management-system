import { z } from 'zod';

const todayStr = () => new Date().toISOString().split('T')[0];

export const scheduleSchema = z.object({
    type: z.enum(['TECHNICAL_VISIT', 'INSTALL_VISIT', 'NOTE']),
    start: z.string().min(1, 'Data de início é obrigatória').refine((val) => {
        return val >= todayStr();
    }, { message: 'A data não pode ser no passado' }),
    endDate: z.string().optional(),
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
    type: 'TECHNICAL_VISIT',
    start: todayStr(),
    endDate: '',
    time: '',
    projectId: null,
    description: '',
});
