import styles from "../../../pages/clients/Clients.module.css";
import { Button, Input, SimpleButton } from "../../ui/Form";
import Modal from "../modal/Modal";

interface ClientFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    filters: {
        startDate: string;
        endDate: string;
        city: string;
        state: string;
    };
    setFilters: React.Dispatch<React.SetStateAction<{
        startDate: string;
        endDate: string;
        city: string;
        state: string;
    }>>;
    onClear: () => void;
}

export default function ClientFilterModal({ isOpen, onClose, filters, setFilters, onClear }: ClientFilterModalProps) {
    const handleApply = () => {
        onClose();
    };

    const footer = (
        <>
            <SimpleButton
                text="Limpar Filtros"
                ariaLabel="Limpar filtros"
                onClick={onClear}
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
                        value={filters.city}
                        onChange={(val: string) => setFilters(prev => ({ ...prev, city: val }))}
                    />
                </div>
                <div>
                    <label className={styles.filterLabel}>Estado (UF)</label>
                    <Input
                        placeholder="Ex: SP"
                        maxLength={2}
                        value={filters.state}
                        onChange={(val: string) => setFilters(prev => ({ ...prev, state: val }))}
                    />
                </div>
                <div>
                    <label className={styles.filterLabel}>Data de Cadastro (Início)</label>
                    <Input
                        type="date"
                        placeholder=""
                        value={filters.startDate}
                        onChange={(val: string) => setFilters(prev => ({ ...prev, startDate: val }))}
                    />
                </div>
                <div>
                    <label className={styles.filterLabel}>Data de Cadastro (Fim)</label>
                    <Input
                        type="date"
                        placeholder=""
                        value={filters.endDate}
                        onChange={(val: string) => setFilters(prev => ({ ...prev, endDate: val }))}
                    />
                </div>
            </div>
        </Modal>
    );
}
