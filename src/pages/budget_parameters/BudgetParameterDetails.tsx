import { faPen, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import BudgetParameterForm from '../../components/forms/budget_parameter_form/BudgetParameterForm';
import PageLayout from '../../components/layout/PageLayout';
import SecureComponent from '../../components/security/SecureComponent';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Form';
import useBudgetParameterDetail from '../../hooks/useBudgetParameterDetail';
import type { BudgetParameterFormRef } from '../../interfaces/properties/FormProps';
import type { BudgetParameterSchemaType } from '../../schemas/budgetParameterSchema';
import styles from './BudgetParameters.module.css';

export default function BudgetParameterDetails() {
    const { id } = useParams();
    const location = useLocation();
    const formRef = useRef<BudgetParameterFormRef>(null);

    const [isEditing, setIsEditing] = useState(location.state?.edit || false);

    const numericId = Number(id);
    const { parameter, loading, alert, setAlert, updateParameter } =
        useBudgetParameterDetail(Number.isFinite(numericId) && numericId > 0 ? numericId : NaN);

    const handleSave = () => {
        formRef.current?.submit();
    };

    const onFormSubmit = (data: BudgetParameterSchemaType) => {
        if (!id || !parameter) return;

        updateParameter(data)
            .then(() => {
                setIsEditing(false);
                setAlert({ message: 'Parâmetro atualizado com sucesso!', type: 'success' });
                setTimeout(() => setAlert(null), 5000);
            })
            .catch((err: Error) => {
                setAlert({ message: err.message, type: 'error' });
            });
    };

    if (loading) return <div>Carregando...</div>;

    const defaultFormValues: Partial<BudgetParameterSchemaType> = parameter ? {
        name: parameter.name,
        description: parameter.description ?? '',
        metric: parameter.metric,
        isPreBudget: parameter.isPreBudget,
        fixedValue: parameter.fixedValue,
        status: parameter.status,
        options: parameter.options?.map(o => ({
            id: o.id,
            type: o.type,
            additionTax: o.additionTax,
            fixedCost: o.fixedCost,
        })) ?? [],
    } : {};

    return (
        <PageLayout
            title="Detalhes do Parâmetro"
            backButton={true}
            rightActions={
                isEditing ? (
                    <>
                        <Button
                            text="Cancelar"
                            width="fit-content"
                            onClick={() => setIsEditing(false)}
                            ariaLabel="Cancelar Edição"
                            className={styles.cancelButton}
                        />
                        <Button
                            text="Salvar"
                            icon={<FontAwesomeIcon icon={faSave} />}
                            onClick={handleSave}
                            width="fit-content"
                            ariaLabel="Salvar"
                        />
                    </>
                ) : (
                    <SecureComponent permissions={['BUDGET_UPDATE']}>
                        <Button
                            text="Editar"
                            icon={<FontAwesomeIcon icon={faPen} />}
                            onClick={() => setIsEditing(true)}
                            width="fit-content"
                            ariaLabel="Editar"
                        />
                    </SecureComponent>
                )
            }
        >
            {alert && (
                <div style={{ marginBottom: '1rem' }}>
                    <Alert message={alert.message} type={alert.type} />
                </div>
            )}

            <div className={styles.card}>
                <BudgetParameterForm
                    ref={formRef}
                    onSubmit={onFormSubmit}
                    defaultValues={defaultFormValues}
                    readOnly={!isEditing}
                />
            </div>
        </PageLayout>
    );
}