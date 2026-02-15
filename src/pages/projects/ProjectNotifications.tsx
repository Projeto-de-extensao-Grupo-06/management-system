import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import FilterBar from '../../components/layout/FilterBar';
import PageHeader from '../../components/layout/PageHeader';
import { SearchInput, Select, SelectOption } from '../../components/ui/Form';
import type { ProjectNotification } from '../../interfaces/types/ProjectNotification';
import ProjectsService from '../../services/ProjectsService';
import ProjectNotificationTable from '../../components/tables/projects/ProjectNotificationTable';
import styles from './ProjectNotifications.module.css';

export default function ProjectNotifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<ProjectNotification[]>([]);
    const [filteredNotifications, setFilteredNotifications] = useState<ProjectNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');

    const projectsService = useMemo(() => new ProjectsService(), []);

    useEffect(() => {
        setLoading(true);
        projectsService.getProjectLeads()
            .then(data => {
                setNotifications(data);
                setFilteredNotifications(data);
            })
            .catch(error => console.error('Error fetching leads:', error))
            .finally(() => setLoading(false));
    }, [projectsService]);

    useEffect(() => {
        let result = notifications;

        if (statusFilter !== 'Todos') {
            result = result.filter(n => n.status === statusFilter);
        }

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(n =>
                n.clientName.toLowerCase().includes(lowerTerm)
            );
        }

        setFilteredNotifications(result);
    }, [notifications, statusFilter, searchTerm]);

    const handleRowClick = (id: number) => {
        navigate(`/projetos/${id}`);
    };

    const handleDismiss = async (id: number) => {
        if (!confirm('Tem certeza que deseja dispensar esta notificação? O projeto será arquivado.')) {
            return;
        }

        try {
            await projectsService.deleteProject(id);
            setNotifications(prev => prev.filter(n => n.projectId !== id));
        } catch (error) {
            console.error('Error dismissing notification:', error);
            alert('Erro ao dispensar notificação.');
        }
    };

    return (
        <div className={styles.container}>
            <PageHeader title="Notificações" count={filteredNotifications.length} />

            <FilterBar>
                <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                    <div className={styles.dropdown}>
                        <Select value={statusFilter} onChange={setStatusFilter}>
                            <SelectOption value="Todos" label="Todos os status" />
                            <SelectOption value="CLIENT_AWAITING_CONTACT" label="Aguardando contato" />
                            <SelectOption value="CONTACT_NOT_REQUESTED" label="Contato não solicitado" />
                        </Select>
                    </div>

                    <div className={styles.searchBox}>
                        <SearchInput
                            value={searchTerm}
                            onChange={setSearchTerm}
                            placeholder="Buscar Cliente"
                        />
                    </div>
                </div>
            </FilterBar>

            <ProjectNotificationTable
                notifications={filteredNotifications}
                loading={loading}
                onRowClick={handleRowClick}
                onDismiss={handleDismiss}
            />
        </div>
    );
}
