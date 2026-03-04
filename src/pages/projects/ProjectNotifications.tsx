import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import ProjectNotificationFilterDialog from '../../components/dialogs/projects/ProjectNotificationFilterDialog';
import FilterBar from '../../components/layout/FilterBar';
import PageLayout from '../../components/layout/PageLayout';
import ProjectNotificationTable from '../../components/tables/projects/ProjectNotificationTable';
import { SearchInput, Select, SelectOption, SimpleButton } from '../../components/ui/Form';
import type { ProjectNotification } from '../../interfaces/types/ProjectNotification';
import ProjectsService from '../../services/ProjectsService';
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
        const fetchNotifications = async () => {
            setLoading(true);
            const formattedStartDate = startDate ? `${startDate}T00:00:00` : undefined;
            const formattedEndDate = endDate ? `${endDate}T23:59:59` : undefined;

            try {
                const data = await projectsService.getProjectLeads(
                    formattedStartDate,
                    formattedEndDate,
                    statusFilter,
                    searchTerm
                );
                setFilteredNotifications(data);
            } catch (error) {
                console.error('Error fetching leads:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [projectsService, statusFilter, searchTerm, startDate, endDate]);

    const handleRowClick = (id: number) => {
        navigate(`/projetos/${id}`);
    };

    const handleDismiss = (id: number) => {
        Swal.fire({
            title: 'Confirmar Exclusão',
            text: 'Tem certeza que deseja dispensar esta notificação? O projeto será arquivado.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#ccc',
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                projectsService.deleteProject(id)
                    .then(() => {
                        setFilteredNotifications(prev => prev.filter(n => n.projectId !== id));
                        Swal.fire({
                            title: 'Arquivado!',
                            text: 'A notificação foi dispensada com sucesso.',
                            icon: 'success',
                            confirmButtonColor: 'var(--color-primary)'
                        });
                    })
                    .catch((error) => {
                        console.error('Error dismissing notification:', error);
                        Swal.fire({
                            title: 'Erro!',
                            text: 'Erro ao dispensar operação.',
                            icon: 'error',
                            confirmButtonColor: 'var(--color-primary)'
                        });
                    });
            }
        });
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
        <PageLayout
            title="Notificações"
            titleAccessory={<span className={styles.count}>({filteredNotifications.length})</span>}
            backButton={true}
        >

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
        </PageLayout>
    );
}
