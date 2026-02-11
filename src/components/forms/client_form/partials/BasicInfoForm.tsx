import { Controller, useFormContext } from 'react-hook-form';
import type { ClientSchemaType } from '../../../../schemas/clientSchema';
import { DocumentInput, Input, PhoneInput, Select, SelectOption } from '../../../ui/Form';
import styles from '../ClientForm.module.css';

interface BasicInfoFormProps {
    readOnly?: boolean;
}

export default function BasicInfoForm({ readOnly }: BasicInfoFormProps) {
    const { control, watch } = useFormContext<ClientSchemaType>();

    const formValues = watch();

    if (readOnly) {
        return (
            <div className={styles.container}>
                <div className={styles.gridTwo}>
                    <div>
                        <label className={styles.fieldLabel}>Primeiro Nome:</label>
                        <div className={styles.readOnlyField}>{formValues.firstName || '-'}</div>
                    </div>
                    <div>
                        <label className={styles.fieldLabel}>Segundo Nome:</label>
                        <div className={styles.readOnlyField}>{formValues.lastName || '-'}</div>
                    </div>
                </div>

                <div className={styles.gridTwo}>
                    <div>
                        <label className={styles.fieldLabel}>Tipo de Pessoa:</label>
                        <div className={styles.readOnlyField}>
                            {formValues.documentType === 'CNPJ' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                        </div>
                    </div>
                    <div>
                        <label className={styles.fieldLabel}>Documento:</label>
                        <div className={styles.readOnlyField}>{formValues.document || '-'}</div>
                    </div>
                </div>

                <div className={styles.gridTwo}>
                    <div>
                        <label className={styles.fieldLabel}>Email:</label>
                        <div className={styles.readOnlyField}>{formValues.email || '-'}</div>
                    </div>
                    <div>
                        <label className={styles.fieldLabel}>Telefone:</label>
                        <div className={styles.readOnlyField}>{formValues.phone || '-'}</div>
                    </div>
                </div>

                {formValues.notes && (
                    <div className={styles.inputGroup}>
                        <label className={styles.fieldLabel}>Notas:</label>
                        <div className={styles.readOnlyField}>{formValues.notes}</div>
                    </div>
                )}
            </div>
        );
    }

    const documentType = watch('documentType');

    return (
        <div className={styles.container}>
            <div className={styles.gridTwo}>
                <div className={styles.inputGroup}>
                    <label htmlFor="firstName" className={styles.fieldLabel}>
                        Primeiro Nome <span className={styles.required}>*</span>
                    </label>
                    <Controller
                        name="firstName"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <>
                                <Input
                                    {...field}
                                    id="firstName"
                                    placeholder="Ex: João"
                                    className={error ? styles.inputError : ''}
                                />
                                {error && <span className={styles.errorMessage}>{error.message}</span>}
                            </>
                        )}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="lastName" className={styles.fieldLabel}>
                        Segundo Nome <span className={styles.required}>*</span>
                    </label>
                    <Controller
                        name="lastName"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <>
                                <Input
                                    {...field}
                                    id="lastName"
                                    placeholder="Ex: Silva"
                                    className={error ? styles.inputError : ''}
                                />
                                {error && <span className={styles.errorMessage}>{error.message}</span>}
                            </>
                        )}
                    />
                </div>
            </div>

            <div className={styles.gridTwo}>
                <div className={styles.inputGroup}>
                    <label htmlFor="documentType" className={styles.fieldLabel}>
                        Tipo de Pessoa <span className={styles.required}>*</span>
                    </label>
                    <Controller
                        name="documentType"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                id="documentType"
                            >
                                <SelectOption value="CPF" label="Pessoa Física" />
                                <SelectOption value="CNPJ" label="Pessoa Jurídica" />
                            </Select>
                        )}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="document" className={styles.fieldLabel}>
                        Documento ({documentType}) <span className={styles.required}>*</span>
                    </label>
                    <Controller
                        name="document"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <>
                                <DocumentInput
                                    {...field}
                                    id="document"
                                    type={documentType}
                                    className={error ? styles.inputError : ''}
                                />
                                {error && <span className={styles.errorMessage}>{error.message}</span>}
                            </>
                        )}
                    />
                </div>
            </div>

            <div className={styles.gridTwo}>
                <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.fieldLabel}>
                        Email <span className={styles.required}>*</span>
                    </label>
                    <Controller
                        name="email"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <>
                                <Input
                                    {...field}
                                    id="email"
                                    type="email"
                                    placeholder="exemplo@email.com"
                                    className={error ? styles.inputError : ''}
                                />
                                {error && <span className={styles.errorMessage}>{error.message}</span>}
                            </>
                        )}
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="phone" className={styles.fieldLabel}>
                        Telefone <span className={styles.required}>*</span>
                    </label>
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field, fieldState: { error } }) => (
                            <>
                                <PhoneInput
                                    {...field}
                                    id="phone"
                                    className={error ? styles.inputError : ''}
                                />
                                {error && <span className={styles.errorMessage}>{error.message}</span>}
                            </>
                        )}
                    />
                </div>
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="notes" className={styles.fieldLabel}>
                    Notas
                </label>
                <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            id="notes"
                            placeholder="Notas sobre o cliente"
                        />
                    )}
                />
            </div>
        </div>
    );
}


