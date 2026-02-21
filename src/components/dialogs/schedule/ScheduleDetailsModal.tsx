import {
    faTag,
    faClock,
    faCalendarDays,
    faNoteSticky,
    faPencil,
    faTrash
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from '../modal/Modal';
import { Button } from '../../ui/Form';
import type CalendarEvent from '../../../interfaces/types/CalendarEvent';
import styles from './ScheduleDetailsModal.module.css';

interface ScheduleDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    event: CalendarEvent | null;
    onEdit: () => void;
    onDelete: () => void;
}

const TYPE_LABELS: Record<string, string> = {
    TECHNICAL_VISIT: 'Visita Técnica',
    INSTALL_VISIT: 'Visita de Instalação',
    NOTE: 'Lembrete',
};

const STATUS_LABELS: Record<string, string> = {
    MARKED: 'Agendado',
    IN_PROGRESS: 'Em Progresso',
    FINISHED: 'Finalizado',
};

export default function ScheduleDetailsModal({
    isOpen,
    onClose,
    event,
    onEdit,
    onDelete,
}: ScheduleDetailsModalProps) {
    if (!event) return null;

    const type = event.extendedProps?.type ?? 'NOTE';
    const status = event.extendedProps?.status;
    const time = event.extendedProps?.time;
    const description = event.extendedProps?.description;
    const startDate = event.start;
    const endDate = event.end;

    const footer = (
        <div className={styles.footerRow}>
            <Button
                icon={<FontAwesomeIcon icon={faPencil} />}
                text="Editar"
                type="button"
                onClick={onEdit}
                width="fit-content"
            />
            <Button
                icon={<FontAwesomeIcon icon={faTrash} />}
                text="Excluir"
                type="button"
                onClick={onDelete}
                width="fit-content"
                style={{ backgroundColor: '#dc2626' }}
            />
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={event.title}
            footer={footer}
            maxWidth="400px"
        >
            <div className={styles.detailsContainer}>
                <div className={styles.detailRow}>
                    <span className={styles.detailIcon}>
                        <FontAwesomeIcon icon={faTag} />
                    </span>
                    <span>{TYPE_LABELS[type] ?? type}</span>
                </div>

                <div className={styles.detailRow}>
                    <span className={styles.detailIcon}>
                        <FontAwesomeIcon icon={faCalendarDays} />
                    </span>
                    <span>{startDate} {endDate ? `até ${endDate}` : ''}</span>
                </div>

                {status && (
                    <div className={styles.detailRow}>
                        <span className={styles.detailIcon}>
                            <FontAwesomeIcon icon={faClock} />
                        </span>
                        <span className={`${styles.statusBadge} ${styles[status.toLowerCase()]}`}>
                            {STATUS_LABELS[status] ?? status}
                        </span>
                    </div>
                )}

                {time && (
                    <div className={styles.detailRow}>
                        <span className={styles.detailIcon}>
                            <FontAwesomeIcon icon={faClock} />
                        </span>
                        <span>{time}</span>
                    </div>
                )}

                {description !== undefined && (
                    <div className={styles.detailGroup}>
                        <div className={styles.detailRow}>
                            <span className={styles.detailIcon}>
                                <FontAwesomeIcon icon={faNoteSticky} />
                            </span>
                            <span className={styles.detailLabel}>Descrição:</span>
                        </div>
                        <p className={styles.detailText}>{description || '—'}</p>
                    </div>
                )}
            </div>
        </Modal>
    );
}
