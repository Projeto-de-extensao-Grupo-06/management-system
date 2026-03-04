import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import type { ValueType } from "../../../../interfaces/types/Budget";
import {
  formatCurrencyBR,
  formatPercentageBR
} from "../../../../utils/maskUtils";
import TogglePercentAmount from "../../partials/TogglePercentAmount";
import styles from "../BudgetParameters.module.css";

interface CostRowProps {
  data?: {
    id: number | string;
    name: string;
    value: string;
    type: ValueType;
    fixed?: boolean;
  };
  onDelete?: () => void;
  onUpdate?: (field: string, value: any) => void;
  editing: boolean;
}

export default function CostRow({ onDelete, data, onUpdate, editing }: CostRowProps) {
  const isFixed = data?.fixed;

  const [rawValue, setRawValue] = useState(data?.value ?? "");
  const [localType, setLocalType] = useState<ValueType>(data?.type || "AMOUNT");
  const [isEditing, setIsEditing] = useState(false);

  function handleValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    const inputValue = e.target.value;
    const cleaned = inputValue.replace(/[^\d.,]/g, '');

    setRawValue(cleaned);

    if (onUpdate) {
      const numericStr = cleaned.replace(',', '.');
      const numericValue = parseFloat(numericStr) || 0;
      onUpdate('value', numericValue.toString());
    }
  }

  function handleTypeChange(newType: ValueType) {
    setLocalType(newType);
    setRawValue("");

    if (onUpdate) {
      onUpdate('type', newType);
      onUpdate('value', '');
    }
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (onUpdate) {
      onUpdate('name', e.target.value);
    }
  }

  function handleFocus() {
    setIsEditing(true);
  }

  function handleBlur() {
    setIsEditing(false);
  }

  function getDisplayValue() {
    if (!rawValue) return "";

    if (isEditing) {
      return rawValue;
    } else {
      if (localType === "AMOUNT") {
        return formatCurrencyBR(rawValue);
      } else {
        return formatPercentageBR(rawValue);
      }
    }
  }

  return (
    <div className={styles.row}>
      <div className={styles.inputs}>
        <div>
          <label>Nome</label>
          <input
            placeholder="Nome"
            defaultValue={data?.name}
            disabled={isFixed}
            onChange={handleNameChange}
          />
        </div>

        <div>
          <label>Valor</label>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0,00"
            value={getDisplayValue()}
            onChange={handleValueChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={!editing}
          />
        </div>

        <div>
          <label>Tipo</label>
          {isFixed ? (
            <input
              disabled
              value={localType === "PERCENT" ? "%" : "R$"}
            />
          ) : (
            <TogglePercentAmount
              value={localType === "PERCENT" ? "PERCENT" : "AMOUNT"}
              onChange={(newValue) => handleTypeChange(
                newValue === "PERCENT" ? "PERCENT" : "AMOUNT"
              )}
              editing={!editing}
            />
          )}
        </div>
      </div>

      {!isFixed && (
        <div className={styles.actions}>
          {editing &&
            <FontAwesomeIcon
              icon={faTrash}
              className={styles.delete}
              onClick={onDelete}
            />
          }
        </div>
      )}
    </div>
  );
}