import { useState } from "react";
import styles from "./BudgetParameters.module.css";
import CostRow from "./partials/CostRow";

interface CostItem {
  id: number;
  name: string;
  value: string;
  type: string;
}

export default function BudgetParameters() {
  const [extraCosts, setExtraCosts] = useState<CostItem[]>([]);

  function addCost() {
    setExtraCosts((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        value: "",
        type: "",
      },
    ]);
  }

  function removeCost(id: number) {
    setExtraCosts((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>
        ⏱ Custos e Serviços SolarWay
      </h2>

      <h3 className={styles.sectionTitle}>Custos Padrão</h3>

      {[1, 2].map((i) => (
        <CostRow key={i} />
      ))}

      <div className={styles.divider} />

      <h3 className={styles.sectionTitle}>Custos Extra</h3>

      {extraCosts.map((cost) => (
        <CostRow
          key={cost.id}
          onDelete={() => removeCost(cost.id)}
        />
      ))}

      <button className={styles.addButton} onClick={addCost}>
        + Adicionar Custo
      </button>
    </div>
  );
}