import { cpf, cnpj } from 'cpf-cnpj-validator';
import { z } from 'zod';

export const clientSchema = z.object({
    firstName: z.string().min(1, 'Primeiro nome é obrigatório'),
    lastName: z.string().min(1, 'Segundo nome é obrigatório'),
    email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
    phone: z.string().min(1, 'Telefone é obrigatório'),
    zipCode: z.string().min(8, 'CEP inválido'), // Assumes raw or masked length check
    street: z.string().min(1, 'Logradouro é obrigatório'),
    number: z.string().min(1, 'Número é obrigatório'),
    neighborhood: z.string().min(1, 'Bairro é obrigatório'),
    city: z.string().min(1, 'Cidade é obrigatória'),
    state: z.string().min(1, 'Estado é obrigatório').max(2, 'Use a sigla do estado'),
    documentType: z.enum(['CPF', 'CNPJ']),
    document: z.string(),
    notes: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.documentType === 'CPF') {
        if (!cpf.isValid(data.document)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'CPF inválido',
                path: ['document'],
            });
        }
    } else if (data.documentType === 'CNPJ') {
        if (!cnpj.isValid(data.document)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'CNPJ inválido',
                path: ['document'],
            });
        }
    }
});

export type ClientSchemaType = z.infer<typeof clientSchema>;
