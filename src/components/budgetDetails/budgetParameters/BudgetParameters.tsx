import React, { useEffect, useState } from "react";
import type { Budget, PersonalizedParameter, ValueType } from "../../../interfaces/types/Budget";
import BudgetParametersService from "../../../services/BudgetService";
import styles from "./BudgetParameters.module.css";
import CostRow from "./partials/CostRow";

const parametersService = new BudgetParametersService();

interface CostItem {
  id: number | string;
  name: string;
  value: string;
  type: ValueType;
  fixed?: boolean;
}

interface BudgetParametersProps {
  budget: Budget;
  editing: boolean;
  setBudget: React.Dispatch<React.SetStateAction<Budget>>;
  projectId: number;
}

export default function BudgetParameters({ budget, editing, setBudget, projectId }: BudgetParametersProps) {
  const [fixedCosts, setFixedCosts] = useState<CostItem[]>([]);
  const [extraCosts, setExtraCosts] = useState<CostItem[]>(() => {
    if (!budget) return [];

    return budget.personalizedParameters.map((p) => ({
      id: p.id,
      name: p.name,
      value: String(p.value),
      type: p.type,
    }));
  });

  useEffect(() => {
    const mapped = fixedCosts.map(v => ({
      parameterName: v.name,
      value: Number(v.value),
      valueType: v.type
    }));

    const isEqual =
      JSON.stringify(mapped) === JSON.stringify(budget.fixedParameters);

    if (isEqual) return;

    setBudget(prev => ({
      ...prev,
      fixedParameters: mapped
    }));

  }, [fixedCosts]);

  useEffect(() => {
    const mapped: PersonalizedParameter[] = extraCosts.map(v => ({
      id: Number(v.id),
      name: v.name,
      type: v.type,
      value: Number(v.value)
    }));

    const isEqual =
      JSON.stringify(mapped) === JSON.stringify(budget.personalizedParameters);

    if (isEqual) return;

    setBudget(prev => ({
      ...prev,
      personalizedParameters: mapped
    }));

  }, [extraCosts]);

  useEffect(() => {
    if (editing) return;

    const reload = () => {
      setExtraCosts(budget.personalizedParameters.map((v) => ({ id: v.id, name: v.name, type: v.type, value: String(v.value), fixed: false })));
    }

    reload();
  }, [editing, budget.personalizedParameters]);

  async function loadFixedParameters() {
    const definitions = await parametersService.getFixedDefinitions();

    const mapped: CostItem[] = definitions.map((def) => {

      const existing = budget?.fixedParameters.find(
        (p) => p.parameterName === def.name
      );

      return {
        id: def.name,
        name: def.name,
        value: existing ? String(existing.value) : "",
        type: def.type,
        fixed: true,
      };
    });

    setFixedCosts(mapped);
  }

  useEffect(() => {
    async function load() {
      if (!budget?.id) return;
      await loadFixedParameters();
    }

    load()
  }, [budget.id]);

  function addCost() {
    setExtraCosts((prev) => [
      ...prev,
      {
        id: -Math.floor(Math.random() * 10000) - 1,
        name: "",
        value: "",
        type: "AMOUNT",
      },
    ]);
  }

  function removeCost(id: number) {
    console.log("Deletanto o ID: ", id)
    if (id > 0) {
      parametersService.deletePersonalizedParameter(projectId, id)
    }
    setExtraCosts((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className={styles.card}>
      <h2 className={styles.title}>
        ⏱ Custos e Serviços SolarWay
      </h2>

      <h3 className={styles.sectionTitle}>
        Custos Padrão
      </h3>

      {fixedCosts.map((cost) => (
        <CostRow
          key={cost.id}
          data={cost}
          editing={editing}
          onUpdate={(_field, value) => {
            const parameterIndex = fixedCosts.findIndex(p => p.id === cost.id);
            setFixedCosts(prev => {
              const copy = [...prev];

              copy[parameterIndex] = {
                ...copy[parameterIndex],
                value
              }

              return copy;
            });
          }}
        />
      ))}

      <div className={styles.divider} />

      <h3 className={styles.sectionTitle}>
        Custos Extra
      </h3>

      {extraCosts.map((cost, index) => (
        <CostRow
          key={index}
          data={cost}
          onDelete={() => removeCost(Number(cost.id))}
          editing={editing}
          onUpdate={(field, value) => {
            setExtraCosts((prev) => {
              const copy = [...prev];

              const index = copy.findIndex(p => p.id === cost.id);

              if (field === "name") {
                copy[index] = {
                  ...copy[index],
                  name: value
                }
              } else if (field === "value") {
                copy[index] = {
                  ...copy[index],
                  value: value
                }
              } else {
                copy[index] = {
                  ...copy[index],
                  type: value
                }
              }

              return copy;

            });
          }}
        />
      ))}

      {
        extraCosts.length === 0 &&
        <span>Nenhum custo adicional</span>
      }

      {
        editing &&
        <button
          className={styles.addButton}
          onClick={addCost}
        >
          + Adicionar Custo
        </button>
      }
    </div>
  );
}