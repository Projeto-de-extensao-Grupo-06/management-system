import { useFieldArray, useFormContext } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import type { BudgetParameterSchemaType } from '../../../../schemas/budgetParameterSchema';
import { Input, Select, SelectOption, SimpleButton, TextArea } from '../../../ui/Form';
import styles from '../BudgetParameters.module.css';

interface BudgetParameterFieldsProps {
    readOnly?: boolean;
}

export default function BudgetParameterFields({ readOnly }: BudgetParameterFieldsProps) {
    const {
        register,
        watch,
        setValue,
        formState: { errors },
    } = useFormContext<BudgetParameterSchemaType>();

    const { fields, append, remove } = useFieldArray({
        name: 'options',
    });

    const isPreBudget = watch('is_pre_budget');

    return (
        <>
            <div className={styles.fieldGroup}>
                <label className={styles.label}>Nome *</label>
                <Input
                    {...register('name')}
                    placeholder="Ex: Tipo de Telhado, Mão de Obra"
                    readOnly={readOnly}
                />
                {errors.name && <span className={styles.error}>{errors.name.message}</span>}
            </div>

            <div className={styles.fieldGroup}>
                <label className={styles.label}>Descrição</label>
                <TextArea
                    {...register('description')}
                    placeholder="Texto de ajuda para o parâmetro"
                    readOnly={readOnly}
                />
                {errors.description && <span className={styles.error}>{errors.description.message}</span>}
            </div>

            <div className={styles.fieldGroup}>
                <label className={styles.label}>Métrica *</label>
                <Input
                    {...register('metric')}
                    placeholder="Ex: %, R$/h, un"
                    readOnly={readOnly}
                />
                {errors.metric && <span className={styles.error}>{errors.metric.message}</span>}
            </div>

            <div className={styles.fieldGroup}>
                <label className={styles.label}>Valor Base *</label>
                <Input
                    {...register('fixed_value', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ex: 150.00"
                    readOnly={readOnly}
                />
                {errors.fixed_value && <span className={styles.error}>{errors.fixed_value.message}</span>}
            </div>

            <div className={styles.fieldGroup}>
                <label className={styles.label}>Status *</label>
                <Select
                    value={watch('status') ?? 'ATIVO'}
                    onChange={(val) => setValue('status', val as 'ATIVO' | 'INATIVO')}
                    disabled={readOnly}
                >
                    <SelectOption value="ATIVO" label="Ativo" />
                    <SelectOption value="INATIVO" label="Inativo" />
                </Select>
                {errors.status && <span className={styles.error}>{errors.status.message}</span>}
            </div>

            <div className={styles.fieldGroup}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        {...register('is_pre_budget')}
                        disabled={readOnly}
                        className={styles.checkbox}
                    />
                    Usar no Pré-orçamento (Bot)
                </label>
            </div>

            {isPreBudget && (
                <div className={styles.optionsSection}>
                    <div className={styles.optionsHeader}>
                        <h4 className={styles.optionsTitle}>Opções do Parâmetro</h4>
                        {!readOnly && (
                            <SimpleButton
                                icon={<FontAwesomeIcon icon={faPlus} />}
                                text="Adicionar Opção"
                                ariaLabel="Adicionar opção"
                                type="button"
                                onClick={() => append({ type: '', addition_tax: 0, fixed_cost: 0 })}
                            />
                        )}
                    </div>

                    {fields.length === 0 && (
                        <p className={styles.optionsEmpty}>
                            Nenhuma opção cadastrada. Clique em "Adicionar Opção" para começar.
                        </p>
                    )}

                    {fields.map((field, index) => (
                        <div key={field.id} className={styles.optionRow}>
                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Nome da Opção *</label>
                                <Input
                                    {...register(`options.${index}.type`)}
                                    placeholder="Ex: Cerâmico, Metálico"
                                    readOnly={readOnly}
                                />
                                {errors.options?.[index]?.type && (
                                    <span className={styles.error}>{errors.options[index].type?.message}</span>
                                )}
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Taxa de Adição (0 a 1)</label>
                                <Input
                                    {...register(`options.${index}.addition_tax`, { valueAsNumber: true })}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    placeholder="Ex: 0.08 para 8%"
                                    readOnly={readOnly}
                                />
                                {errors.options?.[index]?.addition_tax && (
                                    <span className={styles.error}>{errors.options[index].addition_tax?.message}</span>
                                )}
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Custo Fixo (R$)</label>
                                <Input
                                    {...register(`options.${index}.fixed_cost`, { valueAsNumber: true })}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="Ex: 500.00"
                                    readOnly={readOnly}
                                />
                                {errors.options?.[index]?.fixed_cost && (
                                    <span className={styles.error}>{errors.options[index].fixed_cost?.message}</span>
                                )}
                            </div>

                            {!readOnly && (
                                <button
                                    type="button"
                                    className={styles.removeOptionBtn}
                                    onClick={() => remove(index)}
                                    aria-label="Remover opção"
                                >
                                    <FontAwesomeIcon icon={faTrashCan} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}