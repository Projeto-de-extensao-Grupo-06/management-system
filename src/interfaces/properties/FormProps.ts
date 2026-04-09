import type { ClientSchemaType } from "../../schemas/clientSchema";
import type { CoworkerSchemaType } from "../../schemas/coworkerSchema";

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

export interface CoworkerFormProps {
  onSubmit: (data: CoworkerSchemaType) => void;
  defaultValues?: Partial<CoworkerSchemaType>;
  readOnly?: boolean;
}
