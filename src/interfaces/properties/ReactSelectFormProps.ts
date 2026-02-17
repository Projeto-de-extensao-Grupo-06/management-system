import type { MultiValue, SingleValue } from "react-select";

export interface AutoCompleteSelectOption {
  value: string;
  label: string;
}

export interface AutoCompleteSelectProps {
  options: AutoCompleteSelectOption[];
  value: SingleValue<AutoCompleteSelectOption> | MultiValue<AutoCompleteSelectOption>;
  onChange: (value: SingleValue<AutoCompleteSelectOption> | MultiValue<AutoCompleteSelectOption>) => void;
  placeholder?: string;
  isDisabled?: boolean;
  isMulti?: boolean;
}