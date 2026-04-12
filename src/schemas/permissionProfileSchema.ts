import { z } from 'zod';

export const permissionSchema = z.object({
    module: z.string().min(1, 'Módulo é obrigatório'),

    view: z.boolean(),
    create: z.boolean(),
    edit: z.boolean(),
    delete: z.boolean(),
});

export const permissionProfileSchema = z.object({
    name: z
        .string()
        .min(3, 'Nome do perfil deve ter pelo menos 3 caracteres'),

    mainModule: z
        .string()
        .min(1, 'Selecione um módulo principal'),

    permissions: z
        .array(permissionSchema)
        .min(1, 'Defina pelo menos uma permissão'),
});

export type PermissionProfileSchemaType = z.infer<
    typeof permissionProfileSchema
>;