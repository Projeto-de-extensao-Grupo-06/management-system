import type { SingleValue } from "react-select";

export interface AutoCompleteSelectOption {
  value: string;
  label: string;
}

export interface AutoCompleteSelectProps {
  options: AutoCompleteSelectOption[];
  value: AutoCompleteSelectOption | null;
  onChange: (value: SingleValue<AutoCompleteSelectOption>) => void;
  placeholder?: string;
  isDisabled?: boolean;
}