export interface ClientFilters {
    startDate: string;
    endDate: string;
    city: string;
    state: string;
}

export interface UseClientsReturn {
    clients: import('./Client').default[];
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
    createClient: (data: import('../../schemas/clientSchema').ClientSchemaType) => Promise<void>;
    deleteClient: (id: number) => Promise<void>;
    fetchClients: () => void;
}
