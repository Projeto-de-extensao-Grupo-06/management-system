import type User from '../interfaces/types/User';
import api from './provider/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  message?: string;
}

export default class authService {
  async login(credentials: LoginCredentials): Promise<void> {
    await api.post('/auth/login', credentials);
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }
};