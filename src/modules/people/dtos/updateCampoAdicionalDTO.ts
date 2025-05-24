import { z } from "zod";

const tiposPermitidos = ["text", "number", "date", "select", "checkbox"] as const;

export const updateCampoAdicionalSchema = z.object({
  nome: z.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim()
    .optional(),
  tipo: z.enum(tiposPermitidos, {
    errorMap: () => ({ message: "Tipo deve ser: text, number, date, select ou checkbox" })
  }).optional(),
  obrigatorio: z.boolean().optional(),
  opcoes: z.string()
    .optional()
    .nullable()
});

export type UpdateCampoAdicionalDTO = z.infer<typeof updateCampoAdicionalSchema>;
