import { z } from 'zod';

const positiveNumber = z.coerce
    .number()
    .min(0, 'O valor não pode ser negativo');

export const automaticBudgetConfigSchema = z.object({
    pricePerKwp: positiveNumber,
    energyTariff: positiveNumber,
    propertyTypeCasaTerrea: positiveNumber,
    propertyTypeSobrado: positiveNumber,
    propertyTypePredio: positiveNumber,
    roofTypeMetalico: positiveNumber,
    roofTypeCeramico: positiveNumber,
    roofTypeFibrocimento: positiveNumber,
    roofTypeLaje: positiveNumber,
});

export type AutomaticBudgetConfigSchemaType = z.infer<typeof automaticBudgetConfigSchema>;