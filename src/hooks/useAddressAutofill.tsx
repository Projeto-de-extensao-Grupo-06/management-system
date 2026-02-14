import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import type { ClientSchemaType } from '../schemas/clientSchema';
import AddressService from '../services/AddressService';

export function useAddressAutofill() {
    const formContext = useFormContext<ClientSchemaType>();
    const zipCode = formContext?.watch('zipCode') ?? '';
    const addressService = useMemo(() => new AddressService(), []);
    const lastFetchedCep = useRef<string | null>(null);


    const fetchAddressByCep = useCallback(async (cep: string) => {
        const cleanCep = cep.replace(/\D/g, '');

        if (cleanCep.length !== 8 || !formContext) {
            return;
        }

        try {
            const address = await addressService.getAddressByCep(cleanCep);

            if (address?.cep) {
                formContext.setValue('street', address.logradouro);
                formContext.setValue('neighborhood', address.bairro);
                formContext.setValue('city', address.localidade);
                formContext.setValue('state', address.uf);
                formContext.clearErrors('zipCode');
            } else {
                formContext.setError('zipCode', {
                    type: 'manual',
                    message: 'CEP não encontrado',
                });
            }
        } catch {
            if (formContext) {
                formContext.setError('zipCode', {
                    type: 'manual',
                    message: 'Erro ao buscar CEP',
                });
            }
        }
    }, [addressService, formContext]);

    useEffect(() => {
        if (!zipCode || !formContext) return;

        const cleanCep = zipCode.replace(/\D/g, '');

        if (cleanCep.length !== 8) return;

        if (lastFetchedCep.current === cleanCep) return;

        lastFetchedCep.current = cleanCep;
        fetchAddressByCep(cleanCep);
    }, [zipCode, fetchAddressByCep]);
}
