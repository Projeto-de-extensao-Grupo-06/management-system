import { useEffect, useState } from "react";
import BudgetSummary from "../../components/budgetDetails/budgetSummary/BudgetSummary";
import MaterialList from "../../components/budgetDetails/materialListSection/MaterialList";
import PageHeader from "../../components/layout/PageHeader";
import type { Budget } from "../../interfaces/types/Budget";
import BudgetService from "../../services/BudgetService";

const budgetService = new BudgetService();

export default function BudgetDetails() {
    const [budget, setBudget] = useState<Budget | null>(null);
    const [loading, setLoading] = useState(true);

    const projectId = 1;

    useEffect(() => {
        async function load() {
            try {
                const data = await budgetService.getProjectBudget(projectId);
                setBudget(data);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    if (loading) return <>Carregando...</>;

    return (
        <>
            <PageHeader title="Gerenciar Orçamento" />
            <MaterialList materials={budget?.materials ?? []} />
            <BudgetSummary budget={budget} />
        </>
    );
}