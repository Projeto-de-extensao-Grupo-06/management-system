import { useState } from "react";
import styles from "../../../pages/projects/ProjectNotifications.module.css";
import { Button, Input, SimpleButton } from "../../ui/Form";
import Modal from "../modal/Modal";

interface ProjectNotificationFilterDialogProps {
    isOpen: boolean;
    onClose: () => void;
    startDate: string;
    endDate: string;
    onApply: (start: string, end: string) => void;
    onClear: () => void;
}

export default function ProjectNotificationFilterDialog({
    isOpen,
    onClose,
    startDate,
    endDate,
    onApply,
    onClear
}: ProjectNotificationFilterDialogProps) {
    const [localStartDate, setLocalStartDate] = useState(startDate);
    const [localEndDate, setLocalEndDate] = useState(endDate);

    const handleApply = () => {
        onApply(localStartDate, localEndDate);
        onClose();
    };

    const handleClear = () => {
        setLocalStartDate('');
        setLocalEndDate('');
        onClear();
        onClose();
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
            title="Filtrar por Período"
            footer={footer}
            maxWidth="500px"
        >
            <div className={styles.filterModalContainer}>
                <div className={styles.gridTwo}>
                    <div>
                        <label className={styles.filterLabel}>Data Inicial</label>
                        <Input
                            type="date"
                            value={localStartDate}
                            onChange={(e) => setLocalStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className={styles.filterLabel}>Data Final</label>
                        <Input
                            type="date"
                            value={localEndDate}
                            onChange={(e) => setLocalEndDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
}
