import type { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type BudgetParameter from '../interfaces/types/BudgetParameter';
import type { BudgetParameterSchemaType } from '../schemas/budgetParameterSchema';
import BudgetParameterService from '../services/BudgetParameterService';

export default function useBudgetParameterDetail(id: number) {
    const [parameter, setParameter] = useState<BudgetParameter | null>(null);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const service = useMemo(() => new BudgetParameterService(), []);

    useEffect(() => {
        if (!id) return;

        service.getById(id)
            .then((data) => setParameter(data))
            .catch(() => setAlert({ message: 'Erro ao carregar parâmetro.', type: 'error' }))
            .finally(() => setLoading(false));
    }, [id, service]);

    const updateParameter = useCallback(async (data: BudgetParameterSchemaType): Promise<BudgetParameter> => {
        try {
            const updated = await service.update(id, data);
            setParameter(updated);
            return updated;
        } catch (e) {
            const axiosError = e as AxiosError<{ message: string }>;
            throw new Error(axiosError.response?.data?.message || 'Erro ao atualizar parâmetro.');
        }
    }, [id, service]);

    return {
        parameter,
        loading,
        alert,
        setAlert,
        updateParameter,
    };
}