import { faPen, faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { Resolver } from 'react-hook-form';
import PageLayout from '../../../components/layout/PageLayout';
import SecureComponent from '../../../components/security/SecureComponent';
import { Alert } from '../../../components/ui/Alert';
import { Button, Input } from '../../../components/ui/Form';
import useAutomaticBudgetConfig from '../../../hooks/useAutomaticBudgetConfig';
import {
    automaticBudgetConfigSchema,
    type AutomaticBudgetConfigSchemaType,
} from '../../../schemas/automaticBudgetConfigSchema';
import styles from './AutomaticBudgetConfig.module.css';

export default function AutomaticBudgetConfig() {
    const { config, loading, alert, setAlert, saveConfig } = useAutomaticBudgetConfig();
    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<AutomaticBudgetConfigSchemaType>({
        resolver: zodResolver(automaticBudgetConfigSchema) as Resolver<AutomaticBudgetConfigSchemaType>,
        defaultValues: {
            pricePerKwp: 0,
            energyTariff: 0,
            propertyTypeCasaTerrea: 0,
            propertyTypeSobrado: 0,
            propertyTypePredio: 0,
            roofTypeMetalico: 0,
            roofTypeCeramico: 0,
            roofTypeFibrocimento: 0,
            roofTypeLaje: 0,
        },
    });

    useEffect(() => {
        if (config) {
            reset(config);
        }
    }, [config, reset]);

    const onSubmit = (data: AutomaticBudgetConfigSchemaType) => {
        setAlert(null);
        saveConfig(data)
            .then(() => {
                setIsEditing(false);
                setAlert({ message: 'Configurações salvas com sucesso!', type: 'success' });
                setTimeout(() => setAlert(null), 5000);
            })
            .catch((e: Error) => {
                setAlert({ message: e.message, type: 'error' });
            });
    };

    const handleCancel = () => {
        if (config) reset(config);
        setIsEditing(false);
    };

    if (loading) return <div>Carregando...</div>;

    const propertyRows = [
        { label: 'Casa Térrea', field: 'propertyTypeCasaTerrea' as const },
        { label: 'Sobrado', field: 'propertyTypeSobrado' as const },
        { label: 'Prédio / Comercial', field: 'propertyTypePredio' as const },
    ];

    const roofRows = [
        { label: 'Metálico', field: 'roofTypeMetalico' as const },
        { label: 'Cerâmico', field: 'roofTypeCeramico' as const },
        { label: 'Fibrocimento', field: 'roofTypeFibrocimento' as const },
        { label: 'Laje', field: 'roofTypeLaje' as const },
    ];

    return (
        <PageLayout
            title="Parâmetros de Orçamento Automático"
            backButton={true}
            rightActions={
                isEditing ? (
                    <>
                        <Button
                            text="Cancelar"
                            width="fit-content"
                            onClick={handleCancel}
                            ariaLabel="Cancelar edição"
                            className={styles.cancelButton}
                        />
                        <Button
                            text="Salvar Parâmetros"
                            icon={<FontAwesomeIcon icon={faSave} />}
                            onClick={() => handleSubmit(onSubmit)()}
                            width="fit-content"
                            ariaLabel="Salvar parâmetros"
                        />
                    </>
                ) : (
                    <SecureComponent permissions={['CONFIGURATION_WRITE']}>
                        <Button
                            text="Editar"
                            icon={<FontAwesomeIcon icon={faPen} />}
                            onClick={() => setIsEditing(true)}
                            width="fit-content"
                            ariaLabel="Editar parâmetros"
                        />
                    </SecureComponent>
                )
            }
        >
            {alert && (
                <div className={styles.alertWrapper}>
                    <Alert message={alert.message} type={alert.type} />
                </div>
            )}

            <div className={styles.card}>
                <h3 className={styles.sectionTitle}>Parâmetros de Custo Base</h3>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Preço por Watt-pico (R$/Wp) *</label>
                    <Input
                        {...register('pricePerKwp')}
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Ex: 3.20"
                        readOnly={!isEditing}
                        onKeyDown={(e) => {
                            if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                        }}
                    />
                    <span className={styles.hint}>
                        Este é o principal multiplicador para calcular o valor base do investimento.
                    </span>
                    {errors.pricePerKwp && (
                        <span className={styles.error}>{errors.pricePerKwp.message}</span>
                    )}
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Tarifa Média de Energia (R$/kWh) *</label>
                    <Input
                        {...register('energyTariff')}
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Ex: 0.98"
                        readOnly={!isEditing}
                        onKeyDown={(e) => {
                            if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                        }}
                    />
                    <span className={styles.hint}>
                        Este valor é usado para calcular a economia mensal estimada na conta de luz do cliente.
                    </span>
                    {errors.energyTariff && (
                        <span className={styles.error}>{errors.energyTariff.message}</span>
                    )}
                </div>
            </div>

            <div className={styles.card}>
                <h3 className={styles.sectionTitle}>Ajuste por Tipo de Imóvel</h3>
                <table className={styles.adjustTable}>
                    <thead>
                        <tr>
                            <th>Tipo de Imóvel</th>
                            <th>Acréscimo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {propertyRows.map(({ label, field }) => (
                            <tr key={field}>
                                <td>{label}</td>
                                <td>
                                    <div className={styles.inputWrapper}>
                                        <Input
                                            {...register(field)}
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="0"
                                            readOnly={!isEditing}
                                            onKeyDown={(e) => {
                                                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                                            }}
                                        />
                                        <span className={styles.suffix}>%</span>
                                    </div>
                                    {errors[field] && (
                                        <span className={styles.error}>{errors[field]?.message}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.card}>
                <h3 className={styles.sectionTitle}>Ajuste por Tipo de Telhado</h3>
                <table className={styles.adjustTable}>
                    <thead>
                        <tr>
                            <th>Tipo de Telhado</th>
                            <th>Acréscimo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roofRows.map(({ label, field }) => (
                            <tr key={field}>
                                <td>{label}</td>
                                <td>
                                    <div className={styles.inputWrapper}>
                                        <Input
                                            {...register(field)}
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="0"
                                            readOnly={!isEditing}
                                            onKeyDown={(e) => {
                                                if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
                                            }}
                                        />
                                        <span className={styles.suffix}>%</span>
                                    </div>
                                    {errors[field] && (
                                        <span className={styles.error}>{errors[field]?.message}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </PageLayout>
    );
}