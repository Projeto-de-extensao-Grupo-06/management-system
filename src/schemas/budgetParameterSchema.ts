import { z } from 'zod';
export const parameterOptionSchema = z.object({
    id: z.number().optional(),
    type: z.string().min(1, 'Nome da opção é obrigatório'),
    additionTax: z.coerce
        .number({ error: 'Taxa de adição deve ser um número' })
        .min(0, 'Taxa não pode ser negativa')
        .max(1, 'Taxa deve ser entre 0 e 1 (ex: 0.08 para 8%)')
        .default(0),
    fixedCost: z.coerce
        .number({ error: 'Custo fixo deve ser um número' })
        .min(0, 'Custo fixo não pode ser negativo')
        .default(0),
});

export const budgetParameterSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    description: z.string().optional(),
    metric: z.string().min(1, 'Selecione uma métrica'),
    isPreBudget: z.boolean(),
    fixedValue: z.number().min(0, 'Valor base não pode ser negativo'),
    status: z.enum(['ATIVO', 'INATIVO']),
    options: z.array(parameterOptionSchema).optional(),
});

export type BudgetParameterSchemaType = z.infer<typeof budgetParameterSchema>;