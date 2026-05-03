import type { BudgetParameterSchemaType } from "../../schemas/budgetParameterSchema";
import type { ClientSchemaType } from "../../schemas/clientSchema";
import type {
  CoworkerEditSchemaType,
  CoworkerSchemaType,
} from "../../schemas/coworkerSchema";
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

export interface CoworkerCreateFormProps {
  onSubmit: (data: CoworkerSchemaType) => void;
  defaultValues?: Partial<CoworkerSchemaType>;
  readOnly?: boolean;
  mode: "create";
}

export interface CoworkerEditFormProps {
  onSubmit: (data: CoworkerEditSchemaType) => void;
  defaultValues?: Partial<CoworkerEditSchemaType>;
  readOnly?: boolean;
  mode: "edit";
}

export type CoworkerFormProps = CoworkerCreateFormProps | CoworkerEditFormProps;

export interface BudgetParameterFormProps {
  onSubmit: (data: BudgetParameterSchemaType) => void;
  defaultValues?: Partial<BudgetParameterSchemaType>;
  readOnly?: boolean;
}

export interface BudgetParameterFormRef {
  submit: () => void;
}
