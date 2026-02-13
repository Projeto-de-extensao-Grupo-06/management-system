import { useEffect, useMemo, useState } from 'react';
import styles from '../Projects.module.css';

import { Button, Input } from '../../../components/ui/Form';

import ClientsService from '../../../services/ClientsService';
import ProjectsService from '../../../services/ProjectsService';

import type Client from '../../../interfaces/types/Client';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({ open, onClose }: Props) {
  
  const clientsService = useMemo(() => new ClientsService(), []);
  const projectsService = useMemo(() => new ProjectsService(), []);


  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] =
    useState<'ON_GRID' | 'OFF_GRID' | ''>('');

  const [clientSearch, setClientSearch] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState<number | null>(null);


  const [addressSearch, setAddressSearch] = useState('');
  const [addressId, setAddressId] = useState<number | null>(null);

  useEffect(() => {
    if (clientSearch.length < 2) return;

    clientsService
      .getAllClients(0, 10, clientSearch)
      .then(res => setClients(res.content))
      .catch(() => setClients([]));
  }, [clientSearch, clientsService]);


  const handleCreateProject = async () => {
     console.log('CLIQUEI');
    if (!projectName || !clientId || !projectType) 
      
      return;

    const payload = {
      name: projectName,
      clientId,
      addressId,
      projectType,
    };

    try {
      await projectsService.createManualProject(payload);
      onClose();
    } catch (e) {
      console.error('Erro ao criar projeto', e);
    }
  };

  if (!open) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>

        <h2 className={styles.modalTitle}>Criar Projeto</h2>

        <div className={styles.modalBody}>

         
          <div className={styles.field}>
            <label>Nome do projeto</label>
            <Input
              value={projectName}
              onChange={setProjectName}
              placeholder="Digite o nome do projeto"
            />
          </div>

          
          <div className={styles.field}>
            <label>Tipo de instalação</label>

            <div className={styles.installationOptions}>
              <button
                type="button"
                className={`${styles.installationCard} ${
                  projectType === 'ON_GRID' ? styles.active : ''
                }`}
                onClick={() => setProjectType('ON_GRID')}
              >
                On-Grid
              </button>

              <button
                type="button"
                className={`${styles.installationCard} ${
                  projectType === 'OFF_GRID' ? styles.active : ''
                }`}
                onClick={() => setProjectType('OFF_GRID')}
              >
                Off-Grid
              </button>
            </div>
          </div>

        
          <div className={styles.field}>
            <label>Cliente</label>
            <Input
              value={clientSearch}
              onChange={value => {
                setClientSearch(value);
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

   
          <div className={styles.field}>
            <label>Endereço</label>
            <Input
              value={addressSearch}
              onChange={value => {
                setAddressSearch(value);
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
