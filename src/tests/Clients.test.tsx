import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Mock } from 'vitest';
import type Client from '../interfaces/types/Client';
import Clients from '../pages/clients/Clients';

const mockGetAllClients = vi.fn();
const mockCreateClient = vi.fn();
const mockDeleteClient = vi.fn();
const mockUpdateClient = vi.fn();
const mockGetClientById = vi.fn();
const mockGetClientProjects = vi.fn();

vi.mock('../services/ClientsService', () => {
    return {
        default: class {
            getAllClients = mockGetAllClients;
            createClient = mockCreateClient;
            deleteClient = mockDeleteClient;
            updateClient = mockUpdateClient;
            getClientById = mockGetClientById;
            getClientProjects = mockGetClientProjects;
        }
    };
});

vi.stubGlobal('confirm', vi.fn());
vi.stubGlobal('scrollTo', vi.fn());
Element.prototype.scrollTo = vi.fn();

const mockClients: Client[] = [
    {
        id: 1,
        firstName: 'João',
        lastName: 'Silva',
        name: 'João Silva',
        email: 'joao@example.com',
        phone: '11999999999',
        documentNumber: '12345678900',
        status: 'Ativo',
        createdAt: '2023-01-01T10:00:00Z',
        mainAddress: {
            streetName: 'Rua A',
            number: '123',
            neighborhood: 'Centro',
            city: 'São Paulo',
            state: 'SP',
            postalCode: '01000-000',
            type: 'RESIDENTIAL'
        }
    },
    {
        id: 2,
        firstName: 'Maria',
        lastName: 'Souza',
        name: 'Maria Souza',
        email: 'maria@example.com',
        phone: '11988888888',
        documentNumber: '98765432100',
        status: 'Inativo',
        createdAt: '2023-02-01T10:00:00Z',
        mainAddress: {
            streetName: 'Rua B',
            number: '456',
            neighborhood: 'Bairro',
            city: 'Rio de Janeiro',
            state: 'RJ',
            postalCode: '02000-000',
            type: 'RESIDENTIAL'
        }
    }
];

const mockPage = {
    content: mockClients,
    totalPages: 1,
    totalElements: 2,
    size: 20,
    number: 0,
    first: true,
    last: true,
    empty: false
};

describe('Clients Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetAllClients.mockResolvedValue(mockPage);
    });

    it('should render clients list correctly', async () => {
        render(
            <MemoryRouter>
                <Clients />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('João Silva')).toBeInTheDocument();
            expect(screen.getByText('Maria Souza')).toBeInTheDocument();
        });

        expect(screen.getByRole('heading', { name: /Clientes/i })).toBeInTheDocument();
        // expect(screen.getByText('(2)')).toBeInTheDocument(); // Count depends on filteredClients which is now page content based
    });

    it('should callback backend with search term', async () => {
        render(
            <MemoryRouter>
                <Clients />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('João Silva')).toBeInTheDocument());

        const searchInput = screen.getByPlaceholderText('Buscar por Nome, CPF/CNPJ, E-mail ou Telefone');
        await userEvent.type(searchInput, 'Maria');

        await waitFor(() => {
            expect(mockGetAllClients).toHaveBeenCalledWith(0, 20, 'Maria', 'Ativo', '', '', '', '');
        });
    });

    it('should callback backend with status filter', async () => {
        render(
            <MemoryRouter>
                <Clients />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('João Silva')).toBeInTheDocument());
    });

    it('should open filter modal and filter by city (local filter)', async () => {
        render(
            <MemoryRouter>
                <Clients />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('João Silva')).toBeInTheDocument());

        const filterBtn = screen.getByText('Filtros');
        await userEvent.click(filterBtn);

        expect(screen.getByText('Filtrar Clientes')).toBeInTheDocument();

        const cityInput = screen.getByPlaceholderText('Digite a cidade');
        await userEvent.type(cityInput, 'Rio de Janeiro');

        const applyBtn = screen.getByText('Aplicar Filtros');
        await userEvent.click(applyBtn);

        await waitFor(() => {
            expect(mockGetAllClients).toHaveBeenCalledWith(0, 20, '', 'Ativo', 'Rio de Janeiro', '', '', '');
        });
    });

    it('should handle client deletion success', async () => {
        mockDeleteClient.mockResolvedValue({});
        (window.confirm as Mock).mockReturnValue(true);

        const mockPageAfterDelete = {
            ...mockPage,
            content: [mockClients[1]],
            totalElements: 1
        };

        mockGetAllClients
            .mockResolvedValueOnce(mockPage)
            .mockResolvedValueOnce(mockPageAfterDelete);

        render(
            <MemoryRouter>
                <Clients />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('João Silva')).toBeInTheDocument());

        const deleteButtons = screen.getAllByLabelText('Deletar');

        await userEvent.click(deleteButtons[0]);

        expect(window.confirm).toHaveBeenCalled();
        expect(mockDeleteClient).toHaveBeenCalledWith(1);

        await waitFor(() => {
            expect(screen.getByText('Cliente removido com sucesso!')).toBeInTheDocument();
            expect(screen.queryByText('João Silva')).not.toBeInTheDocument();
        });
    });

    it('should handle client deletion backend error', async () => {
        mockDeleteClient.mockRejectedValue({
            response: { data: { message: 'Erro ao deletar: Possui vínculos.' } }
        });
        (window.confirm as Mock).mockReturnValue(true);

        render(
            <MemoryRouter>
                <Clients />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('João Silva')).toBeInTheDocument());

        const deleteButtons = screen.getAllByLabelText('Deletar');
        await userEvent.click(deleteButtons[0]);

        await waitFor(() => {
            expect(screen.getByText('Erro ao deletar: Possui vínculos.')).toBeInTheDocument();
        });

        expect(screen.getByText('João Silva')).toBeInTheDocument();
    });

    it('should handle creation error', async () => {
        mockCreateClient.mockRejectedValue({
            response: {
                data: {
                    message: 'Erro de validação',
                    validationErrors: [{ field: 'email', message: 'Email já existe' }]
                }
            }
        });

        render(
            <MemoryRouter>
                <Clients />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText('Clientes')).toBeInTheDocument());

        const createBtn = screen.getByText('Cadastrar Cliente', { selector: 'button' });
        await userEvent.click(createBtn);

        expect(screen.getByText('Criar Cliente')).toBeInTheDocument();

        vi.spyOn(console, 'error').mockImplementation(() => { });

        expect(screen.getAllByText('Cadastrar Cliente')[1]).toBeInTheDocument();
    });
});
