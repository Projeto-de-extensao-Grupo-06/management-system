import { type Budget } from "../interfaces/types/Budget";

function safe(n?: number) {
  return n ?? 0;
}

export function calculateBudgetTotals(budget: Budget): Budget {
  if (!budget) return budget;

  const materials = budget.materials ?? [];
  const fixed = budget.fixedParameters ?? [];
  const personalized = budget.personalizedParameters ?? [];

  const totalMaterialCost = materials.reduce((sum, m) => {
    return sum + safe(m.unitPrice) * safe(m.quantity);
  }, 0);

  const totalAmountFixed = fixed
    .filter(p => p.valueType === "AMOUNT")
    .reduce((sum, p) => sum + safe(p.value), 0);

  const totalPercentFixed = fixed
    .filter(p => p.valueType === "PERCENTAGE")
    .reduce((sum, p) => sum + safe(p.value), 0);

  const totalAmountPersonalized = personalized
    .filter(p => p.type === "AMOUNT")
    .reduce((sum, p) => sum + safe(p.value), 0);

  const totalPercentPersonalized = personalized
    .filter(p => p.type === "PERCENTAGE")
    .reduce((sum, p) => sum + safe(p.value), 0);

  let subtotal =
    totalMaterialCost +
    totalAmountFixed +
    totalAmountPersonalized;

  const totalPercent =
    totalPercentFixed +
    totalPercentPersonalized;

  subtotal = subtotal * (1 + totalPercent / 100);

  const discount = safe(budget.discount);

  let totalCost = subtotal;

  switch (budget.discountType) {
    case "PERCENT":
      totalCost = subtotal * (1 - discount / 100);
      break;

    case "AMOUNT":
      totalCost = subtotal - discount;
      break;

    case "MOCK_TOTAL":
      totalCost = discount;
      break;
  }

  return {
    ...budget,
    subtotal,
    totalCost,
  };
}