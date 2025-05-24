import { z } from "zod";

export const updateCargoSchema = z.object({
  nome: z.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim()
    .optional(),
  descricao: z.string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional()
    .nullable()
});

export type UpdateCargoDTO = z.infer<typeof updateCargoSchema>;
