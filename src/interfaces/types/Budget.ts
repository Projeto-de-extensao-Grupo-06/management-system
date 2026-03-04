export type ValueType = "AMOUNT" | "PERCENT";

export interface Budget {
  id: number;
  totalCost: number;
  subtotal: number;
  discount: number;
  discountType: "PERCENT" | "AMOUNT" | "MOCK_TOTAL";
  finalBudget: boolean;
  materials: BudgetMaterial[];
  fixedParameters: FixedParameter[];
  personalizedParameters: PersonalizedParameter[];
}

export interface BudgetMaterial {
  materialUrlId: number;
  name: string;
  url: string;
  unitPrice: number;
  quantity: number;
}

export interface FixedParameter {
  parameterName: string;
  valueType: ValueType;
  value: number;
}

export interface PersonalizedParameter {
  id: number;
  name: string;
  type: ValueType;
  value: number;
}
