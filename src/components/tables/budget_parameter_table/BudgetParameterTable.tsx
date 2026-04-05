import { faPen, faTrashCan, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
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
    onActivate,
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
            className={styles.customTable}
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
                        <span
                            className={
                                param.isPreBudget
                                    ? styles.badgePreBudget
                                    : styles.badgeAdditional
                            }
                        >
                            {param.isPreBudget
                                ? 'Pré-orçamento'
                                : 'Custo Adicional'}
                        </span>
                    </td>

                    <td>
                        {param.fixedValue.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })}
                    </td>

                    <td>
                        <span
                            className={
                                param.status === 'ATIVO'
                                    ? styles.statusATIVO
                                    : styles.statusINATIVO
                            }
                        >
                            {param.status === 'ATIVO'
                                ? 'Ativo'
                                : 'Inativo'}
                        </span>
                    </td>


                    {canManage && (
                        <td>
                            <div
                                className={styles.actions}
                                onClick={(e) => e.stopPropagation()}
                            >
                            
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
                                        onClick={() =>
                                            param.status === 'ATIVO'
                                                ? onDelete(param.id)
                                                : onActivate(param.id)
                                        }
                                        icon={
                                            <FontAwesomeIcon
                                                icon={param.status === 'ATIVO' ? faTrashCan : faCircleCheck}
                                            />
                                        }
                                        ariaLabel={param.status === 'ATIVO' ? 'Desativar' : 'Ativar'}
                                        functionality={param.status === 'ATIVO' ? 'delete' : 'edit'}
                                    />
                                </SecureComponent>
                            </div>
                        </td>

                    )}
                </tr>
            ))}
        </Table>
    );
}