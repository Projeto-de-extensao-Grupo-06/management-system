import { faComment, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Table from '../../tables/Table';
import { IconButton } from '../../ui/Form';
import { ProjectStatus } from '../../../interfaces/enum/ProjectStatus';
import type { ProjectNotification } from '../../../interfaces/types/ProjectNotification';
import styles from '../../../pages/projects/ProjectNotifications.module.css';
import SecureComponent from '../../security/SecureComponent';

interface ProjectNotificationTableProps {
    notifications: ProjectNotification[];
    loading: boolean;
    onRowClick: (id: number) => void;
    onDismiss: (id: number) => void;
}

export default function ProjectNotificationTable({
    notifications,
    loading,
    onRowClick,
    onDismiss
}: ProjectNotificationTableProps) {
    const tableHeaders = ['Nome do Cliente', 'Fonte', 'Data', 'Status', 'Operação'];

    const getStatusLabel = (status: string) => {
        // TODO: Implementar o mapeador de status para gerar textos e tags (cores) padronizados direto do enum ProjectStatus
        switch (status) {
            case ProjectStatus.CLIENT_AWAITING_CONTACT:
                return 'Aguardando contato';
            case ProjectStatus.RETRYING:
                return 'Retentativa de Contato';
            default:
                return status;
        }
    };

    const getSourceLabel = (source: string) => {
        switch (source) {
            case 'WHATSAPP_BOT':
                return 'Chatbot';
            case 'SITE_BUDGET_FORM':
                return 'Site';
            default:
                return source;
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return `${date.toLocaleDateString('pt-BR')} ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
    };

    const handleContact = (phone: string) => {
        if (!phone) return;
        const formattedPhone = phone.replace(/\D/g, '');
        window.open(`https://wa.me/${formattedPhone}`, '_blank');
    };

    const hasData = Array.isArray(notifications) && notifications.length > 0;

    return (
        <Table
            headers={tableHeaders}
            isEmpty={!loading && !hasData}
            emptyMessage="Nenhuma notificação encontrada."
        >
            {loading ? (
                <tr>
                    <td colSpan={5} className={styles.emptyState}>Carregando...</td>
                </tr>
            ) : (
                hasData && notifications.map((notification) => (
                    <tr key={notification.projectId} onClick={() => onRowClick(notification.projectId)}>
                        <td>{notification.clientName}</td>
                        <td>{getSourceLabel(notification.projectFrom)}</td>
                        <td>{formatDate(notification.createdAt)}</td>
                        <td>{getStatusLabel(notification.status)}</td>
                        <td>
                            <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                                <IconButton
                                    icon={<FontAwesomeIcon icon={faComment} style={{ color: '#22c55e' }} />}
                                    onClick={() => handleContact(notification.clientPhone)}
                                    ariaLabel="Entrar em contato"
                                    title="Entrar em contato"
                                />
                                <SecureComponent permissions={["PROJECT_DELETE"]}>
                                    <IconButton
                                        icon={<FontAwesomeIcon icon={faTimes} />}
                                        onClick={() => onDismiss(notification.projectId)}
                                        ariaLabel="Dispensar"
                                        title="Dispensar"
                                        functionality="delete"
                                    />
                                </SecureComponent>
                            </div>
                        </td>
                    </tr>
                ))
            )}
        </Table>
    );
}
