import type Client from '../interfaces/types/Client';
import type { Page } from '../interfaces/types/Page';
import type Project from '../interfaces/types/Project';
import ClientMapper from '../utils/mappers/ClientMapper';
import api from './provider/api';

export default class ClientsService {
    async getAllClients(page: number = 0, size: number = 20, search: string = '', status: string = 'ACTIVE'): Promise<Page<Client>> {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('size', size.toString());
        if (search) params.append('search', search);
        if (status && status !== 'Todos') params.append('status', status === 'Ativo' ? 'ACTIVE' : status === 'Inativo' ? 'INACTIVE' : status);

        const response = await api.get<Page<Client>>('/clients', { params });

        return {
            ...response.data,
            content: response.data.content.map(ClientMapper.toDomain)
        };
    }

    async deleteClient(id: number): Promise<void> {
        await api.delete(`/clients/${id}`);
    }

    async getClientById(id: number): Promise<Client> {
        const response = await api.get<Client>(`/clients/${id}`);
        return ClientMapper.toDomain(response.data);
    }

    async updateClient(id: number, client: Partial<Client>): Promise<Client> {
        const response = await api.put<Client>(`/clients/${id}`, client);
        return ClientMapper.toDomain(response.data);
    }

    async getClientProjects(id: number): Promise<Project[]> {
        const response = await api.get<Project[]>(`/clients/${id}/projects`);
        return response.data;
    }

    async createClient(client: { firstName: string, lastName: string, email: string, phone: string, document: string, documentType: string, zipCode: string, street: string, number: string, neighborhood: string, city: string, state: string, notes?: string }): Promise<Client> {
        const payload = {
            firstName: client.firstName,
            lastName: client.lastName,
            documentNumber: client.document.replace(/\D/g, ''),
            documentType: client.documentType,
            email: client.email,
            phone: client.phone.replace(/\D/g, ''),
            note: client.notes,
            mainAddress: {
                streetName: client.street,
                number: client.number,
                neighborhood: client.neighborhood,
                city: client.city,
                state: client.state,
                postalCode: client.zipCode.replace(/\D/g, ''),
                type: 'RESIDENTIAL',
            }
        };
        const response = await api.post<Client>('/clients', payload);
        return ClientMapper.toDomain(response.data);
    }
};