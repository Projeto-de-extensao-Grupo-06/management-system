import type { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type BudgetParameter from '../interfaces/types/BudgetParameter';
import type { Page } from '../interfaces/types/Page';
import type { BudgetParameterSchemaType } from '../schemas/budgetParameterSchema';
import BudgetParameterService from '../services/BudgetParameterService';

export default function useBudgetParameters() {
    const [parameters, setParameters] = useState<BudgetParameter[]>([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('Todos');
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const service = useMemo(() => new BudgetParameterService(), []);

    useEffect(() => {
        service
            .getAll(page, 30, searchTerm, typeFilter, statusFilter)
            .then((resData: Page<BudgetParameter>) => {
                const data = resData as any;
                const pageMeta = data.page || data;
                const totalElementsCount = pageMeta.totalElements ?? data.totalElements ?? 0;
                const totalPagesCount = pageMeta.totalPages ?? data.totalPages ?? 0;

                setParameters(data.content || []);
                setTotalPages(totalPagesCount);
                setTotalElements(totalElementsCount);
            })
            .catch(() => setParameters([]));
    }, [service, page, searchTerm, typeFilter, statusFilter, refetchTrigger]);

    const handleSearchChange = useCallback((term: string) => {
        setSearchTerm(term);
        setPage(0);
    }, []);

    const handleTypeChange = useCallback((value: string) => {
        setTypeFilter(value);
        setPage(0);
    }, []);

    const handleStatusChange = useCallback((value: string) => {
        setStatusFilter(value);
        setPage(0);
    }, []);

    const createParameter = useCallback(async (data: BudgetParameterSchemaType): Promise<void> => {
        try {
            await service.create(data);
            setRefetchTrigger(prev => prev + 1);
        } catch (e) {
            const axiosError = e as AxiosError<{ message: string }>;
            throw new Error(axiosError.response?.data?.message || 'Erro ao criar parâmetro.');
        }
    }, [service]);

    const deleteParameter = useCallback(async (id: number): Promise<void> => {
        try {
            await service.deactivate(id);
            setRefetchTrigger(prev => prev + 1);
        } catch (e) {
            const axiosError = e as AxiosError<{ message: string }>;
            throw new Error(axiosError.response?.data?.message || 'Erro ao desativar parâmetro.');
        }
    }, [service]);

    const activateParameter = useCallback(async (id: number): Promise<void> => {
        try {
            await service.activate(id);
            setRefetchTrigger(prev => prev + 1);
        } catch (e) {
            const axiosError = e as AxiosError<{ message: string }>;
            const msg = axiosError.response?.data?.message;

            if (msg === 'This parameter is already active.') {
                throw new Error('Este parâmetro já está ativo.');
            }

            throw new Error('Erro ao ativar parâmetro.');
        }
    }, [service]);

    return {
        parameters,
        page,
        totalPages,
        totalElements,
        searchTerm,
        typeFilter,
        statusFilter,
        setPage,
        handleSearchChange,
        handleTypeChange,
        handleStatusChange,
        createParameter,
        deleteParameter,
        activateParameter,
    };
}