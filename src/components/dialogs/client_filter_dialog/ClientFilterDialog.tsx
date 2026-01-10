import { useState } from "react";
import styles from "../../../pages/clients/Clients.module.css";
import { Button, Input, SimpleButton } from "../../ui/Form";
import Modal from "../modal/Modal";

interface FilterState {
    startDate: string;
    endDate: string;
    city: string;
    state: string;
}

interface ClientFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: FilterState;
    onApply: (filters: FilterState) => void;
    onClear: () => void;
}

export default function ClientFilterModal({ isOpen, onClose, filters: initialFilters, onApply, onClear }: ClientFilterModalProps) {
    const [localFilters, setLocalFilters] = useState<FilterState>(initialFilters);



    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };

    const handleClear = () => {
        onClear();
        setLocalFilters({
            startDate: '',
            endDate: '',
            city: '',
            state: ''
        });
        onClose();
    };

    const handleChange = (field: keyof FilterState, value: string) => {
        setLocalFilters(prev => ({ ...prev, [field]: value }));
    };

    const footer = (
        <>
            <SimpleButton
                text="Limpar Filtros"
                ariaLabel="Limpar filtros"
                onClick={handleClear}
                width="fit-content"
            />
            <Button
                text="Aplicar Filtros"
                ariaLabel="Aplicar filtros"
                onClick={handleApply}
                width="fit-content"
            />
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Filtrar Clientes"
            footer={footer}
            maxWidth="500px"
        >
            <div className={styles.filterModalContainer}>
                <div>
                    <label className={styles.filterLabel}>Cidade</label>
                    <Input
                        placeholder="Digite a cidade"
                        value={localFilters.city}
                        onChange={(val: string) => handleChange('city', val)}
                    />
                </div>
                <div>
                    <label className={styles.filterLabel}>Estado (UF)</label>
                    <Input
                        placeholder="Ex: SP"
                        maxLength={2}
                        value={localFilters.state}
                        onChange={(val: string) => handleChange('state', val)}
                    />
                </div>
                <div>
                    <label className={styles.filterLabel}>Data de Cadastro (Início)</label>
                    <Input
                        type="date"
                        placeholder=""
                        value={localFilters.startDate}
                        onChange={(val: string) => handleChange('startDate', val)}
                    />
                </div>
                <div>
                    <label className={styles.filterLabel}>Data de Cadastro (Fim)</label>
                    <Input
                        type="date"
                        placeholder=""
                        value={localFilters.endDate}
                        onChange={(val: string) => handleChange('endDate', val)}
                    />
                </div>
            </div>
        </Modal>
    );
}
