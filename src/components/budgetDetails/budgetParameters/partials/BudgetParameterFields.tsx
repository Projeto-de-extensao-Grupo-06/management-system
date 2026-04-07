import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFieldArray, useFormContext } from 'react-hook-form';
import type { BudgetParameterSchemaType } from '../../../../schemas/budgetParameterSchema';
import styles from '../../../forms/budget_parameter_form/BudgetParameterForm.module.css';
import { Button, Input, Select, SelectOption, TextArea } from '../../../ui/Form';

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

    const isPreBudget = watch('isPreBudget');

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
                <Select
                    value={watch('metric') ?? ''}
                    onChange={(val) => setValue('metric', val)}
                    disabled={readOnly}
                >
                    <SelectOption value="" label="Selecione uma métrica" />
                    <SelectOption value="%" label="% (Percentual)" />
                    <SelectOption value="R$" label="R$ (Valor fixo)" />
                    <SelectOption value="R$/h" label="R$/h (Valor por hora)" />
                    <SelectOption value="R$/m²" label="R$/m² (Valor por metro quadrado)" />
                    <SelectOption value="R$/kWp" label="R$/kWp (Valor por quilowatt-pico)" />
                    <SelectOption value="un" label="un (Unidade)" />
                    <SelectOption value="kWp" label="kWp (Quilowatt-pico)" />
                    <SelectOption value="kWh" label="kWh (Quilowatt-hora)" />
                    <SelectOption value="m²" label="m² (Metro quadrado)" />
                    <SelectOption value="km" label="km (Quilômetro)" />
                    <SelectOption value="h" label="h (Hora)" />
                    <SelectOption value="dia" label="dia (Diária)" />
                </Select>
                {errors.metric && <span className={styles.error}>{errors.metric.message}</span>}
            </div>

            <div className={styles.fieldGroup}>
                <label className={styles.label}>Valor Base *</label>
                <Input
                    {...register('fixedValue', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ex: 150.00"
                    readOnly={readOnly}
                    onKeyDown={(e) => {
                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                            e.preventDefault();
                        }
                    }}
                />
                {errors.fixedValue && <span className={styles.error}>{errors.fixedValue.message}</span>}
            </div>

            {/* <div className={styles.fieldGroup}>
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
            </div> */}

            <div className={styles.fieldGroup}>
                <div className={styles.checkboxRow}>
                    <input
                        type="checkbox"
                        id="isPreBudget"
                        {...register('isPreBudget')}
                        disabled={readOnly}
                        className={styles.checkbox}
                    />
                    <label htmlFor="isPreBudget" className={styles.checkboxLabel}>
                        Usar no Pré-orçamento
                    </label>
                </div>

                <span className={styles.checkboxHint}>
                    Se ativado, este parâmetro será utilizado pelo bot para cálculo automática.
                </span>
            </div>

            {isPreBudget && (
                <div className={styles.optionsSection}>
                    <div className={styles.optionsHeader}>
                        <h4 className={styles.optionsTitle}>Opções do Parâmetro</h4>
                        {!readOnly && (
                            <Button
                                icon={<FontAwesomeIcon icon={faPlus} />}
                                text="Adicionar Opção"
                                ariaLabel="Adicionar opção"
                                type="button"
                                onClick={() => append({ type: '', addition_tax: 0, fixed_cost: 0 })}
                                width="fit-content"
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
                                    {...register(`options.${index}.additionTax`, { valueAsNumber: true })}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    placeholder="Ex: 0.08 para 8%"
                                    readOnly={readOnly}
                                    onKeyDown={(e) => {
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                {errors.options?.[index]?.additionTax && (
                                    <span className={styles.error}>{errors.options[index].additionTax?.message}</span>
                                )}
                            </div>

                            <div className={styles.fieldGroup}>
                                <label className={styles.label}>Custo Fixo (R$)</label>
                                <Input
                                    {...register(`options.${index}.fixedCost`, { valueAsNumber: true })}
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="Ex: 500.00"
                                    readOnly={readOnly}
                                    onKeyDown={(e) => {
                                        if (e.key === 'e' || e.key === 'E' || e.key === '+' || e.key === '-') {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                {errors.options?.[index]?.fixedCost && (
                                    <span className={styles.error}>{errors.options[index].fixedCost?.message}</span>
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