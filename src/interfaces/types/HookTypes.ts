import type { ClientSchemaType } from '../../schemas/clientSchema';
import type Client from './Client';

export interface ClientFilters {
    startDate: string;
    endDate: string;
    city: string;
    state: string;
}

export interface UseClientsReturn {
    clients: Client[];
    page: number;
    totalPages: number;
    totalElements: number;
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
    updateClient: (id: number, data: ClientSchemaType) => Promise<Client>;
    deleteClient: (id: number) => Promise<void>;
}
