import { faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { ClientTableProps } from '../../../interfaces/properties/TableProps';
import styles from '../../../pages/clients/Clients.module.css';
import SecureComponent from '../../security/SecureComponent';
import { IconButton } from '../../ui/Form';
import Table from '../Table';

export default function ClientTable({ clients, onEdit, onDelete, onRowClick }: ClientTableProps) {
    const headers = [
        'Nome do Cliente',
        'E-mail',
        'Telefone',
        'Cidade/Estado',
        'Data de Cadastro',
        'Operação'
    ];

    return (
        <Table
            headers={headers}
            isEmpty={clients.length === 0}
            emptyMessage="Nenhum cliente encontrado."
        >
            {clients.map((client) => (
                <tr
                    key={client.id}
                    onClick={() => onRowClick && onRowClick(client.id)}
                    className={onRowClick ? styles.clickableRow : styles.defaultCursor}
                >
                    <td>{client.name}</td>
                    <td>{client.email}</td>
                    <td>{client.phone}</td>
                    <td>{client.mainAddress ? `${client.mainAddress?.city} / ${client.mainAddress?.state}` : '-'}</td>
                    <td>{client.createdAt ? new Date(client.createdAt).toLocaleDateString('pt-BR') : '-'}</td>
                    <td>
                        <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
                            <SecureComponent permissions={["CLIENT_UPDATE"]}>
                                <IconButton
                                    onClick={() => onEdit(client.id)}
                                    icon={<FontAwesomeIcon icon={faPen} />}
                                    ariaLabel="Editar"
                                    functionality="edit"
                                />
                            </SecureComponent>

                            <SecureComponent permissions={["CLIENT_DELETE"]}>
                                <IconButton
                                    onClick={() => onDelete(client.id)}
                                    icon={<FontAwesomeIcon icon={faTrashCan} />}
                                    ariaLabel="Deletar"
                                    functionality="delete"
                                />
                            </SecureComponent>

                        </div>
                    </td>
                </tr>
            ))}
        </Table>
    );
}
