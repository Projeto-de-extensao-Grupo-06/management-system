import { useMask } from '@react-input/mask';
import { useFormContext } from 'react-hook-form';
import type { ClientSchemaType } from '../../../schemas/clientSchema';
import styles from '../ClientForm.module.css';

export default function AddressForm() {
    const { register, formState: { errors } } = useFormContext<ClientSchemaType>();
    const cepMaskRef = useMask({ mask: '_____-___', replacement: { _: /\d/ } });

    const mergeRefs = (...refs: (React.Ref<any> | undefined)[]) => (e: any) => {
        refs.forEach((ref) => {
            if (typeof ref === 'function') ref(e);
            else if (ref != null && typeof ref === 'object' && 'current' in ref) (ref as React.MutableRefObject<any>).current = e;
        });
    };

    return (
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
    );
}
