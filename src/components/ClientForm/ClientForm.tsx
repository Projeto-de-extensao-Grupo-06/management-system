import { zodResolver } from '@hookform/resolvers/zod';
import { useMask } from '@react-input/mask';
import { forwardRef, useEffect, useImperativeHandle, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { ClientSchemaType } from '../../schemas/clientSchema';
import { clientSchema } from '../../schemas/clientSchema';
import AddressService from '../../services/AddressService';
import styles from './ClientForm.module.css';

export interface ClientFormRef {
    submit: () => void;
}

interface ClientFormProps {
    onSubmit: (data: ClientSchemaType) => void;
    defaultValues?: Partial<ClientSchemaType>;
    onFormChange?: (data: Partial<ClientSchemaType>) => void;
}

const ClientForm = forwardRef<ClientFormRef, ClientFormProps>(({ onSubmit, defaultValues, onFormChange }, ref) => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<ClientSchemaType>({
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

    const documentType = watch('documentType');
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


    // Masks
    const phoneMaskRef = useMask({ mask: '(__) _____-____', replacement: { _: /\d/ } });
    const cepMaskRef = useMask({ mask: '_____-___', replacement: { _: /\d/ } });
    const cpfMaskRef = useMask({ mask: '___.___.___-__', replacement: { _: /\d/ } });
    const cnpjMaskRef = useMask({ mask: '__.___.___/____-__', replacement: { _: /\d/ } });

    const documentMaskRef = documentType === 'CPF' ? cpfMaskRef : cnpjMaskRef;
    const documentPlaceholder = documentType === 'CPF' ? '999.999.999-99' : '99.999.999/9999-99';

    // Helper to merge refs
    const mergeRefs = (...refs: (React.Ref<any> | undefined)[]) => (e: any) => {
        refs.forEach((ref) => {
            if (typeof ref === 'function') ref(e);
            else if (ref != null && typeof ref === 'object' && 'current' in ref) (ref as React.MutableRefObject<any>).current = e;
        });
    };

    return (
        <div className={styles.formContainer}>
            {/* Dados Cadastrais */}
            <div>
                <h3 className={styles.sectionTitle}>Dados Cadastrais:</h3>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Primeiro Nome:<span className={styles.required}>*</span>
                        </label>
                        <input
                            className={`${styles.input} ${errors.firstName ? styles.inputError : ''}`}
                            placeholder="João"
                            {...register('firstName')}
                        />
                        {errors.firstName && <span className={styles.errorMessage}>{errors.firstName.message}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Segundo Nome:<span className={styles.required}>*</span>
                        </label>
                        <input
                            className={`${styles.input} ${errors.lastName ? styles.inputError : ''}`}
                            placeholder="Silva"
                            {...register('lastName')}
                        />
                        {errors.lastName && <span className={styles.errorMessage}>{errors.lastName.message}</span>}
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            E-mail:<span className={styles.required}>*</span>
                        </label>
                        <input
                            className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                            type="email"
                            placeholder="joao.silva@example.com"
                            {...register('email')}
                        />
                        {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Telefone:<span className={styles.required}>*</span>
                        </label>
                        <input
                            className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                            placeholder="(11) 98888-7777"
                            {...register('phone')}
                            ref={mergeRefs(register('phone').ref, phoneMaskRef)}
                        />
                        {errors.phone && <span className={styles.errorMessage}>{errors.phone.message}</span>}
                    </div>
                </div>

                <div className={`${styles.row} ${styles.fourPattern}`}>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`} style={{ gridColumn: 'span 2' }}>
                        <label className={styles.label}>
                            Número Documento:<span className={styles.required}>*</span>
                        </label>
                        <input
                            className={`${styles.input} ${errors.document ? styles.inputError : ''}`}
                            placeholder={documentPlaceholder}
                            {...register('document')}
                            ref={mergeRefs(register('document').ref, documentMaskRef)}
                        />
                        {errors.document && <span className={styles.errorMessage}>{errors.document.message}</span>}
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`} style={{ gridColumn: 'span 2' }}>
                        <label className={styles.label}>
                            Tipo do Documento:<span className={styles.required}>*</span>
                        </label>
                        <select
                            className={styles.select}
                            {...register('documentType')}
                        >
                            <option value="CPF">CPF</option>
                            <option value="CNPJ">CNPJ</option>
                        </select>
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={`${styles.formGroup}`} style={{ gridColumn: '1 / -1' }}>
                        <label className={styles.label}>Notas:</label>
                        <input
                            className={styles.input}
                            placeholder="Lorem ipsum dolor"
                            {...register('notes')}
                        />
                    </div>
                </div>
            </div>

            {/* Endereço */}
            <div>
                <h3 className={styles.sectionTitle}>Endereço:</h3>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            CEP:<span className={styles.required}>*</span>
                        </label>
                        <input
                            className={`${styles.input} ${errors.zipCode ? styles.inputError : ''}`}
                            placeholder="01414-000"
                            {...register('zipCode')}
                            ref={mergeRefs(register('zipCode').ref, cepMaskRef)}
                        />
                        {errors.zipCode && <span className={styles.errorMessage}>{errors.zipCode.message}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Estado:<span className={styles.required}>*</span>
                        </label>
                        <input
                            className={`${styles.input} ${errors.state ? styles.inputError : ''}`}
                            placeholder="SP"
                            maxLength={2}
                            {...register('state')}
                        />
                        {errors.state && <span className={styles.errorMessage}>{errors.state.message}</span>}
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Cidade:<span className={styles.required}>*</span>
                        </label>
                        <input
                            className={`${styles.input} ${errors.city ? styles.inputError : ''}`}
                            placeholder="São Paulo"
                            {...register('city')}
                        />
                        {errors.city && <span className={styles.errorMessage}>{errors.city.message}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Bairro:<span className={styles.required}>*</span>
                        </label>
                        <input
                            className={`${styles.input} ${errors.neighborhood ? styles.inputError : ''}`}
                            placeholder="Cerqueira César"
                            {...register('neighborhood')}
                        />
                        {errors.neighborhood && <span className={styles.errorMessage}>{errors.neighborhood.message}</span>}
                    </div>
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Logradouro:<span className={styles.required}>*</span>
                        </label>
                        <input
                            className={`${styles.input} ${errors.street ? styles.inputError : ''}`}
                            placeholder="Rua Haddock Lobo"
                            {...register('street')}
                        />
                        {errors.street && <span className={styles.errorMessage}>{errors.street.message}</span>}
                    </div>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>
                            Número:<span className={styles.required}>*</span>
                        </label>
                        <input
                            className={`${styles.input} ${errors.number ? styles.inputError : ''}`}
                            placeholder="595"
                            {...register('number')}
                        />
                        {errors.number && <span className={styles.errorMessage}>{errors.number.message}</span>}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ClientForm;
