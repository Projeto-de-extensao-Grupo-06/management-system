import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import Modal from '../../../components/dialogs/modal/Modal';
import PermissionProfileDialog from '../../../components/dialogs/permission_profile_dialog/PermissionProfileDialog';
import type { PermissionProfileDialogRef } from '../../../components/dialogs/permission_profile_dialog/PermissionProfileDialog';
import PermissionProfileForm from '../../../components/forms/permission_profile_form/PermissionProfileForm';
import FilterBar from '../../../components/layout/FilterBar';
import PageLayout from '../../../components/layout/PageLayout';
import SecureComponent from '../../../components/security/SecureComponent';
import { Pagination } from '../../../components/tables/pagination/Pagination';
import PermissionProfileTable from '../../../components/tables/permission_profile_table/PermissionProfileTable';
import { Alert } from '../../../components/ui/Alert';
import {
    Button,
    SearchInput,
    Select,
    SelectOption,
    SimpleButton,
} from '../../../components/ui/Form';
import usePermissionProfiles from '../../../hooks/usePermissionProfiles';
import type { ModalRef } from '../../../interfaces/properties/DialogProps';
import type { PermissionProfileFormRef } from '../../../interfaces/properties/FormProps';
import type { PermissionProfileSchemaType } from '../../../schemas/permissionProfileSchema';
import styles from './PermissionProfiles.module.css';

export default function PermissionProfiles() {
    const {
        profiles,
        page,
        totalPages,
        totalElements,
        searchTerm,
        moduleFilter,
        handleSearchChange,
        handleModuleFilterChange,
        setPage,
        createProfile,
        updateProfile,
        deleteProfile,
    } = usePermissionProfiles();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const formRef = useRef<PermissionProfileFormRef>(null);
    const modalRef = useRef<ModalRef>(null);
    const dialogRef = useRef<PermissionProfileDialogRef>(null);

    const [globalAlert, setGlobalAlert] = useState<{
        message: string;
        type: 'success' | 'error';
    } | null>(null);

    const [modalErrorMessage, setModalErrorMessage] = useState<string | null>(null);

    const showGlobalAlert = (message: string, type: 'success' | 'error') => {
        setGlobalAlert({ message, type });
        setTimeout(() => setGlobalAlert(null), 5000);
    };

    const handleAdd = () => {
        setModalErrorMessage(null);
        setIsCreateModalOpen(true);
    };

    const onFormSubmit = (data: PermissionProfileSchemaType) => {
        setModalErrorMessage(null);
        setGlobalAlert(null);

        createProfile(data)
            .then(() => {
                setIsCreateModalOpen(false);
                showGlobalAlert('Perfil criado com sucesso!', 'success');
            })
            .catch((e: Error) => {
                setModalErrorMessage(e.message);
                modalRef.current?.scrollToTop();
            });
    };

    const handleEdit = (id: number) => {
        dialogRef.current?.openEdit(id);
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (deleteId === null) return;

        deleteProfile(deleteId)
            .then(() => {
                showGlobalAlert('Perfil excluído com sucesso!', 'success');
                setIsDeleteModalOpen(false);
            })
            .catch((e: Error) => {
                showGlobalAlert(e.message, 'error');
                setIsDeleteModalOpen(false);
            });
    };

    const createModalFooter = (
        <Button
            icon={<FontAwesomeIcon icon={faPlus} />}
            text="Criar Perfil"
            ariaLabel="Confirmar criação"
            onClick={() => formRef.current?.submit()}
            width="fit-content"
        />
    );

    const deleteModalFooter = (
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', width: '100%' }}>
            <SimpleButton
                text="Cancelar"
                ariaLabel="Cancelar"
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
        <PageLayout
            title="Perfis de Permissão"
            titleAccessory={
                <span className={styles.count}>({totalElements ?? 0})</span>
            }
            rightActions={
                <SecureComponent permissions={["CONFIGURATION_WRITE"]}>
                    <Button
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        text="Novo Perfil"
                        ariaLabel="Adicionar Perfil"
                        onClick={handleAdd}
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
                    title="Criar Perfil de Permissão"
                    footer={createModalFooter}
                >
                    {modalErrorMessage && (
                        <div style={{ marginBottom: '1rem' }}>
                            <Alert message={modalErrorMessage} type="error" />
                        </div>
                    )}
                    <PermissionProfileForm ref={formRef} onSubmit={onFormSubmit} />
                </Modal>
            )}

            {isDeleteModalOpen && (
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="Excluir Perfil"
                    footer={deleteModalFooter}
                    maxWidth="400px"
                >
                    <p>Tem certeza que deseja excluir este perfil de permissão?</p>
                </Modal>
            )}

            <PermissionProfileDialog
                ref={dialogRef}
                onCreated={() => { }}
                onUpdated={() => showGlobalAlert('Perfil atualizado com sucesso!', 'success')}
                updateProfile={updateProfile}
            />

            <FilterBar>
                <div className={styles.filterRow}>
                    <div className={styles.filterGroup}>
                        <span className={styles.filterLabel}>
                            <FontAwesomeIcon icon={faFilter} />
                            Filtro:
                        </span>
                        <div className={styles.filterSelect}>
                            <Select value={moduleFilter} onChange={handleModuleFilterChange}>
                                <SelectOption value="" label="Todos os módulos" />
                                <SelectOption value="CLIENT" label="Clientes" />
                                <SelectOption value="PROJECT" label="Projetos" />
                                <SelectOption value="SCHEDULE" label="Agenda" />
                                <SelectOption value="MATERIAL" label="Materiais" />
                                <SelectOption value="BUDGET" label="Orçamentos" />
                                <SelectOption value="CONFIGURATION" label="Configurações" />
                            </Select>
                        </div>
                    </div>

                    <div className={styles.searchBox}>
                        <SearchInput
                            onChange={handleSearchChange}
                            value={searchTerm}
                            placeholder="Buscar perfil"
                        />
                    </div>
                </div>
            </FilterBar>

            <div className={styles.listContainer}>
                <PermissionProfileTable
                    profiles={profiles}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRowClick={(id) => dialogRef.current?.openView(id)}
                />

                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            </div>
        </PageLayout>
    );
}