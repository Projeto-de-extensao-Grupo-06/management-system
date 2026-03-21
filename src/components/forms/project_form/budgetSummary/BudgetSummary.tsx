import { faDollarSign, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router";
import type { Budget } from "../../../../interfaces/types/Budget";
import BudgetService from "../../../../services/BudgetService";
import SecureComponent from "../../../security/SecureComponent";
import styles from "./BudgetSummary.module.css";
import PdfModal from "../../../pdfModal/PdfModal";

interface BudgetSummaryProps {
    projectId: number;
}

export default function BudgetSummary({ projectId }: BudgetSummaryProps) {
    const [modalOpen, setModalOpen] = useState(false);

    const budgetService = useMemo(() => new BudgetService(), []);
    const navigate = useNavigate();

    const [budget, setBudget] = useState<Budget | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBudget() {
            try {
                const data = await budgetService.getProjectBudget(projectId);
                setBudget(data);
            } catch (error) {
                console.error("Erro ao buscar orçamento", error);
            } finally {
                setLoading(false);
            }
        }

        fetchBudget();
    }, [projectId, budgetService]);

    function handleManage() {
        navigate(`/projetos/${projectId}/orcamento`)
    }

    if (loading) {
        return <div className={styles.wrapper}>Carregando orçamento...</div>;
    }

    const formattedTotal =
        budget?.totalCost.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        }) ?? null;

    const budgetLabel = budget?.finalBudget
        ? "Orçamento Final"
        : "Pré-Orçamento";

    return (
        <SecureComponent permissions={["BUDGET_READ"]}>
            <div className={styles.wrapper}>
                <div className={styles.sectionHeader}>
                    <FontAwesomeIcon icon={faDollarSign} />
                    <span>Orçamento</span>
                </div>

                <div className={styles.card}>
                    <div className={styles.left}>
                        <div className={styles.iconCircle}>
                            <FontAwesomeIcon icon={faCheck} />
                        </div>

                        <div>
                            {budget ? (
                                <>
                                    <h2 className={styles.amount}>{formattedTotal}</h2>
                                    <span className={styles.activeLabel}>
                                        {budgetLabel}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <h2 className={styles.noBudgetTitle}>
                                        Nenhum orçamento cadastrado
                                    </h2>
                                    <span className={styles.noBudgetSubtitle}>
                                        Crie um orçamento para este projeto.
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className={styles.actions}>
                        <button
                            className={styles.manageButton}
                            onClick={handleManage}
                        >
                            {budget ? "Gerenciar Orçamento" : "Criar Orçamento"}
                        </button>

                        {budget && (
                            <button
                                className={styles.downloadButton}
                                onClick={() => setModalOpen(true)}
                            >
                                Baixar PDF
                            </button>
                        )}
                    </div>
                </div>

                <PdfModal
                    projectId={projectId}
                    budget={budget!}
                    modalOpen={modalOpen}
                    setModalOpen={setModalOpen}
                />
            </div>
        </SecureComponent>

    );
}
