import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { BudgetParameterFormProps, BudgetParameterFormRef } from '../../../interfaces/properties/FormProps';
import styles from './BudgetParameterForm.module.css';
import BudgetParameterFields from '../../budgetDetails/budgetParameters/partials/BudgetParameterFields';


import { budgetParameterSchema, type BudgetParameterSchemaType } from '../../../schemas/budgetParameterSchema';

const BudgetParameterForm = forwardRef<BudgetParameterFormRef, BudgetParameterFormProps>(
    ({ onSubmit, defaultValues, readOnly }, ref) => {
        const methods = useForm({
            resolver: zodResolver(budgetParameterSchema) as any,
            defaultValues: {
                name: '',
                description: '',
                metric: '',
                is_pre_budget: false,
                fixed_value: 0,
                status: 'ATIVO' as const,
                options: [],
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
            submit: () => handleSubmit((data) => onSubmit(data as unknown as BudgetParameterSchemaType))(),
        }));

        return (
            <FormProvider {...methods}>
                <div className={styles.formContainer}>
                    <div className={styles.card}>
                        <h3 className={styles.sectionTitle}>Dados do Parâmetro:</h3>
                        <BudgetParameterFields readOnly={readOnly} />
                    </div>
                </div>
            </FormProvider>
        );
    }
);
BudgetParameterForm.displayName = 'BudgetParameterForm';
export default BudgetParameterForm;