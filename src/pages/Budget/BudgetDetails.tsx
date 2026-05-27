import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import BudgetParameters from "../../components/budgetDetails/budgetParameters/BudgetParameters";
import BudgetSummary from "../../components/budgetDetails/budgetSummary/BudgetSummary";
import MaterialList from "../../components/budgetDetails/materialListSection/MaterialList";
import PageLayout from "../../components/layout/PageLayout";
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
  const navigate = useNavigate();

  const { id } = useParams();
  const projectId = Number(id);

  useEffect(() => {
    async function load() {
      try {
        const data = await budgetService.getProjectBudget(projectId);
        if (data) {
          setBudget(data);
        } else {
          const newBudget = await budgetService.createProjectBudget(
            projectId,
            budget,
          );

          if (newBudget) {
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

    async function saveAll() {
      if (!isEditing && budget.id > 0) {
        try {
          await updateBudget();
          await updateFixedParameters();
          await updatePersonalizedParameters();
          await updateMaterials();
        } catch (error) {
          console.error("Erro ao salvar orçamento", error);
        }
      }
    }

    saveAll();
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
    <PageLayout title="Gerenciar Orçamento" backButton={true}>
      <div className={styles.layout}>
        <div className={styles.left}>
          <MaterialList
            projectId={projectId}
            editing={isEditing}
            setBudget={setBudget}
            budget={budget}
            materials={budget?.materials ?? []}
          />
          <div className={styles.summary}>
            <BudgetSummary
              budget={budget}
              setBudget={setBudget}
              editing={isEditing}
              setEditing={setIsEditing}
              projectId={projectId}
              onGenerateBuyList={() => navigate(`/projetos/${projectId}/materiais`)}
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
    </PageLayout>
  );
}
