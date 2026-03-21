import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import type { Budget, BudgetMaterial } from "../../../interfaces/types/Budget";
import BudgetService from "../../../services/BudgetService";
import Modal from "../../dialogs/modal/Modal";
import { Button } from "../../ui/Form";
import styles from "./MaterialList.module.css";
import AddMaterial from "./partials/AddMaterial/AddMaterial";
import MaterialCard from "./partials/MaterialCard";

export const budgetService = new BudgetService();

interface MaterialListProps {
    materials: BudgetMaterial[];
    setBudget: React.Dispatch<React.SetStateAction<Budget>>;
    budget: Budget;
    editing: boolean;
    projectId: number;
}

export default function MaterialList({ materials, setBudget, budget, editing, projectId }: MaterialListProps) {
    const [isModalOpen, setModalOpen] = useState(false);


    function removeMaterial(material: BudgetMaterial) {
        budgetService.deleteMaterialUrl(budget.id, material.materialUrlId);
        
        setBudget((prev) => {
            const copy = { ...prev };
            copy.materials = copy.materials.filter((m) => m.materialUrlId !== material.materialUrlId);
            return copy;
        })
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.title}>
                    <span className={styles.icon}>📄</span>
                    <h2>Lista de Materiais</h2>
                </div>

                {
                    editing &&
                    <Button
                        className={styles.addButton}
                        text="Adicionar Material"
                        icon={<FontAwesomeIcon icon={faAdd} />}
                        onClick={() => setModalOpen(true)}
                    />
                }
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
                        onDelete={() => removeMaterial(material)}
                    />
                ))}

                {materials.length === 0 && <span>Nenhum material adicionado</span>}
            </div>

            <Modal isOpen={isModalOpen} title="Adicionar Material" onClose={() => setModalOpen(false)} maxWidth="80%">
                <AddMaterial budget={budget} projectId={projectId} materials={materials} setBudget={setBudget}></AddMaterial>
            </Modal>
        </div>
    );
}