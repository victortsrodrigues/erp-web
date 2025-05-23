import { z } from "zod"; 

export const updatePeopleSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').optional(),
  email: z.string().email('Email inválido').optional().nullable(),
  telefone: z.string().length(11, 'Telefone must have 11 digits').optional().nullable(),
  celular: z.string().length(11, 'Telefone must have 11 digits').optional().nullable(),
  dataNascimento: z.string().optional().nullable().transform(val => val ? new Date(val) : null),
  cpf: z.string().optional().nullable(),
  rg: z.string().optional().nullable(),
  endereco: z.string().optional().nullable(),
  bairro: z.string().optional().nullable(),
  cidade: z.string().optional().nullable(),
  estado: z.string().optional().nullable(),
  cep: z.string().optional().nullable(),
  observacoes: z.string().optional().nullable(),
  foto: z.string().optional().nullable(),
  ativo: z.boolean().optional(),
  categorias: z.array(z.string()).optional(),
  cargos: z.array(z.string()).optional(),
  camposAdicionais: z.record(z.string(), z.string()).optional()
});

export type UpdatePeopleDTO = z.infer<typeof updatePeopleSchema>;