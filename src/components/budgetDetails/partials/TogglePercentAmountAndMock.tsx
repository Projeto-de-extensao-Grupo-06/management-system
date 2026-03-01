import { useState } from "react";
import styles from "./TogglePercentAmountAndMock.module.css";

export type DiscountType = "AMOUNT" | "PERCENT" | "MOCK_TOTAL";

interface Props {
    value?: DiscountType;
    onChange?: (value: DiscountType) => void;
    editing: boolean;
}

export default function TogglePercentAmountAndMock({
    value = "AMOUNT",
    onChange,
    editing
}: Props) {

    const [selected, setSelected] = useState<DiscountType>(value);

    function handleSelect(v: DiscountType) {
        setSelected(v);
        onChange?.(v);
    }

    return (
        <div className={styles.container} style={{ pointerEvents: editing ? "auto" : "none" }}>
            <div
                className={`${styles.option} ${selected === "AMOUNT" ? styles.active : ""}`}
                onClick={() => handleSelect("AMOUNT")}
            >
                R$
            </div>

            <div
                className={`${styles.option} ${selected === "PERCENT" ? styles.active : ""}`}
                onClick={() => handleSelect("PERCENT")}
            >
                %
            </div>

            <div
                className={`${styles.option} ${selected === "MOCK_TOTAL" ? styles.active : ""}`}
                onClick={() => handleSelect("MOCK_TOTAL")}
            >
                Total
            </div>
        </div>
    );
}