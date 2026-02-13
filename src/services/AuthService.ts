import type { ChangePasswordWithToken, LoginCredentials, PasswordRecoveryCredentials } from '../interfaces/types/AuthTypes';
import api from './provider/api';
  
export default class authService {
  async login(credentials: LoginCredentials): Promise<void> {
    await api.post('/auth/login', credentials);
  }

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  }

  async requestRecoveryCode(email: string): Promise<void> {
    await api.post("/auth/forget-password", { email });
  }

  async verifyOtpCode(credentials: PasswordRecoveryCredentials): Promise<number> {
    const data = await api.post("/auth/confirm-otp", credentials);

    return data.status;
  }

  async changePasswordWithToken(password: ChangePasswordWithToken) {
    await api.patch("/auth/change-password/token", password);
  }
};