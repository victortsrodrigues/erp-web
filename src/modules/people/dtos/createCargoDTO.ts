import { z } from "zod";

const palavrasReservadas = ['admin', 'root', 'system', 'null', 'undefined'];

export const createCargoSchema = z.object({
  nome: z.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim()
    .refine((nome) => {
      // Validar caracteres permitidos (mais permissivo para cargos)
      return /^[a-zA-ZÀ-ÿ0-9\s\-_().]+$/.test(nome);
    }, {
      message: "Nome contém caracteres inválidos. Use apenas letras, números, espaços e pontuação básica"
    })
    .refine((nome) => {
      // Não pode ser apenas números
      return !/^\d+$/.test(nome);
    }, {
      message: "Nome do cargo não pode ser apenas números"
    })
    .refine((nome) => {
      // Não pode ter muitos espaços consecutivos
      return !/\s{3,}/.test(nome);
    }, {
      message: "Nome não pode ter mais de 2 espaços consecutivos"
    })
    .refine((nome) => {
      // Não pode conter palavras reservadas
      return !palavrasReservadas.some((palavra) => nome.toLowerCase().includes(palavra));
    }, {
      message: "Nome do cargo contém palavras reservadas do sistema"
    }),
  descricao: z.string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional()
    .nullable()
    .refine((desc) => {
      // Se fornecida, deve ter conteúdo útil
      if (desc && desc.trim().length > 0) {
        return desc.trim().length >= 10;
      }
      return true;
    }, {
      message: "Descrição deve ter pelo menos 10 caracteres quando fornecida"
    })
    .refine((desc) => {
      // validar se não e apenas espaços ou caracteres repetidos
      if (desc && (/^(.)\1*$/.test(desc?.trim()) || desc?.trim().split(' ').every(word => word === ''))) {
        return false;
      }
      return true;
    })
});

export type CreateCargoDTO = z.infer<typeof createCargoSchema>;
