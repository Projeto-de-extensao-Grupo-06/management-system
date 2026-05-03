import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import Modal from "../../components/dialogs/modal/Modal";
import CoworkerForm from "../../components/forms/coworker_form/CoworkerForm";
import FilterBar from "../../components/layout/FilterBar";
import PageLayout from "../../components/layout/PageLayout";
import SecureComponent from "../../components/security/SecureComponent";
import CoworkerTable from "../../components/tables/coworker_table/CoworkerTable";
import { Pagination } from "../../components/tables/pagination/Pagination";
import { Alert } from "../../components/ui/Alert";
import {
  Button,
  SearchInput,
  Select,
  SelectOption,
  SimpleButton,
} from "../../components/ui/Form";
import useCoworkers from "../../hooks/useCoworkers";

import type { ModalRef } from "../../interfaces/properties/DialogProps";
import type {
  CoworkerFormData,
  CoworkerFormRef,
} from "../../interfaces/properties/FormProps";
import type { Coworker } from "../../interfaces/types/Coworker";
import type { CoworkerEditSchemaType } from "../../schemas/coworkerSchema";

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
    updateCoworker,
    deleteCoworker,
  } = useCoworkers();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const formRef = useRef<CoworkerFormRef>(null);
  const modalRef = useRef<ModalRef>(null);
  const editFormRef = useRef<CoworkerFormRef>(null);
  const editModalRef = useRef<ModalRef>(null);

  const [globalAlert, setGlobalAlert] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [modalTypeMessage, setModalMessage] = useState<string | null>(null);
  const [editModalMessage, setEditModalMessage] = useState<string | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteCoworkerId, setDeleteCoworkerId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCoworker, setSelectedCoworker] = useState<Coworker | null>(
    null,
  );

  const mapPermissionGroupToFormValue = (role?: string | null) => {
    const normalizedRole = role?.trim().toLowerCase() ?? "";

    if (normalizedRole.includes("admin")) {
      return "Admin";
    }

    if (normalizedRole.includes("tecn")) {
      return "Tecnico";
    }

    if (normalizedRole.includes("secret")) {
      return "Secretaria";
    }

    return "";
  };

  const getEditFormDefaultValues = (coworker: Coworker | null) => {
    if (!coworker) {
      return undefined;
    }

    return {
      firstName: coworker.firstName,
      secondName: coworker.lastName,
      email: coworker.email,
      phone: coworker.phone,
      permissionGroupRole: mapPermissionGroupToFormValue(
        coworker.permissionGroupRole,
      ),
    };
  };

  const handleEdit = (id: number) => {
    const coworkerToEdit = coworkers.find((coworker) => coworker.id === id);

    if (!coworkerToEdit) {
      setGlobalAlert({
        message: "Não foi possível localizar o colaborador selecionado.",
        type: "error",
      });
      return;
    }

    setEditModalMessage(null);
    setSelectedCoworker(coworkerToEdit);
    setIsEditModalOpen(true);
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

  const handleEditSubmit = () => {
    editFormRef.current?.submit();
  };

  const onFormSubmit = (data: CoworkerFormData) => {
    if (!("password" in data)) {
      setModalMessage("Senha é obrigatória.");
      return;
    }

    setModalMessage(null);
    setGlobalAlert(null);

    createCoworker(data)
      .then(() => {
        setIsCreateModalOpen(false);
        setGlobalAlert({
          message: "Colaborador cadastrado com sucesso!",
          type: "success",
        });
        setTimeout(() => setGlobalAlert(null), 5000);
      })
      .catch((e: Error) => {
        setModalMessage(e.message);
        modalRef.current?.scrollToTop();
      });
  };

  const onEditFormSubmit = (data: CoworkerEditSchemaType) => {
    if (!selectedCoworker) {
      return;
    }

    const permissionGroupRole =
      data.permissionGroupRole ||
      mapPermissionGroupToFormValue(selectedCoworker.permissionGroupRole);

    setEditModalMessage(null);
    setGlobalAlert(null);

    updateCoworker(selectedCoworker.id, {
      ...data,
      permissionGroupRole,
    })
      .then(() => {
        setIsEditModalOpen(false);
        setSelectedCoworker(null);
        setGlobalAlert({
          message: "Colaborador atualizado com sucesso!",
          type: "success",
        });
        setTimeout(() => setGlobalAlert(null), 5000);
      })
      .catch((e: Error) => {
        setEditModalMessage(e.message);
        editModalRef.current?.scrollToTop();
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
          message: "Colaborador removido com sucesso!",
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

  const editModalFooter = (
    <Button
      text="Salvar"
      ariaLabel="Salvar edição do colaborador"
      onClick={handleEditSubmit}
      width="fit-content"
    />
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
      {globalAlert && !isCreateModalOpen && !isEditModalOpen && (
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

      {isEditModalOpen && selectedCoworker && (
        <Modal
          ref={editModalRef}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCoworker(null);
          }}
          title="Editar Colaborador"
          footer={editModalFooter}
        >
          {editModalMessage && (
            <div style={{ marginBottom: "1rem" }}>
              <Alert message={editModalMessage} type="error" />
            </div>
          )}
          <CoworkerForm
            ref={editFormRef}
            onSubmit={onEditFormSubmit}
            mode="edit"
            defaultValues={getEditFormDefaultValues(selectedCoworker)}
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
              <SelectOption value="Tecnico" label="Tecnico" />
              <SelectOption value="Secretaria" label="Secretaria" />
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
