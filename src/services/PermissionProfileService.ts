import type { Page } from '../interfaces/types/Page';
import type { PermissionProfile } from '../interfaces/types/PermissionProfile';
import type { PermissionProfileSchemaType } from '../schemas/permissionProfileSchema';
import api from './provider/api';

const ALL_MODULES = ['CLIENT', 'PROJECT', 'BUDGET', 'SCHEDULE', 'MATERIAL', 'CONFIGURATION'];

function toBackendPayload(data: PermissionProfileSchemaType) {
    return {
        role: data.name,
        mainModule: data.mainModule,
        permissions: ALL_MODULES.map((moduleName) => {
            const found = data.permissions.find((p) => p.module === moduleName);
            return {
                moduleName,
                read:   found?.view   ?? false,
                write:  found?.create ?? false,
                update: found?.edit   ?? false,
                delete: found?.delete ?? false,
            };
        }),
    };
}

export default class PermissionProfileService {

    async getAll(page: number, size: number, search: string, mainModule?: string): Promise<Page<PermissionProfile>> {
        const params: Record<string, unknown> = { page, size };
        if (search) params.search = search;
        if (mainModule) params.mainModule = mainModule;
        const response = await api.get('/permission-groups', { params });
        return response.data;
    }

    async getById(id: number): Promise<PermissionProfile> {
        const response = await api.get<PermissionProfile>(`/permission-groups/${id}`);
        return response.data;
    }

    async create(data: PermissionProfileSchemaType): Promise<PermissionProfile> {
        const response = await api.post<PermissionProfile>('/permission-groups', toBackendPayload(data));
        return response.data;
    }

    async update(id: number, data: PermissionProfileSchemaType): Promise<PermissionProfile> {
        const response = await api.put<PermissionProfile>(`/permission-groups/${id}`, toBackendPayload(data));
        return response.data;
    }

    async delete(id: number): Promise<void> {
        await api.delete(`/permission-groups/${id}`);
    }
}