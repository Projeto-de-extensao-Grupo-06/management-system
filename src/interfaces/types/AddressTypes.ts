export interface ViaCepResponse {
    cep: string;
    logradouro: string;
    complemento: string;
    bairro: string;
    localidade: string;
    uf: string;
    ibge: string;
    gia: string;
    ddd: string;
    siafi: string;
    erro?: boolean;
}

export interface CreateAddressDto {
    streetName: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
    type: string;
}

export interface UpdateAddressDto {
    streetName?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    type?: string;
}

export interface ResponseAddressDto {
    id: number;
    streetName: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
    type: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface UseAddressApiState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

export interface AddressLookupDto {
    state: string;
    cities: string[];
}

export interface UseAddressApiReturn extends UseAddressApiState {
    createAddress: (dto: CreateAddressDto) => Promise<ResponseAddressDto | null>;
    updateAddress: (addressId: number, dto: UpdateAddressDto) => Promise<ResponseAddressDto | null>;
    getAddressById: (addressId: number) => Promise<ResponseAddressDto | null>;
    getAddressLookup: () => Promise<AddressLookupDto[] | null>;
    resetState: () => void;
}
