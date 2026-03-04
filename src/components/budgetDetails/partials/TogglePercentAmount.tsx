import { useState } from "react";
import styles from "./TogglePercentAmountAndMock.module.css";

export type CostType = "AMOUNT" | "PERCENT";

interface Props {
    value?: CostType;
    onChange?: (value: CostType) => void;
    editing: boolean;
}

export default function TogglePercentAmount({
    value = "AMOUNT",
    onChange,
    editing
}: Props) {

    const [selected, setSelected] = useState<CostType>(value);

    function handleSelect(v: CostType) {
        setSelected(v);
        onChange?.(v);
    }

    return (
        <div className={styles.container} style={{ pointerEvents: !editing ? "auto" : "none" }}>
            <div
                className={`${styles.option} ${selected === "AMOUNT" ? styles.active : ""
                    }`}
                onClick={() => handleSelect("AMOUNT")}
            >
                R$
            </div>

            <div
                className={`${styles.option} ${selected === "PERCENT" ? styles.active : ""
                    }`}
                onClick={() => handleSelect("PERCENT")}
            >
                %
            </div>
        </div>
    );
}