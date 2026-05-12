import { faPen, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import usePermissions from "../../../hooks/usePermissions";
import type { CoworkerTableProps } from "../../../interfaces/properties/TableProps";
import styles from "../../../pages/clients/Clients.module.css";
import SecureComponent from "../../security/SecureComponent";
import { IconButton } from "../../ui/Form";
import Table from "../Table";

export default function CoworkerTable({
  coworkers,
  onEdit,
  onDelete,
  onRowClick,
}: CoworkerTableProps) {
  const permissions = usePermissions();
  const canManageCoworkers = permissions.includes("ROLE_ADMIN");

  const headers = [
    "Nome do Colaborador",
    "E-mail",
    "Telefone",
    "Grupo de Permissao",
    ...(canManageCoworkers ? ["Operação"] : []),
  ];

  return (
    <Table
      headers={headers}
      isEmpty={coworkers.length === 0}
      emptyMessage="Nenhum colaborador encontrado."
    >
      {coworkers.map((coworker) => (
        <tr
          key={coworker.id}
          onClick={() => onRowClick && onRowClick(coworker.id)}
          className={onRowClick ? styles.clickableRow : styles.defaultCursor}
        >
          <td>{`${coworker.firstName} ${coworker.lastName}`.trim()}</td>
          <td>{coworker.email}</td>
          <td>{coworker.phone}</td>
          <td>{coworker.permissionGroupRole ?? "-"}</td>

          <SecureComponent permissions={["ROLE_ADMIN"]}>
            <td>
              <div
                className={styles.actions}
                onClick={(e) => e.stopPropagation()}
              >
                <SecureComponent permissions={["ROLE_ADMIN"]}>
                  <IconButton
                    onClick={() => onEdit(coworker.id)}
                    icon={<FontAwesomeIcon icon={faPen} />}
                    ariaLabel="Editar"
                    functionality="edit"
                  />
                </SecureComponent>

                <SecureComponent permissions={["ROLE_ADMIN"]}>
                  <IconButton
                    onClick={() => onDelete(coworker.id)}
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
