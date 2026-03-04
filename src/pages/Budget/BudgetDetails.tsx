import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import BudgetParameters from "../../components/budgetDetails/budgetParameters/BudgetParameters";
import BudgetSummary from "../../components/budgetDetails/budgetSummary/BudgetSummary";
import MaterialList from "../../components/budgetDetails/materialListSection/MaterialList";
import PageHeader from "../../components/layout/PageHeader";
import type { Budget } from "../../interfaces/types/Budget";
import BudgetService from "../../services/BudgetService";
import { calculateBudgetTotals } from "../../utils/budgetCalc";
import styles from "./BudgetDetails.module.css";

const budgetService = new BudgetService();

export default function BudgetDetails() {
  const [budget, setBudget] = useState<Budget>({
    id: 0,
    totalCost: 0,
    subtotal: 0,
    discount: 0,
    discountType: "AMOUNT",
    finalBudget: false,
    materials: [],
    fixedParameters: [],
    personalizedParameters: [],
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const isFirstRender = useRef(true);

  const { id } = useParams();
  const projectId = Number(id);

  useEffect(() => {
    async function load() {
      try {
        const data = await budgetService.getProjectBudget(projectId);
        if (data) {
          setBudget(data);
        } else {
            const newBudget = await budgetService.createProjectBudget(projectId, budget);
            
            if(newBudget) {
                setBudget(newBudget);
            }
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [budget.id]);

  async function updateBudget() {
    await budgetService.patchBudget(projectId, budget);
  }

  async function updateFixedParameters() {
    await budgetService.patchFixed(projectId, budget.fixedParameters);
  }

  async function updatePersonalizedParameters() {
    const budgetSaved = await budgetService.patchPersonalized(
      projectId,
      budget.personalizedParameters,
    );

    setBudget((prev) => {
      return {
        ...prev,
        personalizedParameters: budgetSaved.personalizedParameters,
      };
    });
  }

  async function updateMaterials() {
    await budgetService.patchMaterials(projectId, budget.materials);
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!isEditing && budget.id > 0) {
      updateBudget();
      updateFixedParameters();
      updatePersonalizedParameters();
      updateMaterials();
    }
  }, [isEditing]);

  useEffect(() => {
    const updatedBudget = calculateBudgetTotals(budget);

    if (
      updatedBudget.totalCost !== budget.totalCost ||
      updatedBudget.subtotal !== budget.subtotal
    ) {
      setBudget((prev) => ({
        ...prev,
        totalCost: updatedBudget.totalCost,
        subtotal: updatedBudget.subtotal,
      }));
    }
  }, [
    budget.discount,
    budget.discountType,
    budget.fixedParameters,
    budget.personalizedParameters,
    budget.materials,
  ]);

  if (loading) return <>Carregando...</>;

  return (
    <>
      <PageHeader title="Gerenciar Orçamento" />

      <div className={styles.layout}>
        <div className={styles.left}>
          <MaterialList
            projectId={projectId}
            editing={isEditing}
            setBudget={setBudget}
            materials={budget?.materials ?? []}
          />
          <div className={styles.summary}>
            <BudgetSummary
              budget={budget}
              setBudget={setBudget}
              editing={isEditing}
              setEditing={setIsEditing}
            />
          </div>
        </div>

        <div className={styles.right}>
          <BudgetParameters
            projectId={projectId}
            setBudget={setBudget}
            editing={isEditing}
            budget={budget}
          />
        </div>
      </div>
    </>
  );
}
