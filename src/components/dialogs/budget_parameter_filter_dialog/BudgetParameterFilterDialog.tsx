import { useState } from 'react'
import type { BudgetParameterFilterModalProps, BudgetParameterFilterState } from '../../../interfaces/properties/DialogProps'
import styles from '../../../pages/budget_parameters/BudgetParameters.module.css'
import { Button, Select, SelectOption, SimpleButton } from '../../ui/Form'
import Modal from '../modal/Modal'

export default function BudgetParameterFilterModal({
    isOpen,
    onClose,
    filters: initialFilters,
    onApply, 
    onClear,
}: BudgetParameterFilterModalProps){
    const [localFilters, setLocalFilters] = useState<BudgetParameterFilterState>(initialFilters);

    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };

    const handleClear = () => {
        onClear();
        setLocalFilters({isPreBudget: 'Todos', status: 'Todos'});
        onClose();
    };

    const handleChange = (field: keyof BudgetParameterFilterState, value: string) => {
        setLocalFilters((prev) => ({...prev, [field]: value}));
    }

     const footer = (
        <>
            <SimpleButton
                text='Limpar Filtros'
                ariaLabel='Limpar filtros'
                onClick={handleClear}
                width='fit-content'
            />
            <Button
                text='Aplicar Filtros'
                ariaLabel='Aplicar filtros'
                onClick={handleApply}
                width='fit-content'
            />
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title='Filtrar Parâmetros'
            footer={footer}
            maxWidth='450px'
        >
            <div className={styles.filterModalContainer}>
                <div>
                    <label className={styles.filterLabel}>Tipo de Parâmetro</label>
                    <Select
                        value={localFilters.isPreBudget}
                        onChange={(value) => handleChange('isPreBudget', value)}
                    >
                        <SelectOption value='Todos' label='Todos' />
                        <SelectOption value='true' label='Pré-orçamento (Bot)' />
                        <SelectOption value='false' label='Custo Adicional (Manual)' />
                    </Select>
                </div>

                <div>
                    <label className={styles.filterLabel}>Status</label>
                    <Select
                        value={localFilters.status}
                        onChange={(value) => handleChange('status', value)}
                    >
                        <SelectOption value='Todos' label='Todos' />
                        <SelectOption value='ATIVO' label='Ativo' />
                        <SelectOption value='INATIVO' label='Inativo' />
                    </Select>
                </div>
            </div>
        </Modal>
    );


}