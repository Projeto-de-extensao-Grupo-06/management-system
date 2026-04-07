import type BudgetParameter from '../interfaces/types/BudgetParameter';
import type { Page } from '../interfaces/types/Page';
import type { BudgetParameterSchemaType } from '../schemas/budgetParameterSchema';
import api from "./provider/api";

export default class BudgetParameterService {
    async getAll(
        page: number,
        size: number,
        search: string,
        isPreBudget: string,
        status: string
    ): Promise<Page<BudgetParameter>> {
        const params: Record<string, unknown> = { page, size };
        if (search) params.search = search;
        if (isPreBudget !== 'Todos') params.isPreBudget = isPreBudget === 'true';
        if (status !== 'Todos') params.status = status;

        const response = await api.get('/budget-parameters', { params });
        const data = response.data;

        const content = data.content.map((p: any) => ({
            ...p,
            status: p.active ? 'ATIVO' : 'INATIVO',
        }));

        return { ...data, content };
    }

    async getById(id: number): Promise<BudgetParameter> {
        const response = await api.get(`/budget-parameters/${id}`);
        const p = response.data;
        return {
            ...p,
            status: p.active ? 'ATIVO' : 'INATIVO',
        };
    }

    async create(data: BudgetParameterSchemaType): Promise<BudgetParameter> {
        const response = await api.post('/budget-parameters', data);
        const p = response.data;
        return { ...p, status: p.active ? 'ATIVO' : 'INATIVO' };
    }

    async update(id: number, data: BudgetParameterSchemaType): Promise<BudgetParameter> {
        const response = await api.put(`/budget-parameters/${id}`, data);
        const p = response.data;
        return { ...p, status: p.active ? 'ATIVO' : 'INATIVO' };
    }

    async deactivate(id: number): Promise<void> {
        await api.delete(`/budget-parameters/${id}`);
    }

    async activate(id: number): Promise<void> {
    await api.put(`/budget-parameters/${id}/activate`);
}
}