import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { PermissionProfileFormProps, PermissionProfileFormRef } from '../../../interfaces/properties/FormProps';
import { permissionProfileSchema, type PermissionProfileSchemaType } from '../../../schemas/permissionProfileSchema';
import PermissionProfileFields from '../../../components/permissionProfile/PermissionProfileFields';
import styles from './PermissionProfileForm.module.css';

const PermissionProfileForm = forwardRef<PermissionProfileFormRef, PermissionProfileFormProps>(
    ({ onSubmit, defaultValues, readOnly }, ref) => {
        const methods = useForm({
            resolver: zodResolver(permissionProfileSchema) as any,
            defaultValues: {
                name: '',
                mainModule: '',
                permissions: [],
                ...defaultValues,
            },
        });

        const { handleSubmit, reset } = methods;

        useEffect(() => {
            if (defaultValues) {
                reset({ ...methods.getValues(), ...defaultValues });
            }
        }, [defaultValues, reset]);

        useImperativeHandle(ref, () => ({
            submit: () =>
                handleSubmit((data) =>
                    onSubmit(data as unknown as PermissionProfileSchemaType)
                )(),
        }));

        return (
            <FormProvider {...methods}>
                <div className={styles.formContainer}>
                    <div className={styles.card}>
                        <h3 className={styles.sectionTitle}>
                            Dados do Perfil de Permissão:
                        </h3>

                        <PermissionProfileFields readOnly={readOnly} />
                    </div>
                </div>
            </FormProvider>
        );
    }
);

PermissionProfileForm.displayName = 'PermissionProfileForm';
export default PermissionProfileForm;