import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useAddressAutofill } from '../../../hooks/useAddressAutofill';
import type { ClientFormProps, ClientFormRef } from '../../../interfaces/properties/FormProps';
import type { ClientSchemaType } from '../../../schemas/clientSchema';
import { clientSchema } from '../../../schemas/clientSchema';
import styles from './ClientForm.module.css';
import AddressForm from './partials/AddressForm';
import BasicInfoForm from './partials/BasicInfoForm';

const ClientForm = forwardRef<ClientFormRef, ClientFormProps>(({ onSubmit, defaultValues, onFormChange, readOnly }, ref) => {
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

    const { handleSubmit, watch, reset } = methods;

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues);
        }
    }, [defaultValues, reset]);

    useAddressAutofill();

    useEffect(() => {
        const subscription = watch((value) => {
            if (onFormChange) {
                onFormChange(value as Partial<ClientSchemaType>);
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, onFormChange]);

    useImperativeHandle(ref, () => ({
        submit: () => {
            handleSubmit(onSubmit)();
        },
    }));

    return (
        <FormProvider {...methods}>
            <div className={styles.formContainer}>
                <div className={styles.card}>
                    <h3 className={styles.sectionTitle}>Dados Cadastrais:</h3>
                    <BasicInfoForm readOnly={readOnly} />
                </div>

                <div className={styles.card}>
                    <h3 className={styles.sectionTitle}>Endereço:</h3>
                    <AddressForm readOnly={readOnly} />
                </div>
            </div>
        </FormProvider>
    );
});

export default ClientForm;


