import { z } from "zod";

export const createPeopleSchema = z
  .object({
    nome: z.string().min(3, "Name must be at least 3 characters long").trim(),
    email: z
      .string()
      .email("Invalid email")
      .toLowerCase()
      .trim()
      .optional()
      .nullable(),
    telefone: z
      .string()
      .length(11, "Telefone must have 11 digits")
      .optional()
      .nullable(),
    celular: z.string().length(11, "Celular must have 11 digits"),
    dataNascimento: z
      .string()
      .optional()
      .nullable()
      .refine((val) => {
        if (!val) return true;
        const date = new Date(val);
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        return age <= 120 && age >= 0;
      }, {
        message: "Data de nascimento inválida (idade deve estar entre 0 e 120 anos)"
      })
      .transform((val) => val ? new Date(val) : null),
    cpf: z.string().length(11, "CPF must have 11 digits").optional().nullable(),
    rg: z.string().optional().nullable(),
    endereco: z
      .string()
      .min(3, "Address must be at least 3 characters long")
      .max(200, "Address too long")
      .optional()
      .nullable(),
    bairro: z
      .string()
      .min(3, "Bairro must be at least 3 characters long")
      .max(100, "Bairro too long")
      .optional()
      .nullable(),
    cidade: z
      .string()
      .min(3, "City must be at least 3 characters long")
      .max(100, "City too long")
      .optional()
      .nullable(),
    estado: z
      .string()
      .length(2, "State must have 2 characters (UF)")
      .toUpperCase()
      .optional()
      .nullable(),
    cep: z.string().length(8, "CEP must have 8 digits").optional().nullable(),
    observacoes: z
      .string()
      .max(1000, "Observations too long")
      .optional()
      .nullable(),
    foto: z.string().url("URL invalid").optional().nullable(),
    ativo: z.boolean().default(true),
    categorias: z.array(z.string().uuid("Invalid category uuid")).optional(),
    cargos: z.array(z.string().uuid("Invalid cargo uuid")).optional(),
    camposAdicionais: z.record(z.string().uuid("Invalid campo-adicional uuid"), z.string()).optional(),
  })
  .refine(
    (data) => {
      // Se informou endereço, cidade e estado são obrigatórios
      if (data.endereco && (!data.cidade || !data.estado)) {
        return false;
      }
      return true;
    },
    {
      message: "Cidade e Estado são obrigatórios quando endereço é informado",
      path: ["cidade"],
    }
  );

export type CreatePeopleDTO = z.infer<typeof createPeopleSchema>;
