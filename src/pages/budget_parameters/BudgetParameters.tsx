import { faFilter, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Modal from '../../components/dialogs/modal/Modal';
import BudgetParameterForm from '../../components/forms/budget_parameter_form/BudgetParameterForm';
import FilterBar from '../../components/layout/FilterBar';
import PageLayout from '../../components/layout/PageLayout';
import SecureComponent from '../../components/security/SecureComponent';
import BudgetParameterTable from '../../components/tables/budget_parameter_table/BudgetParameterTable';
import { Pagination } from '../../components/tables/pagination/Pagination';
import { Alert } from '../../components/ui/Alert';
import { Button, SearchInput, Select, SelectOption, SimpleButton } from '../../components/ui/Form';
import useBudgetParameters from '../../hooks/useBudgetParameters';
import type { ModalRef } from '../../interfaces/properties/DialogProps';
import type { BudgetParameterFormRef } from '../../interfaces/properties/FormProps';
import type { BudgetParameterSchemaType } from '../../schemas/budgetParameterSchema';
import styles from './BudgetParameters.module.css';

export default function BudgetParameters() {
    const navigate = useNavigate();
    const {
        parameters,
        page,
        totalPages,
        totalElements,
        searchTerm,
        typeFilter,
        statusFilter,
        handleSearchChange,
        handleTypeChange,
        handleStatusChange,
        setPage,
        createParameter,
        deleteParameter,
        activateParameter,
    } = useBudgetParameters();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteParameterId, setDeleteParameterId] = useState<number | null>(null);

    const formRef = useRef<BudgetParameterFormRef>(null);
    const modalRef = useRef<ModalRef>(null);

    const [globalAlert, setGlobalAlert] = useState<{
        message: string;
        type: 'success' | 'error';
    } | null>(null);
    const [modalErrorMessage, setModalErrorMessage] = useState<string | null>(null);

    const handleAddParameter = () => {
        setModalErrorMessage(null);
        setIsCreateModalOpen(true);
    };

    const onFormSubmit = (data: BudgetParameterSchemaType) => {
        setModalErrorMessage(null);
        setGlobalAlert(null);

        createParameter(data)
            .then(() => {
                setIsCreateModalOpen(false);
                setGlobalAlert({ message: 'Parâmetro cadastrado com sucesso!', type: 'success' });
                setTimeout(() => setGlobalAlert(null), 5000);
            })
            .catch((e: Error) => {
                setModalErrorMessage(e.message);
                modalRef.current?.scrollToTop();
            });
    };

    const handleDelete = (id: number) => {
        setDeleteParameterId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (deleteParameterId === null) return;

        deleteParameter(deleteParameterId)
            .then(() => {
                setGlobalAlert({ message: 'Parâmetro desativado com sucesso!', type: 'success' });
                setTimeout(() => setGlobalAlert(null), 5000);
                setIsDeleteModalOpen(false);
            })
            .catch((e: Error) => {
                setGlobalAlert({ message: e.message, type: 'error' });
                setIsDeleteModalOpen(false);
            });
    };

    const createModalFooter = (
        <Button
            icon={<FontAwesomeIcon icon={faPlus} />}
            text="Cadastrar Parâmetro"
            ariaLabel="Confirmar cadastro"
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
                ariaLabel="Confirmar desativação"
                onClick={confirmDelete}
                width="fit-content"
                style={{ backgroundColor: '#d32f2f' }}
            />
        </div>

    )
    const handleActivate = (id: number) => {
        activateParameter(id)
            .then(() => {
                setGlobalAlert({ message: 'Parâmetro ativado com sucesso!', type: 'success' });
                setTimeout(() => setGlobalAlert(null), 5000);
            })
            .catch((e: Error) => {
                setGlobalAlert({ message: e.message, type: 'error' });
            });
    };


    return (
        <PageLayout
            title="Parâmetros de Orçamento"
            backButton={true}
            titleAccessory={
                <span className={styles.count}>({totalElements ?? 0})</span>
            }
            rightActions={
                <SecureComponent permissions={['BUDGET_WRITE']}>
                    <Button
                        icon={<FontAwesomeIcon icon={faPlus} />}
                        text="Adicionar Parâmetro"
                        ariaLabel="Adicionar Parâmetro"
                        onClick={handleAddParameter}
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
                    title="Adicionar Parâmetro de Orçamento"
                    footer={createModalFooter}
                >
                    {modalErrorMessage && (
                        <div style={{ marginBottom: '1rem' }}>
                            <Alert message={modalErrorMessage} type="error" />
                        </div>
                    )}
                    <BudgetParameterForm ref={formRef} onSubmit={onFormSubmit} />
                </Modal>
            )}

            {isDeleteModalOpen && (
                <Modal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    title="Desativar Parâmetro"
                    footer={deleteModalFooter}
                    maxWidth="400px"
                >
                    <p>Tem certeza que deseja desativar este parâmetro de orçamento?</p>
                </Modal>
            )}

            <FilterBar>
                <div className={styles.filterRow}>
                    <div className={styles.filterGroup}>
                        <span className={styles.filterLabel}>
                            <FontAwesomeIcon icon={faFilter} />
                            Filtro:
                        </span>

                        <div className={styles.filterSelect}>
                            <Select value={typeFilter} onChange={handleTypeChange}>
                                <SelectOption value="Todos" label="Todos os tipos" />
                                <SelectOption value="true" label="Pré-orçamento" />
                                <SelectOption value="false" label="Custo Adicional" />
                            </Select>
                        </div>

                        <div className={styles.filterSelect}>
                            <Select value={statusFilter} onChange={handleStatusChange}>
                                <SelectOption value="Todos" label="Todos os status" />
                                <SelectOption value="ATIVO" label="Ativo" />
                                <SelectOption value="INATIVO" label="Inativo" />
                            </Select>
                        </div>
                    </div>

                    <div className={styles.searchBox}>
                        <SearchInput
                            onChange={handleSearchChange}
                            value={searchTerm}
                            placeholder="Buscar parâmetro"
                        />
                    </div>
                </div>
            </FilterBar>

            <BudgetParameterTable
                parameters={parameters}
                onEdit={(id) => navigate(`/configuracoes/parametros-orcamento/${id}`, { state: { edit: true } })}
                onDelete={handleDelete}
                onActivate={handleActivate}
                onRowClick={(id) => navigate(`/configuracoes/parametros-orcamento/${id}`, { state: { edit: false } })}
            />

            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </PageLayout>
    );
}