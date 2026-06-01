import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from "clsx";
import { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import { ProjectStatus } from '../../interfaces/enum/ProjectStatus';
import type { ActionRequiredProps } from '../../interfaces/properties/ActionRequiredProps';
import ClientsService from '../../services/ClientsService';
import ProjectService from '../../services/ProjectService';
import { getErrorMessage } from '../../utils/errorTranslator';
import styles from "./ActionRequired.module.css";
<<<<<<< Updated upstream
=======
import Swal from 'sweetalert2';
import { validateStatusTransition, translateBackendError } from '../../utils/projectStatusTransitions';
>>>>>>> Stashed changes

const clientService = new ClientsService();

export default function ActionRequired({ projectStatus, clientId, projectId, onActionComplete }: ActionRequiredProps) {
    const [clientName, setClientName] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [closed, setClosed] = useState(false);
    const projectService = useMemo(() => new ProjectService(), []);

    useEffect(() => {
        const fetchClient = async () => {
            const data = await clientService.getClientById(clientId);

            setClientName(data.firstName);
            setClientPhone(data.phone);
        }

        fetchClient();
    }, []);

    useEffect(() => {
        setClosed(false);
    }, [projectStatus, projectId]);

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
        // escolher status alvo dependendo do status atual
        const targetStatus = projectStatus === ProjectStatus.CLIENT_AWAITING_CONTACT
            ? ProjectStatus.AWAITING_RETRY
            : ProjectStatus.RETRYING;

        const validation = validateStatusTransition(projectStatus as any, targetStatus as any);

        if (validation.type === 'blocked') {
            Swal.fire({
                title: 'Transição não permitida',
                text: validation.message,
                icon: 'error',
                confirmButtonColor: 'var(--color-primary)'
            });
            return;
        }

        if (validation.type === 'warning') {
            const result = await Swal.fire({
                title: 'Atenção — pré-condição necessária',
                text: validation.message,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Tentar mesmo assim',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: 'var(--color-primary)',
                cancelButtonColor: '#6b7280'
            });

            if (!result.isConfirmed) return;
        }

        try {
            setLoading(true);
            await projectService.updateProject(projectId, {
<<<<<<< Updated upstream
                status: ProjectStatus.RETRYING
=======
                status: targetStatus as any
>>>>>>> Stashed changes
            });

            Swal.fire({
                title: 'Sucesso!',
                text: 'Ação adiada para mais tarde.',
                icon: 'success',
                confirmButtonColor: 'var(--color-primary)',
                customClass: { container: 'swal-above-modal' }
            });

            setClosed(true);
            onActionComplete?.();
        } catch (error: any) {
            console.error('Error deferring action:', error);
<<<<<<< Updated upstream
            const msg = getErrorMessage(error);
            Swal.fire({
                title: 'Erro!',
                text: msg,
=======

            const rawMessage = error?.response?.data?.message ?? '';

            Swal.fire({
                title: 'Não foi possível adiar',
                text: `${translateBackendError(rawMessage)}${rawMessage ? '\n\nDetalhe: ' + rawMessage : ''}${error?.message ? '\n\nErro: ' + error.message : ''}`,
>>>>>>> Stashed changes
                icon: 'error',
                confirmButtonColor: 'var(--color-primary)',
                customClass: { container: 'swal-above-modal' }
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
            cancelButtonText: 'Cancelar',
            customClass: { container: 'swal-above-modal' }
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
                        confirmButtonColor: 'var(--color-primary)',
                        customClass: { container: 'swal-above-modal' }
                    });
                    
                    setClosed(true);
                    onActionComplete?.();
                } catch (error) {
                    console.error('Error dismissing action:', error);
                    const msg = getErrorMessage(error);
                    Swal.fire({
                        title: 'Erro!',
                        text: msg,
                        icon: 'error',
                        confirmButtonColor: 'var(--color-primary)',
                        customClass: { container: 'swal-above-modal' }
                    });
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    if (closed) return null;

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
                            onClick={async () => { await handleContact(); await handleDismiss(); }}
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