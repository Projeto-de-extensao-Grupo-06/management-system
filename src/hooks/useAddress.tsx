import { useState } from 'react';
import type { CreateAddressDto, ResponseAddressDto, UpdateAddressDto, UseAddressApiState, UseAddressApiReturn } from '../interfaces/types/AddressTypes';
import AddressService from '../services/AddressService';

export function useAddress(): UseAddressApiReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const addressService = new AddressService();

    const resetState = (): void => {
        setLoading(false);
        setError(null);
        setSuccess(false);
    };

    const createAddress = async (dto: CreateAddressDto): Promise<ResponseAddressDto | null> => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            const result = await addressService.createAddress(dto);

            setSuccess(true);
            setLoading(false);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao criar endereço';
            setError(errorMessage);
            setLoading(false);
            return null;
        }
    };

    const updateAddress = async (addressId: number, dto: UpdateAddressDto): Promise<ResponseAddressDto | null> => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            const result = await addressService.updateAddress(addressId, dto);

            setSuccess(true);
            setLoading(false);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar endereço';
            setError(errorMessage);
            setLoading(false);
            return null;
        }
    };

    const getAddressById = async (addressId: number): Promise<ResponseAddressDto | null> => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(false);

            const result = await addressService.getAddressById(addressId);

            setSuccess(true);
            setLoading(false);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao obter endereço';
            setError(errorMessage);
            setLoading(false);
            return null;
        }
    };

    return {
        loading,
        error,
        success,
        createAddress,
        updateAddress,
        getAddressById,
        resetState,
    };
}
