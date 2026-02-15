import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import FilterBar from '../../components/layout/FilterBar';
import PageHeader from '../../components/layout/PageHeader';
import { SearchInput, Select, SelectOption, SimpleButton } from '../../components/ui/Form';
import type { ProjectNotification } from '../../interfaces/types/ProjectNotification';
import ProjectsService from '../../services/ProjectsService';
import ProjectNotificationFilterDialog from '../../components/dialogs/projects/ProjectNotificationFilterDialog';
import ProjectNotificationTable from '../../components/tables/projects/ProjectNotificationTable';
import styles from './ProjectNotifications.module.css';

export default function ProjectNotifications() {
    const navigate = useNavigate();
    const [filteredNotifications, setFilteredNotifications] = useState<ProjectNotification[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Todos');

    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const projectsService = useMemo(() => new ProjectsService(), []);

    useEffect(() => {
        setLoading(true);

        const formattedStartDate = startDate ? `${startDate}T00:00:00` : undefined;
        const formattedEndDate = endDate ? `${endDate}T23:59:59` : undefined;

        projectsService.getProjectLeads(
            formattedStartDate,
            formattedEndDate,
            statusFilter,
            searchTerm
        )
            .then(data => {
                setFilteredNotifications(data);
            })
            .catch(error => console.error('Error fetching leads:', error))
            .finally(() => setLoading(false));
    }, [projectsService, statusFilter, searchTerm, startDate, endDate]);

    const handleRowClick = (id: number) => {
        navigate(`/projetos/${id}`);
    };

    const handleDismiss = async (id: number) => {
        if (!confirm('Tem certeza que deseja dispensar esta notificação? O projeto será arquivado.')) {
            return;
        }

        try {
            await projectsService.deleteProject(id);
            setFilteredNotifications(prev => prev.filter(n => n.projectId !== id));
        } catch (error) {
            console.error('Error dismissing notification:', error);
            alert('Erro ao dispensar notificação.');
        }
    };

    const handleApplyFilters = (start: string, end: string) => {
        setStartDate(start);
        setEndDate(end);
    };

    const handleClearFilters = () => {
        setStartDate('');
        setEndDate('');
    };

    return (
        <div className={styles.container}>
            <PageHeader title="Notificações" count={filteredNotifications.length} />

            <FilterBar>
                <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                    <SimpleButton
                        icon={<FontAwesomeIcon icon={faFilter} />}
                        text="Filtro"
                        ariaLabel="Filtrar por data"
                        onClick={() => setIsFilterModalOpen(true)}
                        style={{ border: 'none', background: 'transparent', padding: 0 }}
                    />
                    <div className={styles.dropdown}>
                        <Select value={statusFilter} onChange={setStatusFilter}>
                            <SelectOption value="Todos" label="Todos os status" />
                            <SelectOption value="CLIENT_AWAITING_CONTACT" label="Aguardando contato" />
                            <SelectOption value="RETRYING" label="Retentativa de Contato" />
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

            <ProjectNotificationFilterDialog
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                startDate={startDate}
                endDate={endDate}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
            />
        </div>
    );
}
