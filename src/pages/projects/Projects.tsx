import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useMemo, useState } from 'react';

import PageHeader from '../../components/layout/PageHeader';
import FilterBar from '../../components/layout/FilterBar';
import { Button, SearchInput, Select, SelectOption, SimpleButton } from '../../components/ui/Form';
import { Pagination } from '../../components/tables/pagination/Pagination';
import { Alert } from '../../components/ui/Alert';

import ProjectsService from '../../services/ProjectsService';
import ClientsService from '../../services/ClientsService';

import type ProjectSummary from '../../interfaces/types/ProjectSummary';
import type Client from '../../interfaces/types/Client';

import { projectStatusLabel } from '../../utils/mappers/projectStatusLabel';
// import {CreateProjectModal } from '../projects/components/CreateProjectModal';
import CreateProjectModal from '../projects/components/CreateProjectModal'
import styles from '../clients/Clients.module.css';
import kpistyles from '../analysis/Analysis.module.css';
import Projectstyles from '../projects/Projects.module.css';
import ProjectStatusBadge from '../projects/components/ProjectStatusBadge';
import ProjectCard from '../projects/components/ProjectCard';

import {
  faClock,
  faTriangleExclamation, 
  faPhone,               
} from '@fortawesome/free-solid-svg-icons';


export default function Projects() {
  const projectsService = useMemo(() => new ProjectsService(), []);
  const clientsService = useMemo(() => new ClientsService(), []);

 
const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [clients, setClients] = useState<Client[]>([]);


  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(''); 
  const [clientId, setClientId] = useState<string>('');         


  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);


  const [globalAlert, setGlobalAlert] =
    useState<{ message: string; type: 'success' | 'error' } | null>(null);

 
  const fetchProjects = useCallback(() => {
    projectsService.getAllProjects(
      page,
      20,
      searchTerm,
      statusFilter ? [statusFilter] : [],   
      clientId ? Number(clientId) : undefined      
    )
      .then(data => {
  setProjects(data?.content ?? []);
  setTotalPages(data?.totalPages ?? 0);
})
   .catch(() => {
        setGlobalAlert({
          message: 'Erro ao carregar projetos.',
          type: 'error',
        });
      });
  }, [projectsService, page, searchTerm, statusFilter, clientId]);


  useEffect(() => {
    clientsService
      .getAllClients(0, 1000)
      .then(res => setClients(res.content))
      .catch(() => {
        setGlobalAlert({
          message: 'Erro ao carregar clientes.',
          type: 'error',
        });
      });
  }, [clientsService]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);


const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

const projectKpis = [
  {
    label: 'Próximos do Prazo',
    value: 3,
    icon: faClock,
  },
  {
    label: 'Projetos Estagnados',
    value: 7,
    icon: faTriangleExclamation, 
  },
  {
    label: 'Cliente Aguardando Contato',
    value: 5,
    icon: faPhone, 
  },
  {
    label: 'Projetos Recentes',
    value: 12,
    icon: faPlus, 
  },
];


  return (
    <div className={Projectstyles.container}>
      {globalAlert && (
        <div className={styles.alertWrapper}>
          <Alert message={globalAlert.message} type={globalAlert.type} />
        </div>
      )}


      <PageHeader title="Projetos" count={projects.length}>
    <Button
  icon={<FontAwesomeIcon icon={faPlus} />}
  text="Novo Projeto"
  ariaLabel="Criar Projeto"
  onClick={() => setIsCreateModalOpen(true)}
  width="fit-content"
      />
<CreateProjectModal
  open={isCreateModalOpen}
  onClose={() => setIsCreateModalOpen(false)}
   onSuccess={() => {
    fetchProjects();        
    setIsCreateModalOpen(false); 
  }}
/>

      </PageHeader>


<div className={kpistyles.kpis}>
  {projectKpis.map((kpi, index) => (
    <div key={index} className={kpistyles.kpi_container}>
      <div className={kpistyles.kpi_content}>
        <div className={kpistyles.kpi_icon}>
          <FontAwesomeIcon icon={kpi.icon} color="#fff" />
        </div>
        <b>{kpi.label}</b>
      </div>
      <p className={styles.kpi_value}>{kpi.value}</p>
    </div>
  ))}
</div>

      <FilterBar>
        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
          <SimpleButton
            icon={<FontAwesomeIcon icon={faFilter} />}
            text="Filtros"
            ariaLabel="Filtros"
            onClick={() => {}}
          />

        <Select
  value={statusFilter}
  onChange={setStatusFilter}
>
  <SelectOption value="" label="Todos os status" />

  {Object.entries(projectStatusLabel).map(([status, label]) => (
    <SelectOption
      key={status}
      value={status}
      label={label}
    />
  ))}
</Select>
          <Select
            value={clientId}
            onChange={setClientId}
          >
            <SelectOption value="" label="Todos os clientes" />

            {clients.map(client => (
              <SelectOption
                key={client.id}
                value={client.id.toString()}
                label={`${client.firstName} ${client.lastName}`}
              />
            ))}
          </Select>

    
          <div className={styles.searchBox}>
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por título do projeto"
            />
          </div>
        </div>
      </FilterBar>

 <div className={Projectstyles.projectsGrid}>
  {projects.map(project => (
    <ProjectCard
      key={project.id}
      project={project}
    />
  ))}
</div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
    
  );

  
}


