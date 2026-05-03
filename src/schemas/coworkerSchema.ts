import { z } from "zod";

const coworkerBaseSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(20, "Nome deve ter no máximo 20 caracteres"),
  secondName: z
    .string()
    .trim()
    .min(3, "Sobrenome deve ter pelo menos 3 caracteres")
    .max(20, "Sobrenome deve ter no máximo 20 caracteres"),
  email: z
    .string()
    .trim()
    .email("E-mail inválido")
    .min(1, "E-mail é obrigatório"),
  phone: z.string().trim().min(1, "Telefone é obrigatório"),
  permissionGroupRole: z
    .string()
    .trim()
    .min(1, "Perfil de permissão é obrigatório"),
});

const validateBaseCoworkerFields = (
  data: z.infer<typeof coworkerBaseSchema>,
  ctx: z.RefinementCtx,
) => {
  const firstName = data.firstName.trim();
  const secondName = data.secondName.trim();
  const phoneDigits = data.phone.replace(/\D/g, "");

  if (!/^[A-Za-z]+$/.test(firstName)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Nome deve conter apenas letras, sem espaços ou números",
      path: ["firstName"],
    });
  }

  if (!/^[A-Za-z]+$/.test(secondName)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Sobrenome deve conter apenas letras, sem espaços ou números",
      path: ["secondName"],
    });
  }

  if (phoneDigits.length < 10 || phoneDigits.length > 11) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Telefone deve ter DDD e 10 ou 11 dígitos",
      path: ["phone"],
    });
  }
};

export const coworkerSchema = coworkerBaseSchema
  .extend({
    password: z.string().trim().min(1, "Senha é obrigatória"),
  })
  .superRefine((data, ctx) => {
    validateBaseCoworkerFields(data, ctx);

    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[\S]{8,}$/.test(
        data.password,
      )
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Senha deve ter ao menos 8 caracteres, com letra maiúscula, minúscula, número e caractere especial",
        path: ["password"],
      });
    }
  });

export const coworkerEditSchema = coworkerBaseSchema
  .extend({
    permissionGroupRole: z
      .string()
      .trim()
      .min(1, "Perfil de permissão é obrigatório"),
  })
  .superRefine(validateBaseCoworkerFields);

export type CoworkerSchemaType = z.infer<typeof coworkerSchema>;
export type CoworkerEditSchemaType = z.infer<typeof coworkerEditSchema>;
