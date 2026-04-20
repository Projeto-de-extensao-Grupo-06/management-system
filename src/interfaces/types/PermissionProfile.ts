export interface PermissionProfile {
    id: number;
    role: string;
    // description?: string;
    // status: 'ATIVO' | 'INATIVO';
    permissions: ModulePermission[];
    mainModule: string;
    inUse: boolean;
    userCount: number;
}

export interface ModulePermission {
    moduleName: string;
    read: boolean;
    write: boolean;
    update: boolean;
    delete: boolean;
}