import { z } from "zod";

const tiposPermitidos = ["text", "number", "date", "select", "checkbox"] as const;

export const createCampoAdicionalSchema = z.object({
  nome: z.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim(),
  tipo: z.enum(tiposPermitidos, {
    errorMap: () => ({ message: "Tipo deve ser: text, number, date, select ou checkbox" })
  }),
  obrigatorio: z.boolean().default(false),
  opcoes: z.string()
    .optional()
    .nullable()
}).refine((data) => {
  // Se o tipo for 'select', opções são obrigatórias
  if (data.tipo === 'select' && !data.opcoes) {
    return false;
  }
  // Se opções foram fornecidas, validar se é JSON válido
  if (data.opcoes) {
    try {
      JSON.parse(data.opcoes);
      return true;
    } catch {
      return false;
    }
  }
  return true;
}, {
  message: "Para campos do tipo 'select', opções são obrigatórias e devem estar em formato JSON válido",
  path: ["opcoes"]
});

export type CreateCampoAdicionalDTO = z.infer<typeof createCampoAdicionalSchema>;
