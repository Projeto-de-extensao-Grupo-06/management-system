import { faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type Client from '../../interfaces/types/Client';
import styles from '../../pages/Clients/Clients.module.css';
import { IconButton } from '../Form';

interface ClientTableProps {
    clients: Client[];
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
}

export default function ClientTable({ clients, onEdit, onDelete }: ClientTableProps) {
    if (clients.length === 0) {
        return (
            <div className={`${styles.tableWrapper} ${styles.card}`}>
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-light)' }}>
                    Nenhum cliente encontrado.
                </div>
            </div>
        );
    }

    return (
        <div className={`${styles.tableWrapper} ${styles.card}`}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Nome do Cliente</th>
                        <th>E-mail</th>
                        <th>Telefone</th>
                        <th>Cidade/Estado</th>
                        <th>Data de Cadastro</th>
                        <th>Status</th>
                        <th>Operação</th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map((client) => (
                        <tr key={client.id}>
                            <td>{client.name}</td>
                            <td>{client.email}</td>
                            <td>{client.phone}</td>
                            <td>{client.mainAddress ? `${client.mainAddress.city} / ${client.mainAddress.state}` : '-'}</td>
                            <td>{client.createdAt ? new Date(client.createdAt).toLocaleDateString('pt-BR') : '-'}</td>
                            <td>{client.status}</td>
                            <td>
                                <div className={styles.actions}>
                                    <IconButton
                                        onClick={() => onEdit(client.id)}
                                        icon={<FontAwesomeIcon icon={faPen} />}
                                        ariaLabel="Editar"
                                        functionality="edit"
                                    />
                                    <IconButton
                                        onClick={() => onDelete(client.id)}
                                        icon={<FontAwesomeIcon icon={faTrashCan} />}
                                        ariaLabel="Deletar"
                                        functionality="delete"
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
