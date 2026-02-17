import { useEffect, useMemo, useState } from 'react';
import styles from '../Projects.module.css';

import { Button, Input } from '../../../components/ui/Form';

import ClientsService from '../../../services/ClientsService';
import ProjectsService from '../../../services/ProjectsService';

import type Client from '../../../interfaces/types/Client';

import { ProjectStatus } from '../../../interfaces/enum/ProjectStatus';
import type { ProjectStatusType } from '../../../interfaces/enum/ProjectStatus';
import { projectStatusLabel } from '../../../utils/mappers/projectStatusLabel';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateProjectModal({ open, onClose, onSuccess }: Props) {

  const clientsService = useMemo(() => new ClientsService(), []);
  const projectsService = useMemo(() => new ProjectsService(), []);

  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] =
    useState<'ON_GRID' | 'OFF_GRID' | null>(null);



  const [status, setStatus] =
    useState<ProjectStatusType>(ProjectStatus.NEW);

  const [clientSearch, setClientSearch] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState<number | null>(null);

  const [responsibleSearch, setResponsibleSearch] = useState('');
  const [responsibles, setResponsibles] = useState<any[]>([]);
  const [responsibleId, setResponsibleId] = useState<number | null>(null);

  const [addressSearch, setAddressSearch] = useState('');
  const [addressId, setAddressId] = useState<number | null>(null);


  useEffect(() => {
    if (clientSearch.length < 2) {
      setClients([]);
      return;
    }

    const delay = setTimeout(() => {
      clientsService
        .getAllClients(0, 10, clientSearch)
        .then(res => setClients(res.content))
        .catch(() => setClients([]));
    }, 300);

    return () => clearTimeout(delay);

  }, [clientSearch, clientsService]);


  useEffect(() => {
    if (responsibleSearch.length < 2) {
      setResponsibles([]);
      return;
    }

    const delay = setTimeout(() => {
      projectsService
        .getAllCoworkers(0, 100) // pega lista maior
        .then((res: any[]) => {
          const filtered = res.filter((coworker) =>
            `${coworker.firstName} ${coworker.lastName}`
              .toLowerCase()
              .includes(responsibleSearch.toLowerCase())
          );

          setResponsibles(filtered);
        })
        .catch(() => setResponsibles([]));
    }, 300);

    return () => clearTimeout(delay);

  }, [responsibleSearch, projectsService]);

  const handleCreateProject = async () => {
   if (!projectName || !clientId || !projectType) return;

  const payload = {
  name: projectName,
  description: "",
  projectType: projectType as 'ON_GRID' | 'OFF_GRID',
  status,
  clientId,
  responsibleId: responsibleId ?? undefined,
  addressId: addressId ?? 1,
};


    try {
      await projectsService.createManualProject(payload);
      if (onSuccess) {
        onSuccess();
      }
    } catch (e: any) {
      console.error('Erro ao criar projeto', e.response?.data || e);
    }
  };


  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>

        <div className={styles.modalHeader}>
          <h2>Criar Projeto</h2>

          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className={styles.modalBody}>

          {/* Nome */}
          <div className={styles.field}>
            <label>Nome do projeto</label>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Digite o nome do projeto"
            />
          </div>

          {/* Tipo */}
          <div className={styles.field}>
            <label>Tipo de instalação</label>
            <select
              className={styles.input}
              value={projectType ?? ""}
              onChange={(e) =>
                setProjectType(
                  e.target.value === ""
                    ? null
                    : (e.target.value as 'ON_GRID' | 'OFF_GRID')
                )
              }
            >
              <option value="">Escolha o tipo</option>
              <option value="ON_GRID">On-Grid</option>
              <option value="OFF_GRID">Off-Grid</option>
            </select>

          </div>

          {/* Status */}
          <div className={styles.field}>
            <label>Status</label>
            <select
              className={styles.input}
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as ProjectStatusType)
              }
            >
              {Object.values(ProjectStatus).map((statusValue) => (
                <option key={statusValue} value={statusValue}>
                  {projectStatusLabel[statusValue]}
                </option>
              ))}
            </select>
          </div>

          {/* Cliente */}
          <div className={styles.field}>
            <label>Cliente</label>
            <Input
              value={clientSearch}
              onChange={(e) => {
                setClientSearch(e.target.value);
                setClientId(null);
              }}
              placeholder="Digite o nome do cliente"
            />

            {clients.length > 0 && (
              <div className={styles.autocompleteList}>
                {clients.map(client => (
                  <div
                    key={client.id}
                    className={styles.autocompleteItem}
                    onClick={() => {
                      setClientSearch(
                        `${client.firstName} ${client.lastName}`
                      );
                      setClientId(client.id);
                      setClients([]);
                    }}
                  >
                    {client.firstName} {client.lastName}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Responsável */}
          <div className={styles.field}>
            <label>Responsável</label>
            <Input
              value={responsibleSearch}
              onChange={(e) => {
                setResponsibleSearch(e.target.value);
                setResponsibleId(null);
              }}
              placeholder="Digite o nome do responsável"
            />

            {responsibles.length > 0 && (
              <div className={styles.autocompleteList}>
                {responsibles.map(responsible => (
                  <div
                    key={responsible.id}
                    className={styles.autocompleteItem}
                    onClick={() => {
                      setResponsibleSearch(
                        `${responsible.firstName} ${responsible.lastName}`
                      );
                      setResponsibleId(responsible.id);
                      setResponsibles([]);
                    }}
                  >
                    {responsible.firstName} {responsible.lastName}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Endereço */}
          <div className={styles.field}>
            <label>Endereço</label>
            <Input
              value={addressSearch}
              onChange={(e) => {
                setAddressSearch(e.target.value);
                setAddressId(null);
              }}
              placeholder="Digite o endereço"
            />
          </div>

        </div>

        <div className={styles.modalFooter}>
          <Button
            text="Cadastrar"
            onClick={handleCreateProject}
          />
        </div>

      </div>
    </div>
  );
}
