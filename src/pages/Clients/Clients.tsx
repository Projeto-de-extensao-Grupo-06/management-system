import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { AxiosError } from 'axios';
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from 'react-router';
import { Alert } from '../../components/Alert';
import ClientForm from '../../components/ClientForm/ClientForm';
import type { ClientFormRef } from '../../components/ClientForm/ClientForm';
import ClientTable from '../../components/ClientTable/ClientTable';
import { Button, SearchInput, Select, SelectOption, SimpleButton } from '../../components/Form';
import FilterBar from '../../components/Layout/FilterBar';
import PageHeader from '../../components/Layout/PageHeader';
import Modal from '../../components/Modal/Modal';
import type { ModalRef } from '../../components/Modal/Modal';
import { Pagination } from '../../components/Pagination/Pagination';
import type Client from "../../interfaces/types/Client";
import type { Page } from '../../interfaces/types/Page';
import type { ClientSchemaType } from '../../schemas/clientSchema';
import ClientService from "../../services/ClientsService";
import styles from "./Clients.module.css";
import ClientFilterModal from './components/ClientFilterModal';

export default function Clients() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Ativo');
  const [clients, setClients] = useState<Client[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

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

  const fetchClients = useCallback(() => {
    clientsService.getAllClients(page, 20, searchTerm, statusFilter)
      .then((data: Page<Client>) => {
        setClients(data.content);
        setTotalPages(data.totalPages);
      })
      .catch(() => {
        setGlobalAlert({ message: 'Erro ao carregar clientes.', type: 'error' });
      });
  }, [clientsService, page, searchTerm, statusFilter]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, statusFilter]);

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

    clientsService.createClient(data)
      .then(() => {
        fetchClients();
        setClientFormData({});
        setIsCreateModalOpen(false);
        setGlobalAlert({ message: 'Cliente cadastrado com sucesso!', type: 'success' });
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
        fetchClients(); // Reload page
        setGlobalAlert({ message: 'Cliente removido com sucesso!', type: 'success' });
        setTimeout(() => setGlobalAlert(null), 5000);
      })
      .catch((e) => {
        const error = e as AxiosError<{ message: string }>;
        const errorMessage = error.response?.data?.message || 'Erro ao deletar cliente. Tente novamente.';
        setGlobalAlert({ message: errorMessage, type: 'error' });
      })
  }

  const filteredClients = useMemo(() => {
    let result = [...clients];

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
      end.setHours(23, 59, 59, 999);
      result = result.filter(c => c.createdAt && new Date(c.createdAt) <= end);
    }

    return result;
  }, [clients, filters]);

  const createModalFooter = (
    <Button
      icon={<FontAwesomeIcon icon={faPlus} />}
      text="Cadastrar Cliente"
      ariaLabel="Confirmar cadastro"
      onClick={handleCreateSubmit}
      width="fit-content"
    />
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

      <ClientFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onClear={handleClearFilters}
      />

      <PageHeader title="Clientes" count={filteredClients.length}>
        <Button
          icon={<FontAwesomeIcon icon={faPlus} />}
          text="Cadastrar Cliente"
          ariaLabel="Cadastrar Cliente"
          onClick={handleAddClient}
          width="fit-content"
        />
      </PageHeader>

      <FilterBar>
        <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
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
        </div>
      </FilterBar>

      <ClientTable
        clients={filteredClients}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowClick={handleRowClick}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
