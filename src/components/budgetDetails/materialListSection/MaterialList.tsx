import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Budget, BudgetMaterial } from "../../../interfaces/types/Budget";
import { Button } from "../../ui/Form";
import styles from "./MaterialList.module.css";
import MaterialCard from "./partials/MaterialCard";

interface MaterialListProps {
    materials: BudgetMaterial[];
    setBudget: React.Dispatch<React.SetStateAction<Budget>>;
    editing: boolean;
}

export default function MaterialList({ materials, setBudget, editing }: MaterialListProps) {
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
                        editing={editing}
                        key={material.materialUrlId}
                        material={material}
                        onChange={(e) =>
                            setBudget((prev) => ({
                                ...prev,
                                materials: prev.materials.map((m) =>
                                    m.materialUrlId === material.materialUrlId
                                        ? { ...m, quantity: Number(e.target.value) }
                                        : m
                                ),
                            }))
                        }
                        onDelete={() => setBudget((prev) => {
                            const copy = { ...prev };
                            copy.materials = copy.materials.filter((m) => m.materialUrlId !== material.materialUrlId);
                            return copy;
                        })}
                    />
                ))}
            </div>
        </div>
    );
}