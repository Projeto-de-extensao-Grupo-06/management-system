export interface ParameterOption{
    id: number;
    type: string;
    additionTax: number;
    fixedCost: number;
}

export default interface BudgetParameter {
    id: number;
    name: string;
    description?: string;
    metric: string;
    isPreBudget: boolean;
    fixedValue: number;
    status: 'ATIVO' | 'INATIVO';
    options?: ParameterOption[];
}