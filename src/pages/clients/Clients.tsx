import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from "react";
import { useNavigate } from 'react-router';
import ClientFilterModal from '../../components/dialogs/client_filter_dialog/ClientFilterDialog';
import Modal from '../../components/dialogs/modal/Modal';
import ClientForm from '../../components/forms/client_form/ClientForm';
import FilterBar from '../../components/layout/FilterBar';
import PageHeader from '../../components/layout/PageHeader';
import SecureComponent from '../../components/security/SecureComponent';
import ClientTable from '../../components/tables/client_table/ClientTable';
import { Pagination } from '../../components/tables/pagination/Pagination';
import { Alert } from '../../components/ui/Alert';
import { Button, SearchInput, Select, SelectOption, SimpleButton } from '../../components/ui/Form';
import useClients from '../../hooks/useClients';
import type { ModalRef } from '../../interfaces/properties/DialogProps';
import type { ClientFormRef } from '../../interfaces/properties/FormProps';
import styles from "./Clients.module.css";

export default function Clients() {
  const navigate = useNavigate();
  const {
    clients,
    page,
    totalPages,
    totalElements,
    searchTerm,
    statusFilter,
    filters,
    setPage,
    handleSearchChange,
    handleStatusChange,
    handleApplyFilters,
    handleClearFilters,
    createClient,
    deleteClient
  } = useClients();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const formRef = useRef<ClientFormRef>(null);
  const modalRef = useRef<ModalRef>(null);

  const [globalAlert, setGlobalAlert] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [modalTypeMessage, setModalMessage] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteClientId, setDeleteClientId] = useState<number | null>(null);

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

  const onFormSubmit = (data: any) => {
    setModalMessage(null);
    setGlobalAlert(null);

    createClient(data)
      .then(() => {
        setIsCreateModalOpen(false);
        setGlobalAlert({ message: 'Cliente cadastrado com sucesso!', type: 'success' });
        setTimeout(() => setGlobalAlert(null), 5000);
      })
      .catch((e: Error) => {
        setModalMessage(e.message);
        modalRef.current?.scrollToTop();
      });
  }

  const handleFilterClient = () => {
    setIsFilterModalOpen(true);
  }

  const handleDelete = (id: number) => {
    setDeleteClientId(id);
    setIsDeleteModalOpen(true);
  }

  const confirmDelete = () => {
    if (deleteClientId === null) return;

    deleteClient(deleteClientId)
      .then(() => {
        setGlobalAlert({ message: 'Cliente removido com sucesso!', type: 'success' });
        setTimeout(() => setGlobalAlert(null), 5000);
        setIsDeleteModalOpen(false);
      })
      .catch((e: Error) => {
        setGlobalAlert({ message: e.message, type: 'error' });
        setIsDeleteModalOpen(false);
      });
  }

  const createModalFooter = (
    <Button
      icon={<FontAwesomeIcon icon={faPlus} />}
      text="Cadastrar Cliente"
      ariaLabel="Confirmar cadastro"
      onClick={handleCreateSubmit}
      width="fit-content"
    />
  );

  const deleteModalFooter = (
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', width: '100%' }}>
      <SimpleButton
        text="Cancelar"
        ariaLabel="Cancelar exclusão"
        onClick={() => setIsDeleteModalOpen(false)}
        style={{ backgroundColor: '#ccc', color: '#333' }}
      />
      <Button
        text="Confirmar"
        ariaLabel="Confirmar exclusão"
        onClick={confirmDelete}
        width="fit-content"
        style={{ backgroundColor: '#d32f2f' }}
      />
    </div>
  );

  return (
    <div className={styles.container}>
      {globalAlert && !isCreateModalOpen && (
        <div className={styles.alertWrapper}>
          <Alert message={globalAlert.message} type={globalAlert.type} />
        </div>
      )}

      {isCreateModalOpen && (
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
          />
        </Modal>
      )}

      {isDeleteModalOpen && (
        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Confirmar Exclusão"
          footer={deleteModalFooter}
          maxWidth="400px"
        >
          <p>Tem certeza que deseja excluir este cliente?</p>
        </Modal>
      )}

      <ClientFilterModal
        key={isFilterModalOpen ? 'open' : 'closed'}
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
      />

      <PageHeader title="Clientes" count={totalElements}>
        <SecureComponent permissions={["CLIENT_WRITE"]}>
          <Button
            icon={<FontAwesomeIcon icon={faPlus} />}
            text="Cadastrar Cliente"
            ariaLabel="Cadastrar Cliente"
            onClick={handleAddClient}
            width="fit-content"
          />
        </SecureComponent>
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
            <Select value={statusFilter} onChange={handleStatusChange}>
              <SelectOption value="Todos" label="Todos" />
              <SelectOption value="Ativo" label="Ativo" />
              <SelectOption value="Inativo" label="Inativo" />
            </Select>
          </div>

          <div className={styles.searchBox}>
            <SearchInput
              onChange={handleSearchChange}
              value={searchTerm}
              placeholder="Buscar por Nome, CPF/CNPJ, E-mail ou Telefone"
            />
          </div>
        </div>
      </FilterBar>

      <ClientTable
        clients={clients}
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
