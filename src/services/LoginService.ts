import api from './api';
import type User from '../interfaces/types/User';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  message?: string;
}

export default class authService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/login', credentials);
    return response.data;
  }

  async logout(): Promise<void> {
    await api.post('/logout');
    localStorage.removeItem('user');
  }
};