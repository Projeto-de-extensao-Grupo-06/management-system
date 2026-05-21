import { zodResolver } from '@hookform/resolvers/zod';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { ScheduleSchemaType } from '../../../schemas/scheduleSchema';
import { scheduleSchema, scheduleEditSchema } from '../../../schemas/scheduleSchema';
import ProjectsService from '../../../services/ProjectsService';
import { Select, SelectOption, Input, AutoCompleteSelect } from '../../ui/Form';
import type { AutoCompleteSelectOption } from '../../ui/Form';
import styles from './ScheduleEventForm.module.css';

export interface ScheduleFormRef {
    submit: () => void;
}

export interface ScheduleFormProps {
    onSubmit: (data: ScheduleSchemaType) => void;
    defaultValues?: Partial<ScheduleSchemaType>;
    readOnly?: boolean;
    mode?: 'create' | 'edit';
}

const projectsService = new ProjectsService();

const ScheduleEventForm = forwardRef<ScheduleFormRef, ScheduleFormProps>(
    ({ onSubmit, defaultValues, readOnly = false, mode = 'create' }, ref) => {
        const [projectOptions, setProjectOptions] = useState<AutoCompleteSelectOption[]>([]);

        const resolver = mode === 'edit' ? zodResolver(scheduleEditSchema) : zodResolver(scheduleSchema);

        const {
            register,
            handleSubmit,
            reset,
            setValue,
            watch,
            control,
            formState: { errors },
        } = useForm<ScheduleSchemaType>({
            resolver,
            defaultValues: {
                type: 'TECHNICAL_VISIT',
                start: '',
                endDate: '',
                time: '',
                projectId: null,
                description: '',
                ...defaultValues,
            },
        });

        useEffect(() => {
            const fetchProjects = async () => {
                try {
                    const data = await projectsService.getAllProjects(0, 100);
                    const options = data.content.map(p => ({
                        value: String(p.id),
                        label: `${p.projectTitle} - ${p.client.firstName} ${p.client.lastName}`
                    }));
                    setProjectOptions(options);
                } catch (err) {
                    console.error("Erro ao buscar projetos:", err);
                }
            };
            fetchProjects();
        }, []);

        useEffect(() => {
            if (defaultValues) {
                reset({
                    type: 'TECHNICAL_VISIT',
                    title: '',
                    start: '',
                    endDate: '',
                    time: '',
                    projectId: null,
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
                        Tipo de Agenda:<span className={styles.required}>*</span>
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
                        Título:<span className={styles.required}>*</span>
                    </label>
                    <Input
                        type="text"
                        placeholder="Ex: Visita na casa do João"
                        disabled={readOnly}
                        className={errors.title ? styles.inputError : ''}
                        {...register('title')}
                    />
                    {errors.title && <span className={styles.errorMessage}>{errors.title.message}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.fieldLabel}>
                        Data de início:<span className={styles.required}>*</span>
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
                    <label className={styles.fieldLabel}>Data de término:</label>
                    <Input
                        type="date"
                        disabled={readOnly}
                        className={errors.endDate ? styles.inputError : ''}
                        {...register('endDate')}
                    />
                    {errors.endDate && <span className={styles.errorMessage}>{errors.endDate.message}</span>}
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

                <div className={styles.inputGroup}>
                    <label className={styles.fieldLabel}>
                        Projeto vinculado:
                        {typeValue !== 'NOTE' && <span className={styles.required}>*</span>}
                    </label>
                    {readOnly ? (
                        <div className={styles.readOnlyField}>
                            {projectOptions.find(o => o.value === String(watch('projectId')))?.label ?? '—'}
                        </div>
                    ) : (
                        <Controller
                            name="projectId"
                            control={control}
                            render={({ field }) => (
                                <AutoCompleteSelect
                                    options={projectOptions}
                                    value={projectOptions.find(o => o.value === String(field.value)) ?? null}
                                    onChange={(option) => field.onChange(option ? Number(option.value) : null)}
                                    placeholder="Selecione um projeto..."
                                    isDisabled={readOnly}
                                />
                            )}
                        />
                    )}
                    {errors.projectId && <span className={styles.errorMessage}>{errors.projectId.message}</span>}
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.fieldLabel}>Descrição:</label>
                    <textarea
                        className={styles.textarea}
                        placeholder="Descrição do evento..."
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
