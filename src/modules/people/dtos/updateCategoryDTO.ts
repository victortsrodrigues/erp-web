import { z } from "zod";

export const updateCategorySchema = z.object({
  nome: z.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim()
    .optional(),
  descricao: z.string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional()
    .nullable(),
  cor: z.string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor deve estar no formato hexadecimal (#FFFFFF)")
    .optional()
    .nullable()
});

export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;
