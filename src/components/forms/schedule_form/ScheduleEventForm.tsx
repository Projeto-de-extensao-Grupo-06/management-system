import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { Select, SelectOption, Input } from '../../ui/Form';
import type { ScheduleSchemaType } from '../../../schemas/scheduleSchema';
import { scheduleSchema } from '../../../schemas/scheduleSchema';
import styles from './ScheduleEventForm.module.css';

export interface ScheduleFormRef {
    submit: () => void;
}

export interface ScheduleFormProps {
    onSubmit: (data: ScheduleSchemaType) => void;
    defaultValues?: Partial<ScheduleSchemaType>;
    readOnly?: boolean;
}

const ScheduleEventForm = forwardRef<ScheduleFormRef, ScheduleFormProps>(
    ({ onSubmit, defaultValues, readOnly = false }, ref) => {
        const {
            register,
            handleSubmit,
            reset,
            setValue,
            watch,
            formState: { errors },
        } = useForm<ScheduleSchemaType>({
            resolver: zodResolver(scheduleSchema),
            defaultValues: {
                type: 'TECHNICAL_VISIT',
                start: '',
                time: '',
                clientName: '',
                description: '',
                ...defaultValues,
            },
        });

        useEffect(() => {
            if (defaultValues) {
                reset({
                    type: 'TECHNICAL_VISIT',
                    start: '',
                    time: '',
                    clientName: '',
                    description: '',
                    ...defaultValues,
                });
            }
        }, [defaultValues, reset]);

        useImperativeHandle(ref, () => ({
            submit: () => {
                handleSubmit(onSubmit)();
            },
        }));

        const typeValue = watch('type');

        const typeLabels: Record<string, string> = {
            TECHNICAL_VISIT: 'Visita Técnica',
            INSTALL_VISIT: 'Visita de Instalação',
            NOTE: 'Lembrete',
        };

        return (
            <form className={styles.formContainer} onSubmit={(e) => e.preventDefault()}>
                <div className={styles.inputGroup}>
                    <label className={styles.fieldLabel}>
                        Tipo de lembrete:<span className={styles.required}>*</span>
                    </label>
                    {readOnly ? (
                        <div className={styles.readOnlyField}>{typeLabels[typeValue] ?? typeValue}</div>
                    ) : (
                        <Select
                            value={typeValue}
                            onChange={(val) =>
                                setValue('type', val as ScheduleSchemaType['type'], { shouldValidate: true })
                            }
                            className={errors.type ? styles.inputError : ''}
                        >
                            <SelectOption value="TECHNICAL_VISIT" label="Visita Técnica" />
                            <SelectOption value="INSTALL_VISIT" label="Visita de Instalação" />
                            <SelectOption value="NOTE" label="Lembrete" />
                        </Select>
                    )}
                    {errors.type && <span className={styles.errorMessage}>{errors.type.message}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.fieldLabel}>
                        Data:<span className={styles.required}>*</span>
                    </label>
                    <Input
                        type="date"
                        disabled={readOnly}
                        className={errors.start ? styles.inputError : ''}
                        {...register('start')}
                    />
                    {errors.start && <span className={styles.errorMessage}>{errors.start.message}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.fieldLabel}>
                        Horário:<span className={styles.required}>*</span>
                    </label>
                    <Input
                        type="time"
                        placeholder="10:00"
                        disabled={readOnly}
                        className={errors.time ? styles.inputError : ''}
                        {...register('time')}
                    />
                    {errors.time && <span className={styles.errorMessage}>{errors.time.message}</span>}
                </div>

                {typeValue !== 'NOTE' && (
                    <div className={styles.inputGroup}>
                        <label className={styles.fieldLabel}>Projeto vinculado:</label>
                        <Input
                            type="text"
                            placeholder="Nome do cliente ou projeto"
                            disabled={readOnly}
                            {...register('clientName')}
                        />
                    </div>
                )}

                <div className={styles.inputGroup}>
                    <label className={styles.fieldLabel}>Observação:</label>
                    <textarea
                        className={styles.textarea}
                        placeholder="Observação..."
                        disabled={readOnly}
                        {...register('description')}
                    />
                </div>
            </form>
        );
    }
);

ScheduleEventForm.displayName = 'ScheduleEventForm';

export default ScheduleEventForm;
