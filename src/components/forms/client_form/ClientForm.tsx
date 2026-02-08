import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { ClientFormProps, ClientFormRef } from '../../../interfaces/properties/FormProps';
import type { ClientSchemaType } from '../../../schemas/clientSchema';
import { clientSchema } from '../../../schemas/clientSchema';
import AddressService from '../../../services/AddressService';
import styles from './ClientForm.module.css';
import AddressForm from './partials/AddressForm';
import BasicInfoForm from './partials/BasicInfoForm';

const ClientForm = forwardRef<ClientFormRef, ClientFormProps>(({ onSubmit, defaultValues, onFormChange }, ref) => {
    const methods = useForm<ClientSchemaType>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            document: '',
            documentType: 'CPF',
            notes: '',
            zipCode: '',
            state: '',
            city: '',
            neighborhood: '',
            street: '',
            number: '',
            ...defaultValues,
        },
    });

    const {
        handleSubmit,
        watch,
        setValue,
        setError,
        clearErrors,
    } = methods;

    const zipCode = watch('zipCode');
    const addressService = useMemo(() => new AddressService(), []);

    useEffect(() => {
        if (onFormChange) {
            const subscription = watch((value) => onFormChange(value as Partial<ClientSchemaType>));
            return () => subscription.unsubscribe();
        }
    }, [watch, onFormChange]);

    useImperativeHandle(ref, () => ({
        submit: () => {
            handleSubmit(onSubmit)();
        },
    }));

    // Auto-fill address by CEP
    useEffect(() => {
        const fetchAddress = async () => {
            const cleanCep = zipCode?.replace(/\D/g, '');
            if (cleanCep?.length === 8) {
                const address = await addressService.getAddressByCep(cleanCep);
                if (address) {
                    setValue('street', address.logradouro);
                    setValue('neighborhood', address.bairro);
                    setValue('city', address.localidade);
                    setValue('state', address.uf);
                    clearErrors('zipCode');
                } else {
                    setError('zipCode', { type: 'manual', message: 'CEP não encontrado' });
                }
            }
        };

        if (zipCode && zipCode.replace(/\D/g, '').length === 8) {
            fetchAddress();
        }
    }, [zipCode, addressService, setValue, setError, clearErrors]);

    return (
        <FormProvider {...methods}>
            <div className={styles.formContainer}>
                <BasicInfoForm />
                <AddressForm />
            </div>
        </FormProvider>
    );
});

export default ClientForm;


