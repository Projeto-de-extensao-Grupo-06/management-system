import type { ClientSchemaType } from '../../schemas/clientSchema';

export interface ClientFormRef {
    submit: () => void;
}

export interface ClientFormProps {
    onSubmit: (data: ClientSchemaType) => void;
    defaultValues?: Partial<ClientSchemaType>;
    onFormChange?: (data: Partial<ClientSchemaType>) => void;
}
