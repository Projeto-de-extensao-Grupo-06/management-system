import { faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import usePermissions from '../../../hooks/usePermissions';
import type { PermissionProfileTableProps } from '../../../interfaces/properties/TableProps';
import styles from '../../../pages/config/permission_profiles/PermissionProfiles.module.css';
import SecureComponent from '../../security/SecureComponent';
import { IconButton } from '../../ui/Form';
import Table from '../Table';

export default function PermissionProfileTable({
    profiles,
    onEdit,
    onDelete,
    onRowClick,
}: PermissionProfileTableProps) {

    const permissions = usePermissions();

    // const canManage =
    //     permissions.includes('PERMISSION_PROFILE_UPDATE') ||
    //     permissions.includes('PERMISSION_PROFILE_DELETE');

    const headers = [
        'Nome',
        'Módulo Principal',
        // ...(canManage ? ['Ações'] : []),
    ];

    return (
        <Table
            headers={headers}
            isEmpty={profiles.length === 0}
            emptyMessage="Nenhum perfil de permissão encontrado."
            className={styles.customTable}
        >
            {profiles.map((profile) => {
                const isAdmin = profile.name === 'Administrador';

                return (
                    <tr
                        key={profile.id}
                        onClick={() => onRowClick?.(profile.id)}
                        className={onRowClick ? styles.clickableRow : styles.defaultCursor}
                    >
                        <td>{profile.name}</td>

                        <td>{profile.mainModule}</td>

                        {/* {canManage && ( */}
                            <td>
                                <div
                                    className={styles.actions}
                                    onClick={(e) => e.stopPropagation()}
                                >

                                    {/* <SecureComponent permissions={['PERMISSION_PROFILE_UPDATE']}> */}
                                        <IconButton
                                            onClick={() => onEdit(profile.id)}
                                            icon={<FontAwesomeIcon icon={faPen} />}
                                            ariaLabel="Editar"
                                            functionality="edit"
                                            disabled={isAdmin}
                                        />
                                    {/* </SecureComponent>

                                    <SecureComponent permissions={['PERMISSION_PROFILE_DELETE']}> */}
                                        <IconButton
                                            onClick={() => onDelete(profile.id)}
                                            icon={<FontAwesomeIcon icon={faTrashCan} />}
                                            ariaLabel="Excluir"
                                            functionality="delete"
                                            disabled={isAdmin || profile.inUse}
                                        />
                                    {/* </SecureComponent> */}

                                </div>
                            </td>
                        {/* ) */}
                        {/* } */}
                    </tr>
                );
            })}
        </Table>
    );
}