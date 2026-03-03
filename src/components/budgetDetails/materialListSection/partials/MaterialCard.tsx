import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { BudgetMaterial } from "../../../../interfaces/types/Budget";
import styles from "../MaterialList.module.css";

interface MaterialCardProps {
    material: BudgetMaterial;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDelete: () => void;
    editing: boolean;
}

export default function MaterialCard({ material, onChange, onDelete, editing }: MaterialCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.gridHeader}>
                <span>Material</span>
                <span>Quantidade</span>
                <span>Fornecedor</span>
                <span>Preço Unit.</span>
            </div>

            <div className={styles.gridContent}>
                <span>{material.name}</span>

                <input
                    type="number"
                    className={styles.input}
                    defaultValue={material.quantity}
                    onChange={onChange}
                    disabled={!editing}
                    onBlur={(e) => {
                        if (Number(e.target.value) < 1) {
                            e.target.value = "1";
                            onChange(e);
                        };
                    }}
                />

                <span>{material.url}</span>

                <span>
                    {material.unitPrice.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                </span>

                {editing && <FontAwesomeIcon icon={faTrash} className={styles.deleteIcon} onClick={onDelete} />}
            </div>
        </div>
    )
}