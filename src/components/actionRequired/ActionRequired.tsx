import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from "clsx";
import { useEffect, useMemo, useState } from 'react';
import type { ActionRequiredProps } from '../../interfaces/properties/ActionRequiredProps';
import { ProjectStatus } from '../../interfaces/enum/ProjectStatus';
import ClientsService from '../../services/ClientsService';
import ProjectService from '../../services/ProjectService';
import styles from "./ActionRequired.module.css";
import Swal from 'sweetalert2';

const clientService = new ClientsService();

export default function ActionRequired({ projectStatus, clientId, projectId, onActionComplete }: ActionRequiredProps) {
    const [clientName, setClientName] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const projectService = useMemo(() => new ProjectService(), []);

    useEffect(() => {
        const fetchClient = async () => {
            const data = await clientService.getClientById(clientId);

            setClientName(data.firstName);
            setClientPhone(data.phone);
        }

        fetchClient();
    }, []);

    const message = (() => {
        if (projectStatus === "CLIENT_AWAITING_CONTACT") {
            return `${clientName} está aguardando seu contato.`;
        }

        if (projectStatus === "RETRYING") {
            return `Seu ultimo contato com ${clientName} não obteve sucesso na negociação. Deseja tentar novamente?`;
        }

        return null;
    })();

    const handleContact = async () => {
        if (!clientPhone) return;
        const digits = clientPhone.replace(/\D/g, "");
        const normalizedPhone = digits.startsWith("55") ? digits : `55${digits}`;
        window.open(`https://wa.me/${normalizedPhone}`, '_blank');
    };

    const handleLater = async () => {
        try {
            setLoading(true);
            await projectService.updateProject(projectId, {
                status: ProjectStatus.RETRYING
            });
            
            Swal.fire({
                title: 'Sucesso!',
                text: 'Ação adiada para mais tarde.',
                icon: 'success',
                confirmButtonColor: 'var(--color-primary)'
            });
            
            onActionComplete?.();
        } catch (error) {
            console.error('Error deferring action:', error);
            Swal.fire({
                title: 'Erro!',
                text: 'Erro ao adiar ação.',
                icon: 'error',
                confirmButtonColor: 'var(--color-primary)'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDismiss = async () => {
        Swal.fire({
            title: 'Confirmar Dispensa',
            text: 'Tem certeza que deseja dispensar esta ação?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#ccc',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setLoading(true);
                    await projectService.updateProject(projectId, {
                        status: ProjectStatus.NEGOTIATION_FAILED
                    });
                    
                    Swal.fire({
                        title: 'Dispensado!',
                        text: 'Ação dispensada com sucesso.',
                        icon: 'success',
                        confirmButtonColor: 'var(--color-primary)'
                    });
                    
                    onActionComplete?.();
                } catch (error) {
                    console.error('Error dismissing action:', error);
                    Swal.fire({
                        title: 'Erro!',
                        text: 'Erro ao dispensar ação.',
                        icon: 'error',
                        confirmButtonColor: 'var(--color-primary)'
                    });
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    if (message) {
        return (
            <div className={styles.content}>
                <div className={styles.container}>
                    <div className={styles.warningContent}>
                        <FontAwesomeIcon icon={faWarning} color='#DD7428' size='xl'></FontAwesomeIcon>
                        <div className={styles.messageContent}>
                            <h4>Ação necessária</h4>
                            <p>{message}</p>
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button 
                            className={clsx(styles.actionButton, styles.contactButton)}
                            onClick={handleContact}
                        >
                            Contatar
                        </button>
                        <button 
                            className={clsx(styles.actionButton, styles.laterButton)}
                            onClick={handleLater}
                            disabled={loading}
                        >
                            {loading ? 'Carregando...' : 'Mais tarde'}
                        </button>
                        <button 
                            className={clsx(styles.actionButton, styles.ignoreButton)}
                            onClick={handleDismiss}
                            disabled={loading}
                        >
                            {loading ? 'Carregando...' : 'Dispensar'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}