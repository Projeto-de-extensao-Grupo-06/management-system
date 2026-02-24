import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import styles from "../BudgetParameters.module.css";

export default function CostRow({ onDelete }: { onDelete?: () => void }) {
  return (
    <div className={styles.row}>
      <div className={styles.inputs}>
        <div>
          <label>Nome</label>
          <input placeholder="Nome" />
        </div>

        <div>
          <label>Valor</label>
          <input placeholder="R$" />
        </div>

        <div>
          <label>Tipo</label>
          <input placeholder="Tipo" />
        </div>
      </div>

      <div className={styles.actions}>
        <FontAwesomeIcon
          icon={faTrash}
          className={styles.delete}
          onClick={onDelete}
        />

        <FontAwesomeIcon
          icon={faPen}
          className={styles.edit}
        />
      </div>
    </div>
  );
}   