// schemas/budgetParameterSchema.ts
import { z } from 'zod';

export const parameterOptionSchema = z.object({
    id: z.number().optional(),
    type: z.string().min(1, 'Nome da opção é obrigatório'),
    addition_tax: z.number().min(0).max(1).default(0),
    fixed_cost: z.number().min(0).default(0),
});

export const budgetParameterSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    description: z.string().optional(),
    metric: z.string().min(1, 'Métrica é obrigatória (ex: %, R$/h, un)'),
    is_pre_budget: z.boolean(),
    fixed_value: z.number().min(0, 'Valor base não pode ser negativo'),
    status: z.enum(['ATIVO', 'INATIVO']),
    options: z.array(parameterOptionSchema).optional(),
});

export type BudgetParameterSchemaType = z.infer<typeof budgetParameterSchema>;