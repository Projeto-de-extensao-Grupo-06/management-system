import type Client from '../interfaces/types/Client';
import api from './api';

export default class ClientsService {
    async getAllClients(): Promise<Client[]> {
        const response = await api.get<Client[]>('/clients');
        return response.data;
    }

    async deleteClient(id: number): Promise<void> {
        await api.delete(`/clients/${id}`);
    }
};