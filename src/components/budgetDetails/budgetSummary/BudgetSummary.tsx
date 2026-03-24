import React, { useState } from "react";
import type { Budget } from "../../../interfaces/types/Budget";
import PdfModal from "../../pdfModal/PdfModal";
import TogglePercentAmountAndMock from "../partials/TogglePercentAmountAndMock";
import styles from "./BudgetSummary.module.css";

interface Props {
    budget: Budget;
    setBudget: React.Dispatch<React.SetStateAction<Budget>>;
    editing: boolean;
    setEditing: React.Dispatch<React.SetStateAction<boolean>>;
    projectId: number;
    onGenerateBuyList: () => void;
}

export default function BudgetSummary({
    budget,
    editing,
    setEditing,
    setBudget,
    projectId,
    onGenerateBuyList,
}: Props) {
    const [modalOpen, setModalOpen] = useState(false);

    function formatCurrency(value?: number) {
        if (!value) return "R$ 0,00";

        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    if (budget.id === 0) {
        return <span>Carregando...</span>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Fechamento Financeiro</h2>
            </div>

            <div className={styles.formRow}>
                <div className={styles.field}>
                    <label className={styles.label}>Desconto</label>

                    <div className={styles.discountContent}>
                        <input
                            className={styles.input}
                            type="text"
                            value={budget.discount}
                            onChange={(e) =>
                                setBudget((prev) => {
                                    const value = e.target.value;

                                    const numberRegex = /^\d*\.?\d*$/;

                                    if (!numberRegex.test(value)) {
                                        return prev;
                                    }

                                    return {
                                        ...prev,
                                        discount: value === "" ? 0 : Number(value),
                                    };
                                })
                            }
                            disabled={!editing}
                        />

                        <TogglePercentAmountAndMock
                            onChange={(v) => {
                                setBudget((prev) => {
                                    return {
                                        ...prev,
                                        discountType: v,
                                    };
                                });
                            }}
                            value={budget.discountType}
                            editing={editing}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.subtotalRow}>
                <span className={styles.subtotalLabel}>Subtotal</span>

                <div className={styles.subtotalValue}>
                    {formatCurrency(budget?.subtotal)}
                </div>
            </div>

            <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Preço Final</span>

                <div className={styles.totalValue}>
                    {formatCurrency(budget?.totalCost)}
                </div>
            </div>

            <div className={styles.actions}>
                <button
                    className={styles.saveButton}
                    onClick={() => setEditing(!editing)}
                >
                    {editing ? "Salvar" : "Editar"}
                </button>

                {
                    !editing && (
                        <>
                            <button className={styles.buyListButton} onClick={onGenerateBuyList}>
                                Gerar Lista de Compras
                            </button>

                            <button className={styles.pdfButton} onClick={() => setModalOpen(true)}>
                                Baixar PDF
                            </button>

                            <button className={styles.botButton}>Enviar via Bot</button>
                        </>
                    )
                }
            </div>

            <PdfModal 
                projectId={projectId} 
                budget={budget} 
                modalOpen={modalOpen} 
                setModalOpen={setModalOpen} 
            />
        </div>
    );
}
