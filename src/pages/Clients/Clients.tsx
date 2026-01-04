import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { AxiosError } from 'axios';
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from 'react-router';
import { Alert } from '../../components/Alert';
import ClientForm from '../../components/ClientForm/ClientForm';
import type { ClientFormRef } from '../../components/ClientForm/ClientForm';
import ClientTable from '../../components/ClientTable/ClientTable';
import { Button, Input, SearchInput, Select, SelectOption, SimpleButton } from '../../components/Form';
import FilterBar from '../../components/Layout/FilterBar';
import PageHeader from '../../components/Layout/PageHeader';
import Modal from '../../components/Modal/Modal';
import type { ModalRef } from '../../components/Modal/Modal';
import type Client from "../../interfaces/types/Client";
import type { ClientSchemaType } from '../../schemas/clientSchema';
import ClientService from "../../services/ClientsService";
import styles from "./Clients.module.css";

export default function Clients() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [clients, setClients] = useState<Client[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    city: '',
    state: ''
  });
  const formRef = useRef<ClientFormRef>(null);
  const modalRef = useRef<ModalRef>(null);
  const [clientFormData, setClientFormData] = useState<Partial<ClientSchemaType>>({});

  const [globalAlert, setGlobalAlert] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [modalTypeMessage, setModalMessage] = useState<string | null>(null);

  const clientsService = useMemo(() => new ClientService(), []);

  useEffect(() => {
    clientsService.getAllClients()
      .then((data: Client[]) => {
        setClients(data)
      })
      .catch((e) => {
        console.error('Erro ao buscar clientes:', e)
        setGlobalAlert({ message: 'Erro ao carregar clientes.', type: 'error' });
      })
  }, [clientsService])

  const handleEdit = (id: number) => {
    navigate(`/clientes/${id}`, { state: { edit: true } });
  }

  const handleRowClick = (id: number) => {
    navigate(`/clientes/${id}`, { state: { edit: false } });
  }

  const handleAddClient = () => {
    setModalMessage(null);
    setIsCreateModalOpen(true);
  }

  const handleCreateSubmit = () => {
    formRef.current?.submit();
  }

  const onFormSubmit = (data: ClientSchemaType) => {
    setModalMessage(null);
    setGlobalAlert(null);

    console.log("PAYLOAD being sent:", JSON.stringify(data, null, 2));

    clientsService.createClient(data)
      .then((newClient) => {
        setClients(prev => [...prev, newClient]);
        setClientFormData({});
        setIsCreateModalOpen(false);
        setGlobalAlert({ message: 'Cliente cadastrado com sucesso!', type: 'success' });

        // Auto dismiss success message
        setTimeout(() => setGlobalAlert(null), 5000);
      })
      .catch((e) => {
        const error = e as AxiosError<{ message: string, validationErrors?: { field: string, message: string }[] }>;
        console.error("Backend Error Response:", JSON.stringify(error.response?.data, null, 2));

        let errorMsg = error.response?.data?.message || 'Erro ao criar cliente. Verifique os dados.';

        if (error.response?.data?.validationErrors?.length) {
          const details = error.response.data.validationErrors
            .map(err => `${err.field}: ${err.message}`)
            .join('\n');
          errorMsg += `\n\n${details}`;
        }

        setModalMessage(errorMsg);
        modalRef.current?.scrollToTop();
      });
  }

  const handleFilterClient = () => {
    setIsFilterModalOpen(true);
  }

  const handleApplyFilters = () => {
    setIsFilterModalOpen(false);
  }

  const handleClearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      city: '',
      state: ''
    });
    setIsFilterModalOpen(false);
  }

  const handleDelete = (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) return;

    clientsService.deleteClient(id)
      .then(() => {
        setClients((prevClients) => prevClients.filter(client => client.id !== id))
        setGlobalAlert({ message: 'Cliente removido com sucesso!', type: 'success' });
        setTimeout(() => setGlobalAlert(null), 5000);
      })
      .catch((e) => {
        console.error('Erro ao deletar cliente:', e);
        const error = e as AxiosError<{ message: string }>;
        const errorMessage = error.response?.data?.message || 'Erro ao deletar cliente. Tente novamente.';
        setGlobalAlert({ message: errorMessage, type: 'error' });
      })
  }

  const filteredClients = useMemo(() => {
    let result = [...clients]

    if (statusFilter !== 'Todos') {
      result = result.filter(c => c.status === statusFilter)
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase()
      result = result.filter(c =>
        c.name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.phone.includes(term) ||
        (c.documentNumber && c.documentNumber.includes(term))
      )
    }

    if (filters.city) {
      result = result.filter(c => c.mainAddress?.city.toLowerCase().includes(filters.city.toLowerCase()));
    }
    if (filters.state) {
      result = result.filter(c => c.mainAddress?.state.toLowerCase() === filters.state.toLowerCase());
    }
    if (filters.startDate) {
      const start = new Date(filters.startDate);
      result = result.filter(c => c.createdAt && new Date(c.createdAt) >= start);
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      // Set end date to end of day
      end.setHours(23, 59, 59, 999);
      result = result.filter(c => c.createdAt && new Date(c.createdAt) <= end);
    }

    return result
  }, [clients, statusFilter, searchTerm, filters])

  const createModalFooter = (
    <Button
      icon={<FontAwesomeIcon icon={faPlus} />}
      text="Cadastrar Cliente"
      ariaLabel="Confirmar cadastro"
      onClick={handleCreateSubmit}
      width="fit-content"
    />
  );

  const filterModalFooter = (
    <>
      <SimpleButton
        text="Limpar Filtros"
        ariaLabel="Limpar filtros"
        onClick={handleClearFilters}
        width="fit-content"
      />
      <Button
        text="Aplicar Filtros"
        ariaLabel="Aplicar filtros"
        onClick={handleApplyFilters}
        width="fit-content"
      />
    </>
  );

  return (
    <div className={styles.container}>
      {globalAlert && !isCreateModalOpen && (
        <div className={styles.alertWrapper}>
          <Alert message={globalAlert.message} type={globalAlert.type} />
        </div>
      )}

      <Modal
        ref={modalRef}
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Criar Cliente"
        footer={createModalFooter}
      >
        {modalTypeMessage && (
          <div style={{ marginBottom: '1rem' }}>
            <Alert message={modalTypeMessage} type="error" />
          </div>
        )}
        <ClientForm
          ref={formRef}
          onSubmit={onFormSubmit}
          defaultValues={clientFormData}
          onFormChange={setClientFormData}
        />
      </Modal>

      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filtrar Clientes"
        footer={filterModalFooter}
        maxWidth="500px"
      >
        <div className={styles.filterModalContainer}>
          <div>
            <label className={styles.filterLabel}>Cidade</label>
            <Input
              placeholder="Digite a cidade"
              value={filters.city}
              onChange={(val: string) => setFilters(prev => ({ ...prev, city: val }))}
            />
          </div>
          <div>
            <label className={styles.filterLabel}>Estado (UF)</label>
            <Input
              placeholder="Ex: SP"
              maxLength={2}
              value={filters.state}
              onChange={(val: string) => setFilters(prev => ({ ...prev, state: val }))}
            />
          </div>
          <div>
            <label className={styles.filterLabel}>Data de Cadastro (Início)</label>
            <Input
              type="date"
              placeholder=""
              value={filters.startDate}
              onChange={(val: string) => setFilters(prev => ({ ...prev, startDate: val }))}
            />
          </div>
          <div>
            <label className={styles.filterLabel}>Data de Cadastro (Fim)</label>
            <Input
              type="date"
              placeholder=""
              value={filters.endDate}
              onChange={(val: string) => setFilters(prev => ({ ...prev, endDate: val }))}
            />
          </div>
        </div>
      </Modal>

      <PageHeader title="Clientes" count={clients.length}>
        <Button
          icon={<FontAwesomeIcon icon={faPlus} />}
          text="Cadastrar Cliente"
          ariaLabel="Cadastrar Cliente"
          onClick={handleAddClient}
          width="fit-content"
        />
      </PageHeader>

      <FilterBar>
        <SimpleButton
          icon={<FontAwesomeIcon icon={faFilter} />}
          text="Filtros"
          ariaLabel="Filtrar Clientes"
          onClick={handleFilterClient}
        />

        <div className={styles.dropdown}>
          <Select value={statusFilter} onChange={setStatusFilter}>
            <SelectOption value="Todos" label="Todos" />
            <SelectOption value="Ativo" label="Ativo" />
            <SelectOption value="Inativo" label="Inativo" />
          </Select>
        </div>

        <div className={styles.searchBox}>
          <SearchInput
            onChange={setSearchTerm}
            value={searchTerm}
            placeholder="Buscar por Nome, CPF/CNPJ, E-mail ou Telefone"
          />
        </div>
      </FilterBar>

      <ClientTable
        clients={filteredClients}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowClick={handleRowClick}
      />
    </div>
  );
}
