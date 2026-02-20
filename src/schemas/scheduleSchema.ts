import { z } from 'zod';

const today = () => new Date().toISOString().split('T')[0];

export const scheduleSchema = z.object({
    type: z.enum(['TECHNICAL_VISIT', 'INSTALL_VISIT', 'NOTE'], {
        message: 'Tipo de evento é obrigatório',
    }),
    start: z.string().min(1, 'Data é obrigatória'),
    time: z.string().min(1, 'Horário é obrigatório').regex(/^\d{2}:\d{2}$/, 'Horário inválido (use HH:MM)'),
    clientName: z.string().optional(),
    description: z.string().optional(),
});

export type ScheduleSchemaType = z.infer<typeof scheduleSchema>;

export const scheduleDefaultValues = (): Partial<ScheduleSchemaType> => ({
    type: 'TECHNICAL_VISIT',
    start: today(),
    time: '',
    clientName: '',
    description: '',
});
