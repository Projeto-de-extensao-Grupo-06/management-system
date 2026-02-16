import type { AddressLookupDto, CreateAddressDto, ResponseAddressDto, UpdateAddressDto, ViaCepResponse } from "../interfaces/types/AddressTypes";
import api from "./provider/api";
import viaCepApi from "./provider/viaCepApi";

export default class AddressService {
    async getAddressByCep(cep: string): Promise<ViaCepResponse | null> {
        try {
            const cleanCep = cep.replace(/\D/g, "");
            if (cleanCep.length !== 8) return null;

            const response = await viaCepApi.get<ViaCepResponse>(`${cleanCep}/json/`);

            if (response.data.erro) {
                return null;
            }

            return response.data;
        } catch (error) {
            console.error("Error fetching address by CEP:", error);
            return null;
        }
    }

    async createAddress(dto: CreateAddressDto): Promise<ResponseAddressDto> {
        const response = await api.post<ResponseAddressDto>('/address', dto);
        return response.data;
    }

    async updateAddress(addressId: number, dto: UpdateAddressDto): Promise<ResponseAddressDto> {
        const response = await api.patch<ResponseAddressDto>(`/address/${addressId}`, dto);
        return response.data;
    }

    async getAddressById(addressId: number): Promise<ResponseAddressDto> {
        const response = await api.get<ResponseAddressDto>(`/address/${addressId}`);
        return response.data;
    }

    async getAddressLookup(): Promise<AddressLookupDto[]> {
        const response = await api.get<AddressLookupDto[]>('/address/lookup');
        return response.data;
    }
}
