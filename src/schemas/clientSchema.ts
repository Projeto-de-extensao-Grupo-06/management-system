import { z } from 'zod';

const cleanString = (val: string) => val.replace(/[^\d]+/g, '');

const isValidCPF = (cpf: string) => {
    cpf = cleanString(cpf);
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let sum = 0, remainder;
    for (let i = 1; i <= 9; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(9, 10))) return false;
    sum = 0;
    for (let i = 1; i <= 10; i++) sum = sum + parseInt(cpf.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cpf.substring(10, 11))) return false;
    return true;
};

const isValidCNPJ = (cnpj: string) => {
    cnpj = cleanString(cnpj);
    if (cnpj.length !== 14) return false;
    let length = cnpj.length - 2
    let numbers = cnpj.substring(0, length);
    const digits = cnpj.substring(length);
    let sum = 0;
    let pos = length - 7;
    for (let i = length; i >= 1; i--) {
        sum += parseInt(numbers.charAt(length - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(0))) return false;
    length = length + 1;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;
    for (let i = length; i >= 1; i--) {
        sum += parseInt(numbers.charAt(length - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - sum % 11;
    if (result !== parseInt(digits.charAt(1))) return false;
    return true;
};

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
        if (!isValidCPF(data.document)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'CPF inválido',
                path: ['document'],
            });
        }
    } else if (data.documentType === 'CNPJ') {
        if (!isValidCNPJ(data.document)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'CNPJ inválido',
                path: ['document'],
            });
        }
    }
});

export type ClientSchemaType = z.infer<typeof clientSchema>;
