import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { BudgetMaterial } from "../../../../interfaces/types/Budget";
import styles from "../MaterialList.module.css";

interface MaterialCardProps {
    material: BudgetMaterial
}

export default function MaterialCard({ material }: MaterialCardProps) {
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
                    className={styles.input}
                    defaultValue={material.quantity}
                />

                <span>{material.url}</span>

                <span>
                    {material.unitPrice.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    })}
                </span>

                <FontAwesomeIcon icon={faTrash} className={styles.deleteIcon} />
            </div>
        </div>
    )
}