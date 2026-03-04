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
import ProjectCard from '../../components/cards/ProjectCard';
import CreateProjectModal from '../../components/dialogs/projects/CreateProjectModal';
import FilterBar from '../../components/layout/FilterBar';
import PageLayout from '../../components/layout/PageLayout';
import { Pagination } from '../../components/tables/pagination/Pagination';
import { Alert } from '../../components/ui/Alert';
import { Button, SearchInput } from '../../components/ui/Form';

import { MultiSelect } from '../../components/ui/Form';
import KpiCard from '../../components/ui/KpiCard';
import usePermissions from "../../hooks/usePermissions";
import type Client from '../../interfaces/types/Client';
import type ProjectSummary from '../../interfaces/types/ProjectSummary';
import ClientsService from '../../services/ClientsService';
import ProjectsService from '../../services/ProjectsService';


import { projectStatusLabel } from '../../utils/mappers/projectStatusLabel';
import styles from '../clients/Clients.module.css';

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

  const [kpiData, setKpiData] = useState({
    upcomingDeadlines: 0,
    awaitingContact: 0,
    recentProjects: 0,
    stagnantProjects: 0
  });


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

    projectsService
      .getProjectKpis()
      .then(data => setKpiData(data))
      .catch(console.error);
  }, [projectsService]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const projectKpis = [
    {
      label: 'Próximos do Prazo',
      value: kpiData.upcomingDeadlines,
      icon: faClock,
    },
    {
      label: 'Projetos Estagnados',
      value: kpiData.stagnantProjects,
      icon: faTriangleExclamation,
    },
    {
      label: 'Cliente Aguardando Contato',
      value: kpiData.awaitingContact,
      icon: faPhone,
    },
    {
      label: 'Projetos Recentes',
      value: kpiData.recentProjects,
      icon: faPlus,
    },
  ];


  return (
    <PageLayout
      title="Projetos"
      titleAccessory={
        <>
          <span className={styles.count}>({projects.length})</span>
          <div
            className={Projectstyles.titleNotification}
            onClick={() => navigate('/projetos/notificacoes')}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginLeft: '1rem' }}
          >
            <FontAwesomeIcon icon={faBell as IconProp} />
            {notificationCount > 0 && (
              <span className={Projectstyles.notificationBadge}>
                {notificationCount}
              </span>
            )}
          </div>
        </>
      }
      rightActions={
        userPermissions.includes("PROJECT_WRITE") ? (
          <Button
            icon={<FontAwesomeIcon icon={faPlus} />}
            text="Novo Projeto"
            ariaLabel="Criar Projeto"
            onClick={() => setIsCreateModalOpen(true)}
            width="fit-content"
          />
        ) : undefined
      }
    >
      {globalAlert && (
        <div className={styles.alertWrapper}>
          <Alert message={globalAlert.message} type={globalAlert.type} />
        </div>
      )}

      <CreateProjectModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          fetchProjects();
          setIsCreateModalOpen(false);
        }}
      />
      <div className={Projectstyles.projectsSection}>
        <div className={Projectstyles.kpis}>
          {projectKpis.map((kpi, index) => (
            <KpiCard
              key={index}
              title={kpi.label}
              value={kpi.value}
              icon={kpi.icon}
            />
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
      </div>
    </PageLayout>

  );


}


