import { useEffect, useState } from "react";
import BudgetSummary from "../../components/budgetDetails/budgetSummary/BudgetSummary";
import MaterialList from "../../components/budgetDetails/materialListSection/MaterialList";
import PageHeader from "../../components/layout/PageHeader";
import type { Budget } from "../../interfaces/types/Budget";
import BudgetService from "../../services/BudgetService";
import BudgetParameters from "../../components/budgetDetails/budgetParameters/BudgetParameters";

const budgetService = new BudgetService();

import styles from "./BudgetDetails.module.css";

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

            <div className={styles.layout}>
                
                <div className={styles.left}>
                    <MaterialList materials={budget?.materials ?? []} />
                    <BudgetSummary budget={budget} />
                </div>

                <div className={styles.right}>
                    <BudgetParameters />
                </div>

            </div>
        </>
    );
}