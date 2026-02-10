export interface Address {
  streetName: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  type: string;
}

export default interface Client {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  documentNumber: string;
  documentType?: string;
  mainAddress: Address | null;
  createdAt: string;
}