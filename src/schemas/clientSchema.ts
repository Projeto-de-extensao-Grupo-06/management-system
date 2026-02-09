import { cpf, cnpj } from 'cpf-cnpj-validator';
import { z } from 'zod';

export const clientSchema = z.object({
    firstName: z.string().min(1, 'Primeiro nome é obrigatório'),
    lastName: z.string().min(1, 'Segundo nome é obrigatório'),
    email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
    phone: z.string().min(1, 'Telefone é obrigatório'),
    zipCode: z.string().transform(val => val || ''),
    street: z.string().transform(val => val || ''),
    number: z.string().transform(val => val || ''),
    neighborhood: z.string().transform(val => val || ''),
    city: z.string().transform(val => val || ''),
    state: z.string().transform(val => val || ''),
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

    const addressFields = {
        zipCode: data.zipCode?.trim() || '',
        street: data.street?.trim() || '',
        number: data.number?.trim() || '',
        neighborhood: data.neighborhood?.trim() || '',
        city: data.city?.trim() || '',
        state: data.state?.trim() || '',
    };

    const hasAnyAddressField = Object.values(addressFields).some(field => field !== '');

    if (hasAnyAddressField) {
        if (!addressFields.zipCode || addressFields.zipCode.replace(/\D/g, '').length !== 8) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'CEP é obrigatório e deve ter 8 dígitos',
                path: ['zipCode'],
            });
        }
        if (!addressFields.street) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Logradouro é obrigatório',
                path: ['street'],
            });
        }
        if (!addressFields.number) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Número é obrigatório',
                path: ['number'],
            });
        }
        if (!addressFields.neighborhood) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Bairro é obrigatório',
                path: ['neighborhood'],
            });
        }
        if (!addressFields.city) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Cidade é obrigatória',
                path: ['city'],
            });
        }
        if (!addressFields.state || addressFields.state.length !== 2) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Estado é obrigatório (use a sigla com 2 letras)',
                path: ['state'],
            });
        }
    }
});

export type ClientSchemaType = z.infer<typeof clientSchema>;
