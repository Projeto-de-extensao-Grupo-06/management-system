import { faPen, faTrashCan, faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import usePermissions from '../../../hooks/usePermissions';
import type { MaterialTableProps } from '../../../interfaces/properties/TableProps';
import type { Material } from '../../../interfaces/types/Material';
import SecureComponent from '../../security/SecureComponent';
import { IconButton } from '../../ui/Form';
import Table from '../Table';
import styles from './MaterialTable.module.css';

export interface MaterialWithLinks extends Material {
    linksCount?: number;
}

export interface ExtendedMaterialTableProps extends Omit<MaterialTableProps, 'materials'> {
    materials: MaterialWithLinks[];
}

export default function MaterialTable({ materials, onEdit, onDelete, onRowClick }: ExtendedMaterialTableProps) {
    const permissions = usePermissions();
    const canManage = permissions.includes("BUDGET_UPDATE") || permissions.includes("BUDGET_DELETE");

    const getMetricLabel = (metric: string) => {
        switch (metric) {
            case 'UNIT': return 'Unidade';
            case 'METER': return 'Metro';
            case 'CENTIMETER': return 'Centímetro';
            default: return metric;
        }
    };

    const headers = [
        'Nome do Item',
        'Métrica/Unidade',
        <div style={{ textAlign: 'center' }}>Links de Compra</div>,
        ...(canManage ? [<div style={{ textAlign: 'center' }}>Ações</div>] : [])
    ];

    return (
        <Table
            headers={headers}
            isEmpty={materials.length === 0}
            emptyMessage="Nenhum material encontrado."
        >
            {materials.map((material) => (
                <tr
                    key={material.id}
                    onClick={() => onRowClick && onRowClick(material.id)}
                    className={onRowClick ? styles.clickableRow : styles.defaultCursor}
                >
                    <td className={styles.wrappingCell}>{material.name}</td>
                    <td>{getMetricLabel(material.metric)}</td>
                    <td style={{ textAlign: 'center' }}>
                        <div className={styles.linkInfo} style={{ justifyContent: 'center' }}>
                            <FontAwesomeIcon icon={faLink} />
                            <span>{material.linksCount !== undefined ? `${material.linksCount} Link(s)` : 'Links...'}</span>
                        </div>
                    </td>
                    <SecureComponent permissions={["BUDGET_UPDATE", "BUDGET_DELETE"]}>
                        <td style={{ textAlign: 'center' }}>
                            <div className={styles.actions} style={{ justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
                                <SecureComponent permissions={["BUDGET_UPDATE"]}>
                                    <IconButton
                                        onClick={() => onEdit(material.id)}
                                        icon={<FontAwesomeIcon icon={faPen} />}
                                        ariaLabel="Editar"
                                        functionality="edit"
                                    />
                                </SecureComponent>

                                <SecureComponent permissions={["BUDGET_DELETE"]}>
                                    <IconButton
                                        onClick={() => onDelete(material.id)}
                                        icon={<FontAwesomeIcon icon={faTrashCan} />}
                                        ariaLabel="Deletar"
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
