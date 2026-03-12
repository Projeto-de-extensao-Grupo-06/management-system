import { z } from "zod";

export const materialSchema = z.object({
  name: z.string().min(3, "Nome do material deve ter no mínimo 3 caracteres"),
  description: z.string().optional(),
  metric: z.enum(["UNIT", "METER", "CENTIMETER"], {
    error: "Selecione uma unidade de medida válida"
  }),
});

export type MaterialSchemaType = z.infer<typeof materialSchema>;
