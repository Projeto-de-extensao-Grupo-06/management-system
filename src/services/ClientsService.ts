import type Client from '../interfaces/types/Client';
import type Project from '../interfaces/types/Project';
import ClientMapper from '../utils/mappers/ClientMapper';
import api from './provider/api';

export default class ClientsService {
    async getAllClients(): Promise<Client[]> {
        const response = await api.get<Client[]>('/clients');
        return response.data.map(ClientMapper.toDomain);
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
        // Assuming there's an endpoint to get projects for a client
        // If not, we might need to filter from all projects or similar
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