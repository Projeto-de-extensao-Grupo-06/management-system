import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { BudgetMaterial } from "../../../interfaces/types/Budget";
import { Button } from "../../ui/Form";
import styles from "./MaterialList.module.css";
import MaterialCard from "./partials/MaterialCard";

interface MaterialListProps {
    materials: BudgetMaterial[];
}

export default function MaterialList({ materials }: MaterialListProps) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <span className={styles.icon}>📄</span>
                    <h2>Lista de Materiais</h2>
                </div>

                <Button
                    className={styles.addButton}
                    text="Adicionar Material"
                    icon={<FontAwesomeIcon icon={faAdd} />}
                />
            </div>

            <div>
                {materials.map((material) => (
                    <MaterialCard
                        key={material.materialUrlId}
                        material={material}
                    />
                ))}
            </div>
        </div>
    );
}