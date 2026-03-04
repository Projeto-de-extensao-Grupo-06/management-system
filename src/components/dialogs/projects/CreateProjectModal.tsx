import { useEffect, useMemo, useState, useRef } from 'react';

import { useForm, FormProvider } from 'react-hook-form';
import Modal from '../../../components/dialogs/modal/Modal';
import ClientForm from '../../../components/forms/client_form/ClientForm';
import AddressForm from '../../../components/forms/client_form/partials/AddressForm';
import { Button, Input } from '../../../components/ui/Form';

import usePermissions from "../../../hooks/usePermissions";
import { ProjectStatus } from '../../../interfaces/enum/ProjectStatus';
import type { ProjectStatusType } from '../../../interfaces/enum/ProjectStatus';
import type { ClientFormRef } from '../../../interfaces/properties/FormProps';
import type { Address } from '../../../interfaces/types/Client';
import type Client from '../../../interfaces/types/Client';
import styles from '../../../pages/projects/Projects.module.css';
import AddressService from '../../../services/AddressService';
import ClientsService from '../../../services/ClientsService';
import ProjectsService from '../../../services/ProjectsService';

import { formatAddress } from '../../../utils/AddressUtils';
import { projectStatusLabel } from '../../../utils/mappers/projectStatusLabel';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateProjectModal({ open, onClose, onSuccess }: Props) {

  const clientsService = useMemo(() => new ClientsService(), []);
  const projectsService = useMemo(() => new ProjectsService(), []);
  const addressService = useMemo(() => new AddressService(), []);

  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] =
    useState<'ON_GRID' | 'OFF_GRID' | null>(null);

  const [status, setStatus] =
    useState<ProjectStatusType>(ProjectStatus.NEW);

  const [clientSearch, setClientSearch] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState<number | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const isSelectingClient = useRef(false);

  const [editClient, setEditClient] = useState(false);
  const clientFormRef = useRef<ClientFormRef>(null);

  const [responsibleSearch, setResponsibleSearch] = useState('');
  const [responsibles, setResponsibles] = useState<any[]>([]);
  const [responsibleId, setResponsibleId] = useState<number | null>(null);
  const isSelectingResponsible = useRef(false);

  const [address, setAddress] = useState<Address | null>(null);
  const [addressId, setAddressId] = useState<number | null>(null);
  const [editAddress, setEditAddress] = useState(false);
  const [addressType, setAddressType] = useState<string>("");
  const userPermissions = usePermissions();
  type ProjectErrors = {
    projectName?: string;
    projectType?: string;
    client?: string;
    responsible?: string;
    address?: string;
  };

  const [errors, setErrors] = useState<ProjectErrors>({});


  const methods = useForm({
    defaultValues: {
      zipCode: "",
      state: "",
      city: "",
      neighborhood: "",
      street: "",
      number: ""
    }
  });


  useEffect(() => {

    if (isSelectingClient.current) {
      isSelectingClient.current = false;
      return;
    }

    if (clientSearch.length < 2) {
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

    if (isSelectingResponsible.current) {
      isSelectingResponsible.current = false;
      return;
    }

    if (responsibleSearch.length < 2) {
      return;
    }

    const delay = setTimeout(() => {
      projectsService
        .getAllCoworkers(0, 100)
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

  const useClientAddress = () => {
    if (!selectedClient?.mainAddress) return;

    const addr = selectedClient.mainAddress;

    methods.reset({
      zipCode: addr.postalCode ?? "",
      state: addr.state ?? "",
      city: addr.city ?? "",
      neighborhood: addr.neighborhood ?? "",
      street: addr.streetName ?? "",
      number: addr.number ?? ""
    });

    setAddressType(addr.type?.toLowerCase() ?? "");
  };

  const validateForm = () => {

    const newErrors = {
      projectName: "",
      projectType: "",
      client: "",
      responsible: "",
      address: ""
    };

    if (!projectName.trim()) {
      newErrors.projectName = "Informe o nome do projeto.";
    }

    if (!projectType) {
      newErrors.projectType = "Selecione o tipo de instalação.";
    }

    if (!clientId) {
      newErrors.client = "Selecione ou cadastre um cliente.";
    }

    if (!responsibleId) {
      newErrors.responsible = "Selecione um responsável.";
    }

    if (!addressId) {
      newErrors.address = "Selecione ou cadastre um endereço.";
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some(error => error !== "");
  };


  const handleCreateProject = async () => {

    if (!validateForm()) return;

    const payload = {
      name: projectName,
      description: "",
      projectType: projectType as 'ON_GRID' | 'OFF_GRID',
      status,
      clientId: clientId!,
      responsibleId: responsibleId ?? undefined,
      addressId: addressId ?? undefined
    };


    try {
      await projectsService.createManualProject(payload);
      setProjectName('');
      setProjectType(null);
      setClientId(null);
      setResponsibleId(null);
      setAddressId(null);
      setAddress(null);
      setErrors({});
      setStatus('NEW');
      setClientSearch('');
      setSelectedClient(null);
      setResponsibleSearch('');
      setResponsibles([]);
      setClients([]);
      if (onSuccess) onSuccess();
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
              onChange={(e) => {
                setProjectName(e.target.value);
                if (errors.projectName) {
                  setErrors(prev => ({ ...prev, projectName: '' }));
                }
              }}
              placeholder="Digite o nome do projeto"
            />
            {errors.projectName && (
              <span className={styles.errorText}>
                {errors.projectName}
              </span>
            )}
          </div>

          {/* Tipo */}
          <div className={styles.field}>
            <label>Tipo de instalação</label>
            <select
              className={styles.input}
              value={projectType ?? ""}
              onChange={(e) => {
                setProjectType(
                  e.target.value === ""
                    ? null
                    : (e.target.value as 'ON_GRID' | 'OFF_GRID')
                );
                if (errors.projectType) {
                  setErrors(prev => ({ ...prev, projectType: '' }));
                }
              }}
            >
              <option value="">Escolha o tipo</option>
              <option value="ON_GRID">On-Grid</option>
              <option value="OFF_GRID">Off-Grid</option>
            </select>
            {errors.projectType && (
              <span className={styles.errorText}>
                {errors.projectType}
              </span>
            )}
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
                if (e.target.value.length < 2) {
                  setClients([]);
                }
                setClientId(null);
                setSelectedClient(null);
                setAddress(null);
                setAddressId(null);

                if (errors.client) {
                  setErrors(prev => ({ ...prev, client: '' }));
                }
              }}
              placeholder="Digite o nome do cliente"
            />

            {errors.client && (
              <span className={styles.errorText}>
                {errors.client}
              </span>
            )}

            {clients.length > 0 && (
              <div className={styles.autocompleteList}>
                {clients.map(client => (
                  <div
                    key={client.id}
                    className={styles.autocompleteItem}
                    onMouseDown={() => {
                      isSelectingClient.current = true;
                      setClientSearch(`${client.firstName} ${client.lastName}`);
                      setClientId(client.id);
                      setSelectedClient(client);
                      setClients([]);

                      setErrors(prev => ({ ...prev, client: '' }));
                      setTimeout(() => isSelectingClient.current = false, 0);
                    }}
                  >
                    {client.firstName} {client.lastName}
                  </div>
                ))}
              </div>
            )}

            {userPermissions.includes("CLIENT_WRITE") && (
              <span
                className={styles.greenLink}
                onClick={() => setEditClient(true)}
                style={{ display: "block", marginTop: "8px" }}
              >
                Cadastrar novo cliente
              </span>
            )}

            {userPermissions.includes("CLIENT_WRITE") && (
              <Modal
                isOpen={editClient}
                title="Cadastrar Cliente"
                onClose={() => setEditClient(false)}
              >
                <ClientForm
                  ref={clientFormRef}
                  onSubmit={async (data) => {
                    try {
                      const created = await clientsService.createClient(data);

                      setClientId(created.id);
                      setSelectedClient(created);
                      setClientSearch(`${created.firstName} ${created.lastName}`);
                      setErrors(prev => ({ ...prev, client: '' }));

                      setEditClient(false);
                    } catch (error: any) {
                      console.error("Erro ao criar cliente:", error.response?.data);
                    }
                  }}
                />

                <Button
                  style={{ marginTop: "30px" }}
                  text="Salvar"
                  onClick={() => clientFormRef.current?.submit()}
                />
              </Modal>
            )}
          </div>

          {/* Responsável */}
          <div className={styles.field}>
            <label>Responsável</label>
            <Input
              value={responsibleSearch}
              onChange={(e) => {
                setResponsibleSearch(e.target.value);
                if (e.target.value.length < 2) {
                  setResponsibles([]);
                }
                setResponsibleId(null);


                if (errors.responsible) {
                  setErrors(prev => ({ ...prev, responsible: '' }));
                }
              }}
              placeholder="Digite o nome do responsável"
            />

            {errors.responsible && (
              <span className={styles.errorText}>
                {errors.responsible}
              </span>
            )}

            {responsibles.length > 0 && (
              <div className={styles.autocompleteList}>
                {responsibles.map((responsible) => (
                  <div
                    key={responsible.id}
                    className={styles.autocompleteItem}
                    onMouseDown={() => {
                      isSelectingResponsible.current = true;
                      setResponsibleSearch(
                        `${responsible.firstName} ${responsible.lastName}`
                      );
                      setResponsibleId(responsible.id);
                      setResponsibles([]);

                      setErrors(prev => ({ ...prev, responsible: '' }));
                      setTimeout(() => isSelectingResponsible.current = false, 0);
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
              disabled
              value={address ? formatAddress(address) : ""}
              placeholder="Nenhum endereço informado"
            />

            {errors.address && (
              <span className={styles.errorText}>
                {errors.address}
              </span>
            )}

            <span
              className={styles.greenLink}
              onClick={() => setEditAddress(true)}
            >
              Adicionar endereço
            </span>


            <Modal
              isOpen={editAddress}
              title="Adicionar endereço"
              onClose={() => setEditAddress(false)}
            >
              <FormProvider {...methods}>
                <AddressForm />
              </FormProvider>

              <div style={{ marginTop: "20px" }}>
                <label>Tipo do endereço</label>
                <select
                  className={styles.input}
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                >
                  <option value="">Selecione o tipo</option>
                  <option value="residential">Residencial</option>
                  <option value="commercial">Comercial</option>
                  <option value="building">Prédio</option>
                  <option value="other">Outro</option>
                </select>
              </div>

              {selectedClient?.mainAddress && (
                <span
                  className={styles.greenLink}
                  onClick={useClientAddress}
                  style={{ display: "block", marginTop: "10px" }}
                >
                  Usar endereço do cliente
                </span>
              )}

              <Button
                style={{ marginTop: "30px" }}
                text="Salvar"
                onClick={async () => {

                  if (!addressType) {
                    alert("Selecione o tipo do endereço.");
                    return;
                  }

                  const formValues = methods.getValues();

                  const payload = {
                    postalCode: formValues.zipCode,
                    streetName: formValues.street,
                    neighborhood: formValues.neighborhood,
                    number: formValues.number,
                    city: formValues.city,
                    state: formValues.state,
                    type: addressType.toUpperCase()
                  };

                  try {
                    const created = await addressService.createAddress(payload);

                    setAddress(created);
                    setAddressId(created.id);
                    setErrors(prev => ({ ...prev, address: '' }));
                    setEditAddress(false);

                  } catch (error: any) {
                    console.error("Erro do backend:", error.response?.data);
                  }

                }}
              />
            </Modal>
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
