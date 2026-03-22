export interface ParameterOption{
    id: number;
    type: string;
    addition_tax: number;
    fixed_cost: number;
}

export default interface BudgetParameter {
    id: number;
    name: string;
    description?: string;
    metric: string;
    is_pre_budget: boolean;
    fixed_value: number;
    status: 'ATIVO' | 'INATIVO';
    options?: ParameterOption[];
}