import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '../pages/auth/login/Login';

const { mockLogin } = vi.hoisted(() => ({
    mockLogin: vi.fn()
}));

vi.mock('../services/LoginService', () => {
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

    it('shows error alert on login failure', async () => {
        const user = userEvent.setup();

        mockLogin.mockRejectedValue({
            response: { status: 401, data: { message: 'Credenciais inválidas' } }
        });

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        const emailInput = screen.getByPlaceholderText(/exemplo@gmail.com/i);
        const passwordInput = screen.getByPlaceholderText(/Informe sua Senha/i);
        const submitButton = screen.getByRole('button', { name: /Entrar/i });

        await user.type(emailInput, 'wrong@test.com');
        await user.type(passwordInput, 'wrongpass');
        await user.click(submitButton);

        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalled();
        });

        const errorAlert = await screen.findByText(/Credenciais inválidas/i);
        expect(errorAlert).toBeInTheDocument();
    });
});
