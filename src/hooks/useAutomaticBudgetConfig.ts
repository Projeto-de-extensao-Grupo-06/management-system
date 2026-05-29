import type { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type AutomaticBudgetConfig from '../interfaces/types/AutomaticBudgetConfig';
import type { AutomaticBudgetConfigSchemaType } from '../schemas/automaticBudgetConfigSchema';
import AutomaticBudgetConfigService from '../services/AutomaticBudgetConfigService';

export default function useAutomaticBudgetConfig() {
    const [config, setConfig] = useState<AutomaticBudgetConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    const service = useMemo(() => new AutomaticBudgetConfigService(), []);

    useEffect(() => {
        service
            .getConfig()
            .then((data) => setConfig(data))
            .catch(() => setAlert({ message: 'Erro ao carregar configurações.', type: 'error' }))
            .finally(() => setLoading(false));
    }, [service]);

    const saveConfig = useCallback(async (data: AutomaticBudgetConfigSchemaType): Promise<void> => {
        try {
            const updated = await service.saveConfig(data);
            setConfig(updated);
        } catch (e) {
            const axiosError = e as AxiosError<{ message: string }>;
            throw new Error(axiosError.response?.data?.message || 'Erro ao salvar configurações.');
        }
    }, [service]);

    return {
        config,
        loading,
        alert,
        setAlert,
        saveConfig,
    };
}