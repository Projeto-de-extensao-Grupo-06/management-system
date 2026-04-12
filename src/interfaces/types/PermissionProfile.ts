export interface PermissionProfile {
    id: number;
    name: string;
    description?: string;
    status: 'ATIVO' | 'INATIVO';
    permissions: Record<string, string[]>;
    mainModule: string;
}