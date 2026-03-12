import { z } from "zod";

export const materialUrlSchema = z.object({
  url: z.string().url("Insira um link válido").min(1, "O link é obrigatório"),
  price: z.number({
    error: "Preço deve ser um número",
  }).min(0, "O preço de venda não pode ser negativo"),
});

export type MaterialUrlSchemaType = z.infer<typeof materialUrlSchema>;
