import { useRef } from 'react';
import { faSave, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from "../modal/Modal";
import { Button } from "../../ui/Form";
import ScheduleEventForm from "../../forms/schedule_form/ScheduleEventForm";
import type { ScheduleFormRef } from "../../forms/schedule_form/ScheduleEventForm";
import type { ScheduleSchemaType } from '../../../schemas/scheduleSchema';

interface ScheduleFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ScheduleSchemaType) => void;
    onDelete?: () => void;
    defaultValues?: Partial<ScheduleSchemaType>;
    mode: 'create' | 'edit';
}

export default function ScheduleFormModal({
    isOpen,
    onClose,
    onSubmit,
    onDelete,
    defaultValues,
    mode,
}: ScheduleFormModalProps) {
    const formRef = useRef<ScheduleFormRef>(null);

    const handleSubmitClick = () => {
        formRef.current?.submit();
    };

    const footer = (
        <div style={{ display: 'flex', gap: '0.75rem', width: '100%', justifyContent: 'flex-end' }}>
            {mode === 'edit' && onDelete && (
                <Button
                    icon={<FontAwesomeIcon icon={faTrash} />}
                    text="Excluir"
                    type="button"
                    onClick={onDelete}
                    width="fit-content"
                    style={{ backgroundColor: '#dc2626' }}
                />
            )}
            <Button
                icon={<FontAwesomeIcon icon={mode === 'create' ? faPlus : faSave} />}
                text={mode === 'create' ? 'Criar' : 'Salvar'}
                type="button"
                onClick={handleSubmitClick}
                width="fit-content"
            />
        </div>
    );

    const title = mode === 'create' ? 'Criar Agenda' : 'Editar Agenda';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={footer}
            maxWidth="480px"
        >
            <ScheduleEventForm
                ref={formRef}
                onSubmit={onSubmit}
                defaultValues={defaultValues}
            />
        </Modal>
    );
}
