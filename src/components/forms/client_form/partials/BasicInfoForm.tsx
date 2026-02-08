import { useMask } from '@react-input/mask';
import { useFormContext } from 'react-hook-form';
import type { ClientSchemaType } from '../../../../schemas/clientSchema';
import styles from '../ClientForm.module.css';

export default function BasicInfoForm() {
    const { register, formState: { errors }, watch } = useFormContext<ClientSchemaType>();
    const documentType = watch('documentType');

    const phoneMaskRef = useMask({ mask: '(__) _____-____', replacement: { _: /\d/ } });
    const cpfMaskRef = useMask({ mask: '___.___.___-__', replacement: { _: /\d/ } });
    const cnpjMaskRef = useMask({ mask: '__.___.___/____-__', replacement: { _: /\d/ } });

    const documentMaskRef = documentType === 'CPF' ? cpfMaskRef : cnpjMaskRef;
    const documentPlaceholder = documentType === 'CPF' ? '999.999.999-99' : '99.999.999/9999-99';

    const mergeRefs = (...refs: (React.Ref<any> | undefined)[]) => (e: any) => {
        refs.forEach((ref) => {
            if (typeof ref === 'function') ref(e);
            else if (ref != null && typeof ref === 'object' && 'current' in ref) (ref as React.MutableRefObject<any>).current = e;
        });
    };

    return (
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
    );
}
