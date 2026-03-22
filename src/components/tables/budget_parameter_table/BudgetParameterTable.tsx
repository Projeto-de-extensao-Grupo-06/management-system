import { faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import usePermissions from '../../../hooks/usePermissions';
import type { BudgetParameterTableProps } from '../../../interfaces/properties/TableProps';
import styles from '../../../pages/budget_parameters/BudgetParameters.module.css';
import SecureComponent from '../../security/SecureComponent';
import { IconButton } from '../../ui/Form';
import Table from '../Table';

export default function BudgetParameterTable({
    parameters,
    onEdit,
    onDelete,
    onRowClick,
}: BudgetParameterTableProps) {
    const permissions = usePermissions();
    const canManage =
        permissions.includes('BUDGET_UPDATE') ||
        permissions.includes('BUDGET_DELETE');

    const headers = [
        'Nome',
        'Métrica',
        'Tipo',
        'Valor Base',
        'Status',
        ...(canManage ? ['Ações'] : []),
    ];

    return (
        <Table
            headers={headers}
            isEmpty={parameters.length === 0}
            emptyMessage="Nenhum parâmetro de orçamento encontrado."
        >
            {parameters.map((param) => (
                <tr
                    key={param.id}
                    onClick={() => onRowClick?.(param.id)}
                    className={onRowClick ? styles.clickableRow : styles.defaultCursor}
                >
                    <td>{param.name}</td>
                    <td>{param.metric}</td>
                    <td>
                        <span className={param.is_pre_budget ? styles.badgePreBudget : styles.badgeAdditional}>
                            {param.is_pre_budget ? 'Pré-orçamento' : 'Custo Adicional'}
                        </span>
                    </td>
                    <td>
                        {param.fixed_value.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })}
                    </td>
                    <td>
                        <span className={param.status === 'ATIVO' ? styles.statusATIVO : styles.statusINATIVO}>
                            {param.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                        </span>
                    </td>
                    <SecureComponent permissions={['BUDGET_UPDATE', 'BUDGET_DELETE']}>
                        <td>
                            <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                                <SecureComponent permissions={['BUDGET_UPDATE']}>
                                    <IconButton
                                        onClick={() => onEdit(param.id)}
                                        icon={<FontAwesomeIcon icon={faPen} />}
                                        ariaLabel="Editar"
                                        functionality="edit"
                                    />
                                </SecureComponent>
                                <SecureComponent permissions={['BUDGET_DELETE']}>
                                    <IconButton
                                        onClick={() => onDelete(param.id)}
                                        icon={<FontAwesomeIcon icon={faTrashCan} />}
                                        ariaLabel="Desativar"
                                        functionality="delete"
                                    />
                                </SecureComponent>
                            </div>
                        </td>
                    </SecureComponent>
                </tr>
            ))}
        </Table>
    );
}