import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '../pages/auth/login/Login';

const { mockLogin } = vi.hoisted(() => ({
    mockLogin: vi.fn()
}));

vi.mock('../services/AuthService', () => {
    return {
        default: function () {
            return {
                login: mockLogin
            };
        }
    };
});

vi.mock('../store/useAuthStore', () => ({
    default: () => ({
        user: null,
        isAuthenticated: false,
        setUser: vi.fn(),
        checkAuth: vi.fn(),
    }),
}));

describe('LoginPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockLogin.mockResolvedValue({});
    });

    it('renders login form elements', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText(/exemplo@gmail.com/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Informe sua Senha/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Entrar/i })).toBeInTheDocument();
    });
});
