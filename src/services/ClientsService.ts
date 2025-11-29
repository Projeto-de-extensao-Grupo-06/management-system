import api from './api';
import type User from '../interfaces/types/User';

export default class clientsService {
    async getAllClients(): Promise<User[]> {
        const response = await api.get<User[]>('/clients');
        return response.data;
    }
};