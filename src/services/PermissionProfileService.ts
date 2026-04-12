import type {PermissionProfile} from '../interfaces/types/PermissionProfile';
import type { Page } from '../interfaces/types/Page';
import type { PermissionProfileSchemaType } from '../schemas/permissionProfileSchema';
import api from './provider/api';

interface RawPermissionProfile extends Omit<PermissionProfile, 'status'> {
    active: boolean;
}

export default class PermissionProfileService {

    // async getAll(
    //     page: number,
    //     size: number,
    //     search: string,
    //     status: string
    // ): Promise<Page<PermissionProfile>> {

    //     const params: Record<string, unknown> = { page, size };

    //     if (search) params.search = search;
    //     if (status !== 'Todos') params.status = status;

    //     const response = await api.get('/permission-profiles', { params });
    //     const data = response.data;

    //     const content = data.content.map((p: RawPermissionProfile) => ({
    //         ...p,
    //         status: p.active ? 'ATIVO' : 'INATIVO',
    //     }));

    //     return { ...data, content };
    // }

    async getAll(): Promise<Page<PermissionProfile>> {
    const mock: PermissionProfile[] = [
        {
            id: 1,
            name: 'Administrador',
            description: 'Acesso total ao sistema',
            status: 'ATIVO',
            mainModule: 'DASHBOARD',
            permissions: {
                DASHBOARD: ['VIEW'],
                CLIENTS: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
                PROJECTS: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
            },
        },
        {
            id: 2,
            name: 'Vendedor',
            description: 'Acesso comercial',
            status: 'ATIVO',
            mainModule: 'CLIENTS',
            permissions: {
                CLIENTS: ['VIEW', 'CREATE'],
                PROJECTS: ['VIEW'],
            },
        },
    ];

    // return {
    //     content: mock,
    //     totalElements: mock.length,
    //     totalPages: 1,
    //     size: 10,
    //     number: 0,
    // };
}

    async getById(id: number): Promise<PermissionProfile> {
        const response = await api.get<RawPermissionProfile>(`/permission-profiles/${id}`);
        const p = response.data;

        return {
            ...p,
            status: p.active ? 'ATIVO' : 'INATIVO',
        };
    }

    async create(data: PermissionProfileSchemaType): Promise<PermissionProfile> {
        const response = await api.post<RawPermissionProfile>(
            '/permission-profiles',
            data
        );

        const profile = response.data;

        return {
            ...profile,
            status: profile.active ? 'ATIVO' : 'INATIVO',
        };
    }

    async update(id: number, data: PermissionProfileSchemaType): Promise<PermissionProfile> {
        const response = await api.put<RawPermissionProfile>(
            `/permission-profiles/${id}`,
            data
        );

        const profile = response.data;

        return {
            ...profile,
            status: profile.active ? 'ATIVO' : 'INATIVO',
        };
    }

    async delete(id: number): Promise<void> {
        await api.delete(`/permission-profiles/${id}`);
    }
}