import useCoworkers from "../../hooks/useCoworkers";
import type { CoworkerFormRef } from "../../interfaces/properties/FormProps";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import type { ModalRef } from "../../interfaces/properties/DialogProps";
import type { CoworkerSchemaType } from "../../schemas/coworkerSchema";
import {
  Button,
  SearchInput,
  Select,
  SelectOption,
} from "../../components/ui/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { SimpleButton } from "../../components/ui/Form";
import PageLayout from "../../components/layout/PageLayout";
import SecureComponent from "../../components/security/SecureComponent";
import FilterBar from "../../components/layout/FilterBar";
import { Alert } from "../../components/ui/Alert";
import Modal from "../../components/dialogs/modal/Modal";
import { Pagination } from "../../components/tables/pagination/Pagination";
import CoworkerTable from "../../components/tables/coworker_table/CoworkerTable";
import CoworkerForm from "../../components/forms/coworker_form/CoworkerForm";
import styles from "./Coworkers.module.css";

export default function Coworkers() {
  useEffect(() => {
    document.title = "Colaboradores | SolarWay";
  }, []);

  const navigate = useNavigate();
  const {
    coworkers,
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
    createCoworker,
    deleteCoworker,
  } = useCoworkers();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const formRef = useRef<CoworkerFormRef>(null);
  const modalRef = useRef<ModalRef>(null);

  const [globalAlert, setGlobalAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [modalTypeMessage, setModalMessage] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteCoworkerId, setDeleteCoworkerId] = useState<number | null>(null);

  const handleEdit = (id: number) => {
    navigate(`/coworkers/${id}`, { state: { edit: true } });
  };

  const handleRowClick = (id: number) => {
    navigate(`/coworkers/${id}`, { state: { edit: false } });
  };

  const handleAddCoworker = () => {
    setModalMessage(null);
    setIsCreateModalOpen(true);
  };

  const handleCreateSubmit = () => {
    formRef.current?.submit();
  };

  const onFormSubmit = (data: CoworkerSchemaType) => {
    setModalMessage(null);
    setGlobalAlert(null);

    createCoworker(data)
      .then(() => {
        setIsCreateModalOpen(false);
        setGlobalAlert({
          message: "Coworker cadastrado com sucesso!",
          type: "success",
        });
        setTimeout(() => setGlobalAlert(null), 5000);
      })
      .catch((e: Error) => {
        setModalMessage(e.message);
        modalRef.current?.scrollToTop();
      });
  };

  const handlePermissionGroupChange = (permissionGroup: string) => {
    handleApplyFilters({ permissionGroup });
  };

  const handleDelete = (id: number) => {
    setDeleteCoworkerId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteCoworkerId === null) return;

    deleteCoworker(deleteCoworkerId)
      .then(() => {
        setGlobalAlert({
          message: "Coworker removido com sucesso!",
          type: "success",
        });
        setTimeout(() => setGlobalAlert(null), 5000);
        setIsDeleteModalOpen(false);
      })
      .catch((e: Error) => {
        setGlobalAlert({ message: e.message, type: "error" });
        setIsDeleteModalOpen(false);
      });
  };

  const createModalFooter = (
    <Button
      icon={<FontAwesomeIcon icon={faPlus} />}
      text="Cadastrar Colaborador"
      ariaLabel="Confirmar cadastro"
      onClick={handleCreateSubmit}
      width="fit-content"
    />
  );

  const deleteModalFooter = (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        justifyContent: "flex-end",
        width: "100%",
      }}
    >
      <SimpleButton
        text="Cancelar"
        ariaLabel="Cancelar exclusão"
        onClick={() => setIsDeleteModalOpen(false)}
        style={{ backgroundColor: "#ccc", color: "#333" }}
      />
      <Button
        text="Confirmar"
        ariaLabel="Confirmar exclusão"
        onClick={confirmDelete}
        width="fit-content"
        style={{ backgroundColor: "#d32f2f" }}
      />
    </div>
  );

  return (
    <PageLayout
      title="Colaboradores"
      titleAccessory={
        <span className={styles.count}>
          ({totalElements ? totalElements : 0})
        </span>
      }
      rightActions={
        <SecureComponent permissions={["ROLE_ADMIN"]}>
          <Button
            icon={<FontAwesomeIcon icon={faPlus} />}
            text="Cadastrar Colaborador"
            ariaLabel="Cadastrar Colaborador"
            onClick={handleAddCoworker}
            width="fit-content"
          />
        </SecureComponent>
      }
    >
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
          title="Criar Colaborador"
          footer={createModalFooter}
        >
          {modalTypeMessage && (
            <div style={{ marginBottom: "1rem" }}>
              <Alert message={modalTypeMessage} type="error" />
            </div>
          )}
          <CoworkerForm ref={formRef} onSubmit={onFormSubmit} />
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
          <p>Tem certeza que deseja excluir este colaborador?</p>
        </Modal>
      )}

      <FilterBar>
        <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
          <div className={styles.dropdown} style={{ width: "200px" }}>
            <Select value={statusFilter} onChange={handleStatusChange}>
              <SelectOption value="Todos" label="Todos" />
              <SelectOption value="Ativo" label="Ativo" />
              <SelectOption value="Inativo" label="Inativo" />
            </Select>
          </div>

          <div className={styles.dropdown} style={{ width: "240px" }}>
            <Select
              value={filters.permissionGroup || "Todos"}
              onChange={handlePermissionGroupChange}
            >
              <SelectOption value="Todos" label="Todos os perfis" />
              <SelectOption value="Admin" label="Admin" />
              <SelectOption value="Vendedor" label="Vendedor" />
              <SelectOption value="Tecnico" label="Tecnico" />
              <SelectOption value="Suporte" label="Suporte" />
            </Select>
          </div>

          <div className={styles.searchBox}>
            <SearchInput
              onChange={handleSearchChange}
              value={searchTerm}
              placeholder="Buscar por Nome, E-mail ou Telefone"
            />
          </div>
        </div>
      </FilterBar>

      <CoworkerTable
        coworkers={coworkers}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowClick={handleRowClick}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </PageLayout>
  );
}
