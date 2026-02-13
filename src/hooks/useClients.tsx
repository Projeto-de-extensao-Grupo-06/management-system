import type { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type Client from '../interfaces/types/Client';
import type { ClientFilters, UseClientsReturn } from '../interfaces/types/HookTypes';
import type { Page } from '../interfaces/types/Page';
import type { ClientSchemaType } from '../schemas/clientSchema';
import { clientSchema } from '../schemas/clientSchema';
import ClientService from '../services/ClientsService';

export default function useClients(): UseClientsReturn {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Ativo');
    const [clients, setClients] = useState<Client[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [filters, setFilters] = useState<ClientFilters>({
        startDate: '',
        endDate: '',
        city: '',
        state: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const clientsService = useMemo(() => new ClientService(), []);

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        setIsLoading(true);
        setError(null);

        clientsService.getAllClients(
            page,
            10,
            searchTerm,
            statusFilter,
            filters.city,
            filters.state,
            filters.startDate,
            filters.endDate
        )
            .then((data: Page<Client>) => {
                console.log('Response data:', data);
                console.log('Total Pages:', data.totalPages, 'Total Elements:', data.totalElements);
                setClients(data.content);
                const total = data.totalPages || Math.ceil(data.totalElements / (data.pageable?.pageSize || 20));
                setTotalPages(total);
                setTotalElements(data.totalElements);
            })
            .catch(() => {
                setError('Erro ao carregar clientes.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [clientsService, page, searchTerm, statusFilter, filters, refetchTrigger]);
    /* eslint-enable react-hooks/set-state-in-effect */

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
            setRefetchTrigger(prev => prev + 1);
        } catch (e) {
            const axiosError = e as AxiosError<{ message: string, validationErrors?: { field: string, message: string }[], errors?: string[] }>;
            let errorMsg = '';

            // Tratar erro 409 (Conflito - duplicação)
            if (axiosError.response?.status === 409) {
                const responseData = axiosError.response.data;
                const message = responseData?.message || '';

                let duplicateField = '';
                if (message.toLowerCase().includes('email')) {
                    duplicateField = 'E-mail';
                }

                if (message.toLowerCase().includes('document') || message.toLowerCase().includes('cpf') || message.toLowerCase().includes('cnpj')) {
                    duplicateField = 'Documento';
                }

                if (message.toLowerCase().includes('phone')) {
                    duplicateField = 'Telefone';
                }

                if (duplicateField) {
                    errorMsg = `${duplicateField} já está cadastrado no sistema. Verifique os dados e tente novamente.`;
                } else {
                    errorMsg = message || 'Este cliente já existe no sistema. Verifique os dados.';
                }
            } else {
                errorMsg = axiosError.response?.data?.message || 'Erro ao criar cliente. Verifique os dados.';

                if (axiosError.response?.data?.validationErrors?.length) {
                    const details = axiosError.response.data.validationErrors
                        .map(err => `${err.field}: ${err.message}`)
                        .join('\n');
                    errorMsg += `\n\n${details}`;
                }

                if (axiosError.response?.data?.errors?.length) {
                    const details = axiosError.response.data.errors.join('\n');
                    errorMsg += `\n\n${details}`;
                }
            }

            throw new Error(errorMsg);
        }
    }, [clientsService]);

    const deleteClient = useCallback(async (id: number): Promise<void> => {
        try {
            await clientsService.deleteClient(id);
            setRefetchTrigger(prev => prev + 1);
        } catch (e) {
            const axiosError = e as AxiosError<{ message: string }>;
            const errorMessage = axiosError.response?.data?.message || 'Erro ao deletar cliente. Tente novamente.';
            throw new Error(errorMessage);
        }
    }, [clientsService]);

    const updateClient = useCallback(async (id: number, data: ClientSchemaType): Promise<Client> => {
        try {
            const validatedData = clientSchema.parse(data);

            const hasAddress = !!(validatedData.street || validatedData.number || validatedData.neighborhood || validatedData.city || validatedData.state || validatedData.zipCode);

            const clientPayload: any = {
                firstName: validatedData.firstName,
                lastName: validatedData.lastName,
                documentNumber: validatedData.document.replace(/\D/g, ''),
                documentType: validatedData.documentType,
                email: validatedData.email,
                phone: validatedData.phone.replace(/\D/g, ''),
                note: validatedData.notes,
            };

            if (hasAddress) {
                clientPayload.mainAddress = {
                    streetName: validatedData.street,
                    number: validatedData.number,
                    neighborhood: validatedData.neighborhood,
                    city: validatedData.city,
                    state: validatedData.state,
                    postalCode: validatedData.zipCode.replace(/\D/g, ''),
                    type: 'RESIDENTIAL',
                };
            }

            const response = await clientsService.updateClient(id, clientPayload);
            setRefetchTrigger(prev => prev + 1);
            return response;
        } catch (e) {
            if (e instanceof Error && e.message.includes('validation')) {
                throw new Error(`Validação falhou: ${e.message}`);
            }

            const axiosError = e as AxiosError<{ message: string, validationErrors?: { field: string, message: string }[], errors?: string[] }>;
            let errorMsg = '';

            if (axiosError.response?.status === 409) {
                const responseData = axiosError.response.data;
                const message = responseData?.message || '';

                let duplicateField = '';
                if (message.toLowerCase().includes('email')) {
                    duplicateField = 'E-mail';
                }

                if (message.toLowerCase().includes('document') || message.toLowerCase().includes('cpf') || message.toLowerCase().includes('cnpj')) {
                    duplicateField = 'Documento';
                }

                if (message.toLowerCase().includes('phone')) {
                    duplicateField = 'Telefone';
                }

                if (duplicateField) {
                    errorMsg = `${duplicateField} já está cadastrado no sistema. Verifique os dados e tente novamente.`;
                } else {
                    errorMsg = message || 'Este cliente já existe no sistema. Verifique os dados.';
                }
            } else {
                errorMsg = axiosError.response?.data?.message || 'Erro ao atualizar cliente. Verifique os dados.';

                if (axiosError.response?.data?.validationErrors?.length) {
                    const details = axiosError.response.data.validationErrors
                        .map(err => `${err.field}: ${err.message}`)
                        .join('\n');
                    errorMsg += `\n\n${details}`;
                }

                if (axiosError.response?.data?.errors?.length) {
                    const details = axiosError.response.data.errors.join('\n');
                    errorMsg += `\n\n${details}`;
                }
            }

            throw new Error(errorMsg);
        }
    }, [clientsService]);

    return {
        clients,
        page,
        totalPages,
        totalElements,
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
        updateClient,
        deleteClient
    };
}
