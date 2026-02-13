import type User from './User';

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

export interface ChangePasswordWithToken {
    password: string;
}
