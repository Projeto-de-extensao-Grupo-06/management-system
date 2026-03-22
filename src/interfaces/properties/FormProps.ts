import type { ClientSchemaType } from '../../schemas/clientSchema';
import type { BudgetParameterSchemaType } from '../../schemas/budgetParameterSchema';
export interface ClientFormRef {
    submit: () => void;
}

export interface ClientFormProps {
    onSubmit: (data: ClientSchemaType) => void;
    defaultValues?: Partial<ClientSchemaType>;
    readOnly?: boolean;
}

export interface BudgetParameterFormProps {
    onSubmit: (data: BudgetParameterSchemaType) => void;
    defaultValues?: Partial<BudgetParameterSchemaType>;
    readOnly?: boolean;
}

export interface BudgetParameterFormRef {
    submit: () => void;
}
