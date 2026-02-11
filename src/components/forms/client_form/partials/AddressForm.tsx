import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { CepInput, Input } from '../../../ui/Form';
import styles from '../ClientForm.module.css';

interface AddressFormProps {
    readOnly?: boolean;
}

export default function AddressForm({ readOnly }: AddressFormProps) {
    const { watch, control } = useFormContext();
    const formValues = watch();

    const isAddressFilled = useMemo(() => {
        const { zipCode, state, city, neighborhood, street, number } = formValues;
        return !!(zipCode || state || city || neighborhood || street || number);
    }, [formValues]);

    if (readOnly) {
        return (
            <div className={styles.container}>
                <div className={styles.gridTwo}>
                    <div>
                        <label className={styles.fieldLabel}>CEP:</label>
                        <div className={styles.readOnlyField}>{formValues.zipCode || '-'}</div>
                    </div>
                    <div>
                        <label className={styles.fieldLabel}>Estado:</label>
                        <div className={styles.readOnlyField}>{formValues.state || '-'}</div>
                    </div>
                </div>

                <div className={styles.gridTwo}>
                    <div>
                        <label className={styles.fieldLabel}>Cidade:</label>
                        <div className={styles.readOnlyField}>{formValues.city || '-'}</div>
                    </div>
                    <div>
                        <label className={styles.fieldLabel}>Bairro:</label>
                        <div className={styles.readOnlyField}>{formValues.neighborhood || '-'}</div>
                    </div>
                </div>

                <div className={styles.gridTwo}>
                    <div>
                        <label className={styles.fieldLabel}>Logradouro:</label>
                        <div className={styles.readOnlyField}>{formValues.street || '-'}</div>
                    </div>
                    <div>
                        <label className={styles.fieldLabel}>Número:</label>
                        <div className={styles.readOnlyField}>{formValues.number || '-'}</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.gridTwo}>
                <div className={styles.inputGroup}>
                    <label htmlFor="zipCode" className={styles.fieldLabel}>
                        CEP
                        {isAddressFilled && <span className={styles.required}>*</span>}
                    </label>
                    <Controller
                        name="zipCode"
                        control={control}
                        render={({ field }) => <CepInput {...field} id="zipCode" className="input" />}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="state" className={styles.fieldLabel}>
                        Estado
                        {isAddressFilled && <span className={styles.required}>*</span>}
                    </label>
                    <Controller
                        name="state"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id="state"
                                placeholder="SP"
                                maxLength={2}
                            />
                        )}
                    />
                </div>
            </div>

            <div className={styles.gridTwo}>
                <div className={styles.inputGroup}>
                    <label htmlFor="city" className={styles.fieldLabel}>
                        Cidade
                        {isAddressFilled && <span className={styles.required}>*</span>}
                    </label>
                    <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id="city"
                                placeholder="São Paulo"
                            />
                        )}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="neighborhood" className={styles.fieldLabel}>
                        Bairro
                        {isAddressFilled && <span className={styles.required}>*</span>}
                    </label>
                    <Controller
                        name="neighborhood"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id="neighborhood"
                                placeholder="Centro"
                            />
                        )}
                    />
                </div>
            </div>

            <div className={styles.gridTwo}>
                <div className={styles.inputGroup}>
                    <label htmlFor="street" className={styles.fieldLabel}>
                        Rua
                        {isAddressFilled && <span className={styles.required}>*</span>}
                    </label>
                    <Controller
                        name="street"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id="street"
                                placeholder="Rua das Flores"
                            />
                        )}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="number" className={styles.fieldLabel}>
                        Número
                        {isAddressFilled && <span className={styles.required}>*</span>}
                    </label>
                    <Controller
                        name="number"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id="number"
                                placeholder="123"
                            />
                        )}
                    />
                </div>
            </div>
        </div>
    );
}


