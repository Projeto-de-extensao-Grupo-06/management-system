import type { MultiValue, SingleValue } from "react-select";

export interface AutoCompleteSelectOption {
  value: string;
  label: string;
}

export interface AutoCompleteSelectProps {
  options: AutoCompleteSelectOption[];
  value: SingleValue<AutoCompleteSelectOption>;
  onChange: (value: SingleValue<AutoCompleteSelectOption>) => void;
  placeholder?: string;
  isDisabled?: boolean;
}

export interface MultiSelectProps {
  options: AutoCompleteSelectOption[];
  value: MultiValue<AutoCompleteSelectOption>;
  onChange: (value: MultiValue<AutoCompleteSelectOption>) => void;
  placeholder?: string;
  isDisabled?: boolean;
}