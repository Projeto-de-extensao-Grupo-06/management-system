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

export interface PasswordRecoveryCredentials {
  email: string;
  otp: string;
}

export default class authService {
  async login(credentials: LoginCredentials): Promise<void> {
    await api.post('/auth/login', credentials);
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }

  async requestRecoveryCode(email: string): Promise<void> {
    await api.post("/auth/forget-password", {email});
  }

  async verifyOtpCode(credentials: PasswordRecoveryCredentials): Promise<number> {
    const data = await api.post("/auth/confirm-otp", credentials);

    return data.status;
  }
};