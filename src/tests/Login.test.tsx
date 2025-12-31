import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from '../pages/Login/Login';

// Hoist mock function so it can be used in vi.mock factory
const { mockLogin } = vi.hoisted(() => ({
    mockLogin: vi.fn()
}));

// Explicitly mock the module with the hoisted mock
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
        // Reset mock implementation for failure case default
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

        // Setup mock to reject
        mockLogin.mockRejectedValue({
            response: { data: { message: 'Erro ao fazer login. Verifique suas credenciais.' } }
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

        // Expect the login to have been called
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalled();
        });

        // Expect alert to appear
        const errorAlert = await screen.findByText(/Erro ao fazer login/i);
        expect(errorAlert).toBeInTheDocument();
    });
});
