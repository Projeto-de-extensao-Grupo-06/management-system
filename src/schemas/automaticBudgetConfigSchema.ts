import { z } from 'zod';

const positiveNumber = z.coerce
    .number()
    .min(0, 'O valor não pode ser negativo');

const percentNumber = z.coerce
    .number()
    .min(0,'O valor não pode ser negativo')
    .max(500,'O percentual não pode ser maior que 500%');

export const automaticBudgetConfigSchema = z.object({
    pricePerKwp: positiveNumber,
    energyTariff: positiveNumber,
    propertyTypeCasaTerrea: percentNumber,
    propertyTypeSobrado: percentNumber,
    propertyTypePredio: percentNumber,
    roofTypeMetalico: percentNumber,
    roofTypeCeramico: percentNumber,
    roofTypeFibrocimento: percentNumber,
    roofTypeLaje: percentNumber,
});

export type AutomaticBudgetConfigSchemaType = z.infer<typeof automaticBudgetConfigSchema>;