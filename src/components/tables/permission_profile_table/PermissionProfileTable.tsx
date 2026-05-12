import { faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { PermissionProfileTableProps } from '../../../interfaces/properties/TableProps';
import styles from '../../../pages/config/permission_profiles/PermissionProfiles.module.css';
import SecureComponent from '../../security/SecureComponent';
import { IconButton } from '../../ui/Form';
import Table from '../Table';

const MODULE_LABELS: Record<string, string> = {
    CLIENT:        'Clientes',
    CLIENT_LIST:   'Clientes',
    PROJECT:       'Projetos',
    PROJECT_LIST:  'Projetos',
    SCHEDULE:      'Agenda',
    MATERIAL:      'Materiais',
    BUDGET:        'Orçamentos',
    CONFIGURATION: 'Configurações',
};

function translateModule(value: string): string {
    return MODULE_LABELS[value] ?? value;
}

export default function PermissionProfileTable({
    profiles,
    onEdit,
    onDelete,
    onRowClick,
}: PermissionProfileTableProps) {

    const headers = ['Nome', 'Módulo Principal', 'Ações'];

    return (
        <Table
            headers={headers}
            isEmpty={profiles.length === 0}
            emptyMessage="Nenhum perfil de permissão encontrado."
            className={styles.customTable}
        >
            {profiles.map((profile) => {
                const isAdmin = profile.role.toUpperCase() === 'ADMIN';

                const deleteTooltip = isAdmin
                    ? 'O perfil Administrador não pode ser excluído.'
                    : profile.inUse
                    ? `Este perfil não pode ser excluído pois está em uso por ${profile.userCount ?? 'um ou mais'} colaborador(es).`
                    : 'Excluir perfil';

                return (
                    <tr
                        key={profile.id}
                        onClick={() => onRowClick?.(profile.id)}
                        className={onRowClick ? styles.clickableRow : styles.defaultCursor}
                    >
                        <td>{profile.role}</td>

                        <td>{translateModule(profile.mainModule)}</td>

                        <td>
                            <div
                                className={styles.actions}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <SecureComponent permissions={['CONFIGURATION_UPDATE']}>
                                    <IconButton
                                        onClick={() => onEdit(profile.id)}
                                        icon={<FontAwesomeIcon icon={faPen} />}
                                        ariaLabel="Editar"
                                        functionality="edit"
                                        disabled={isAdmin}
                                        title={isAdmin ? 'O perfil Administrador não pode ser editado.' : 'Editar perfil'}
                                    />
                                </SecureComponent>

                                <SecureComponent permissions={['CONFIGURATION_DELETE']}>
                                    <IconButton
                                        onClick={() => onDelete(profile.id)}
                                        icon={<FontAwesomeIcon icon={faTrashCan} />}
                                        ariaLabel="Excluir"
                                        functionality="delete"
                                        disabled={isAdmin || profile.inUse}
                                        title={deleteTooltip}
                                    />
                                </SecureComponent>
                            </div>
                        </td>
                    </tr>
                );
            })}
        </Table>
    );
}