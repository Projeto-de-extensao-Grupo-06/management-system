import { useState } from "react";
import type { Budget } from "../../../interfaces/types/Budget";
import TogglePercentAmountAndMock from "../partials/TogglePercentAmountAndMock";
import type { DiscountType } from "../partials/TogglePercentAmountAndMock";
import styles from "./BudgetSummary.module.css";

interface Props {
    budget: Budget | null;
}

export default function BudgetSummary({ budget }: Props) {

    const [discountType, setDiscountType] = useState<DiscountType>(
        (budget?.discountType as DiscountType) ?? "AMOUNT"
    );

    function formatCurrency(value?: number) {
        if (!value) return "R$ 0,00";

        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
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
                            type="number"
                            value={budget?.discount ?? 0}
                            readOnly
                        />

                        <TogglePercentAmountAndMock
                            onChange={(v) => setDiscountType(v)}
                            value={discountType}
                        />
                    </div>
                </div>
            </div>

            {/* SUBTOTAL */}
            <div className={styles.subtotalRow}>
                <span className={styles.subtotalLabel}>Subtotal</span>

                <div className={styles.subtotalValue}>
                    {formatCurrency(budget?.subtotal)}
                </div>
            </div>

            {/* PREÇO FINAL */}
            <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Preço Final</span>

                <div className={styles.totalValue}>
                    {formatCurrency(budget?.totalCost)}
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.saveButton}>Salvar</button>

                <button className={styles.buyListButton}>
                    Gerar Lista de Compras
                </button>

                <button className={styles.pdfButton}>Baixar PDF</button>

                <button className={styles.botButton}>Enviar via Bot</button>
            </div>

        </div>
    );
}