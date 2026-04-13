import type { ClientSchemaType } from "../../schemas/clientSchema";
import type {
  CoworkerEditSchemaType,
  CoworkerSchemaType,
} from "../../schemas/coworkerSchema";
import type { BudgetParameterSchemaType } from "../../schemas/budgetParameterSchema";
export interface ClientFormRef {
  submit: () => void;
}

export interface ClientFormProps {
  onSubmit: (data: ClientSchemaType) => void;
  defaultValues?: Partial<ClientSchemaType>;
  readOnly?: boolean;
}

export interface CoworkerFormRef {
  submit: () => void;
}

export type CoworkerFormData = CoworkerSchemaType | CoworkerEditSchemaType;

export interface CoworkerFormProps {
  onSubmit: (data: CoworkerFormData) => void;
  defaultValues?: Partial<CoworkerFormData>;
  readOnly?: boolean;
  mode?: "create" | "edit";
}

export interface BudgetParameterFormProps {
  onSubmit: (data: BudgetParameterSchemaType) => void;
  defaultValues?: Partial<BudgetParameterSchemaType>;
  readOnly?: boolean;
}

export interface BudgetParameterFormRef {
  submit: () => void;
}
