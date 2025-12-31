import type Client from '../interfaces/types/Client';
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

    async createClient(client: Omit<Client, 'id' | 'status' | 'name'> & { document: string, documentType: string, zipCode: string, street: string, number: string, neighborhood: string, city: string, state: string, notes?: string }): Promise<Client> {
        const response = await api.post<Client>('/clients', client);
        return ClientMapper.toDomain(response.data);
    }
};