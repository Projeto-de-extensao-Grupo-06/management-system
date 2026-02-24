import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBell } from '@fortawesome/free-regular-svg-icons'
import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  faClock,
  faTriangleExclamation,
  faPhone,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useNavigate } from 'react-router';
import FilterBar from '../../components/layout/FilterBar';
import PageHeader from '../../components/layout/PageHeader';
import { Pagination } from '../../components/tables/pagination/Pagination';
import { Alert } from '../../components/ui/Alert';
import { Button, SearchInput } from '../../components/ui/Form';

import { MultiSelect } from '../../components/ui/Form';
import usePermissions from "../../hooks/usePermissions";
import type Client from '../../interfaces/types/Client';
import type ProjectSummary from '../../interfaces/types/ProjectSummary';
import ClientsService from '../../services/ClientsService';
import ProjectsService from '../../services/ProjectsService';


import { projectStatusLabel } from '../../utils/mappers/projectStatusLabel';
// import {CreateProjectModal } from '../projects/components/CreateProjectModal';

import styles from '../clients/Clients.module.css';
import CreateProjectModal from '../projects/components/CreateProjectModal'
import ProjectCard from '../projects/components/ProjectCard';
import Projectstyles from '../projects/Projects.module.css';

export default function Projects() {
  const projectsService = useMemo(() => new ProjectsService(), []);
  const clientsService = useMemo(() => new ClientsService(), []);


  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [clients, setClients] = useState<Client[]>([]);


  const [searchTerm, setSearchTerm] = useState('');
  // const [statusFilter, setStatusFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [clientId, setClientId] = useState<string>('');


  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const userPermissions = usePermissions();
  const [notificationCount, setNotificationCount] = useState(0);
  const navigate = useNavigate();


  const [globalAlert, setGlobalAlert] =
    useState<{ message: string; type: 'success' | 'error' } | null>(null);


  const fetchProjects = useCallback(() => {
    projectsService.getAllProjects(
      page,
      20,
      searchTerm,
      statusFilter ? statusFilter.split(',') : [],
      clientId ? Number(clientId) : undefined
    )
      .then(async data => {
        const baseProjects = data?.content ?? [];

        const enrichedProjects = await Promise.all(
          baseProjects.map(async (project) => {
            try {
              const [comments, files] = await Promise.all([
                projectsService.getProjectComments(project.id),
                projectsService.getProjectFiles(project.id)
              ]);

              return {
                ...project,
                commentCount: comments.length,
                fileCount: files.length
              };
            } catch {
              return {
                ...project,
                commentCount: 0,
                fileCount: 0
              };
            }
          })
        );

        setProjects(enrichedProjects);
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

  useEffect(() => {
    projectsService
      .getProjectLeads(undefined, undefined, 'Todos', '')
      .then(data => {
        setNotificationCount(data.length);
      })
      .catch(() => {
        setNotificationCount(0);
      });
  }, [projectsService]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const waitingContactCount = useMemo(() => {
    return projects.filter(
      project => project.status === 'CLIENT_AWAITING_CONTACT'
    ).length;
  }, [projects]);

  const nearDeadlineCount = useMemo(() => {
    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    return projects.filter(project => {
      if (!project.deadline) return false;

      const deadlineDate = new Date(project.deadline);

      return (
        deadlineDate >= today &&
        deadlineDate <= sevenDaysLater &&
        project.status !== 'COMPLETED' &&
        project.status !== 'NEGOTIATION_FAILED'
      );
    }).length;
  }, [projects]);

  const recentProjectsCount = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return projects.filter(project => {
      if (!project.createdAt) return false;

      const createdDate = new Date(project.createdAt);
      return createdDate >= sevenDaysAgo;
    }).length;
  }, [projects]);


  const projectKpis = [
    {
      label: 'Próximos do Prazo',
      value: nearDeadlineCount,
      icon: faClock,
    },
    {
      label: 'Projetos Estagnados',
      value: 7,
      icon: faTriangleExclamation,
    },
    {
      label: 'Cliente Aguardando Contato',
      value: waitingContactCount,
      icon: faPhone,
    },
    {
      label: 'Projetos Recentes',
      value: recentProjectsCount,
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

      <PageHeader
        title="Projetos"
        count={projects.length}
        titleRight={
          <div
            className={Projectstyles.titleNotification}
            onClick={() => navigate('/projetos/notificacoes')}
            style={{ cursor: 'pointer' }}
          >
            <FontAwesomeIcon icon={faBell as IconProp} />
            {notificationCount > 0 && (
              <span className={Projectstyles.notificationBadge}>
                {notificationCount}
              </span>
            )}
          </div>
        }
      >
        <div className={Projectstyles.headerActions}>
          {userPermissions.includes("PROJECT_WRITE") && (
            <Button
              icon={<FontAwesomeIcon icon={faPlus} />}
              text="Novo Projeto"
              ariaLabel="Criar Projeto"
              onClick={() => setIsCreateModalOpen(true)}
              width="fit-content"
            />
          )}

        </div>

        <CreateProjectModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            fetchProjects();
            setIsCreateModalOpen(false);
          }}
        />
      </PageHeader>



      <div className={Projectstyles.kpis}>
        {projectKpis.map((kpi, index) => (
          <div key={index} className={Projectstyles.kpi_container}>
            <div className={Projectstyles.kpi_content}>
              <div className={Projectstyles.kpi_icon}>
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

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <FontAwesomeIcon icon={faFilter} />
            <span>Filtros</span>
          </div>

          <div style={{ width: "250px" }}>
            <MultiSelect
              styles={{
                multiValueLabel: (base) => ({
                  ...base,
                  overflow: "visible",
                  textOverflow: "unset",
                  whiteSpace: "normal",
                }),
                valueContainer: (base) => ({
                  ...base,
                  flexWrap: "wrap",
                }),
              }}
              value={
                statusFilter
                  ? statusFilter.split(',').map(s => ({
                    value: s,
                    label: projectStatusLabel[s],
                  }))
                  : []
              }
              onChange={(newValue) => {
                const selectedValues = newValue.map(v => v.value).join(',');
                setStatusFilter(selectedValues);
                setPage(0);
              }}
              options={Object.entries(projectStatusLabel).map(([status, label]) => ({
                value: status,
                label: label,
              }))}
              placeholder="Todos os status"
            />
          </div>
          <div style={{ width: "250px" }}>
            <MultiSelect
              styles={{
                multiValueLabel: (base) => ({
                  ...base,
                  overflow: "visible",
                  textOverflow: "unset",
                  whiteSpace: "normal",
                }),
                valueContainer: (base) => ({
                  ...base,
                  flexWrap: "wrap",
                }),
              }}
              value={
                clientId
                  ? [{
                    value: clientId,
                    label: (() => {
                      const client = clients.find(
                        c => c.id.toString() === clientId
                      );
                      return client
                        ? `${client.firstName} ${client.lastName}`
                        : '';
                    })()
                  }]
                  : []
              }
              onChange={(newValue) => {
                const lastSelected =
                  newValue.length > 0
                    ? newValue[newValue.length - 1].value
                    : '';

                setClientId(lastSelected);
                setPage(0);
              }}
              options={[
                { value: '', label: 'Todos os clientes' },
                ...clients.map(client => ({
                  value: client.id.toString(),
                  label: `${client.firstName} ${client.lastName}`,
                }))
              ]}
              placeholder="Todos os clientes"
            />
          </div>

          <div className={styles.searchBox}>
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar por título do projeto"
            />
          </div>
        </div>
      </FilterBar >

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
    </div >

  );


}


