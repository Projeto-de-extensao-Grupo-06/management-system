import type { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type Client from '../interfaces/types/Client';
import type { Page } from '../interfaces/types/Page';
import type { ClientSchemaType } from '../schemas/clientSchema';
import ClientService from '../services/ClientsService';

interface ClientFilters {
    startDate: string;
    endDate: string;
    city: string;
    state: string;
}

interface UseClientsReturn {
    clients: Client[];
    page: number;
    totalPages: number;
    searchTerm: string;
    statusFilter: string;
    filters: ClientFilters;
    isLoading: boolean;
    error: string | null;
    setPage: (page: number) => void;
    setSearchTerm: (term: string) => void;
    setStatusFilter: (status: string) => void;
    setFilters: (filters: ClientFilters) => void;
    handleSearchChange: (term: string) => void;
    handleStatusChange: (status: string) => void;
    handleApplyFilters: (newFilters: ClientFilters) => void;
    handleClearFilters: () => void;
    createClient: (data: ClientSchemaType) => Promise<void>;
    deleteClient: (id: number) => Promise<void>;
    fetchClients: () => void;
}

export default function useClients(): UseClientsReturn {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Ativo');
    const [clients, setClients] = useState<Client[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [filters, setFilters] = useState<ClientFilters>({
        startDate: '',
        endDate: '',
        city: '',
        state: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const clientsService = useMemo(() => new ClientService(), []);

    const fetchClients = useCallback(() => {
        setIsLoading(true);
        setError(null);

        clientsService.getAllClients(
            page,
            20,
            searchTerm,
            statusFilter,
            filters.city,
            filters.state,
            filters.startDate,
            filters.endDate
        )
            .then((data: Page<Client>) => {
                setClients(data.content);
                setTotalPages(data.totalPages);
            })
            .catch(() => {
                setError('Erro ao carregar clientes.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [clientsService, page, searchTerm, statusFilter, filters]);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const handleSearchChange = useCallback((term: string) => {
        setSearchTerm(term);
        setPage(0);
    }, []);

    const handleStatusChange = useCallback((status: string) => {
        setStatusFilter(status);
        setPage(0);
    }, []);

    const handleApplyFilters = useCallback((newFilters: ClientFilters) => {
        setFilters(newFilters);
        setPage(0);
    }, []);

    const handleClearFilters = useCallback(() => {
        setFilters({
            startDate: '',
            endDate: '',
            city: '',
            state: ''
        });
        setPage(0);
    }, []);

    const createClient = useCallback(async (data: ClientSchemaType): Promise<void> => {
        try {
            await clientsService.createClient(data);
            fetchClients();
        } catch (e) {
            const axiosError = e as AxiosError<{ message: string, validationErrors?: { field: string, message: string }[] }>;
            let errorMsg = axiosError.response?.data?.message || 'Erro ao criar cliente. Verifique os dados.';

            if (axiosError.response?.data?.validationErrors?.length) {
                const details = axiosError.response.data.validationErrors
                    .map(err => `${err.field}: ${err.message}`)
                    .join('\n');
                errorMsg += `\n\n${details}`;
            }

            throw new Error(errorMsg);
        }
    }, [clientsService, fetchClients]);

    const deleteClient = useCallback(async (id: number): Promise<void> => {
        try {
            await clientsService.deleteClient(id);
            fetchClients();
        } catch (e) {
            const axiosError = e as AxiosError<{ message: string }>;
            const errorMessage = axiosError.response?.data?.message || 'Erro ao deletar cliente. Tente novamente.';
            throw new Error(errorMessage);
        }
    }, [clientsService, fetchClients]);

    return {
        clients,
        page,
        totalPages,
        searchTerm,
        statusFilter,
        filters,
        isLoading,
        error,
        setPage,
        setSearchTerm,
        setStatusFilter,
        setFilters,
        handleSearchChange,
        handleStatusChange,
        handleApplyFilters,
        handleClearFilters,
        createClient,
        deleteClient,
        fetchClients
    };
}
