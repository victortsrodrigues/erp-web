import { z } from "zod";

export const updateCategorySchema = z.object({
  nome: z.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim()
    .refine((nome) => {
      // Validar caracteres permitidos
      return /^[a-zA-ZÀ-ÿ0-9\s\-_().]+$/.test(nome);
    }, {
      message: "Nome contém caracteres inválidos. Use apenas letras, números, espaços e pontuação básica"
    })
    .refine((nome) => {
      // Não pode ser apenas números
      return !/^\d+$/.test(nome);
    }, {
      message: "Nome da categoria não pode ser apenas números"
    })
    .refine((nome) => {
      // Não pode ter muitos espaços consecutivos
      return !/\s{3,}/.test(nome);
    }, {
      message: "Nome não pode ter mais de 2 espaços consecutivos"
    })
    .refine((nome) => {
      // Não pode começar ou terminar com caracteres especiais
      return /^[a-zA-ZÀ-ÿ0-9].*[a-zA-ZÀ-ÿ0-9]$/.test(nome) || nome.length <= 3;
    }, {
      message: "Nome deve começar e terminar com letra ou número"
    })
    .refine((nome) => {
      // Verificar palavras inadequadas
      const palavrasProibidas = ['admin','teste', 'test', 'exemplo', 'sample', 'temp', 'temporario'];
      return !palavrasProibidas.some(palavra => nome.toLowerCase().includes(palavra));
    }, {
      message: "Nome não pode conter palavras como 'teste', 'exemplo' ou 'temporário'"
    })
    .optional(),
  descricao: z.string()
    .max(500, "Descrição deve ter no máximo 500 caracteres")
    .optional()
    .nullable()
    .refine((desc) => {
      // Se fornecida, deve ter conteúdo útil
      if (desc && desc.trim().length > 0) {
        return desc.trim().length >= 5;
      }
      return true;
    }, {
      message: "Descrição deve ter pelo menos 5 caracteres quando fornecida"
    })
    .refine((desc) => {
      // Não pode ser apenas caracteres repetidos
      if (desc && desc.trim().length > 0) {
        return !/^(.)\1*$/.test(desc.trim());
      }
      return true;
    }, {
      message: "Descrição deve conter texto variado, não apenas caracteres repetidos"
    })
    .refine((desc) => {
      // Deve ter pelo menos 2 palavras se for longa
      if (desc && desc.trim().length > 20) {
        return desc.trim().split(/\s+/).length >= 2;
      }
      return true;
    }, {
      message: "Descrições longas devem conter pelo menos 2 palavras"
    }),
  cor: z.string()
    .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Cor deve estar no formato hexadecimal (#FFFFFF)")
    .optional()
    .nullable()
    .refine((cor) => {
      // Verificar se não é cor muito clara (luminância alta)
      if (!cor) return true;
      
      const hex = cor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 2), 16);
      const b = parseInt(hex.substring(4, 2), 16);
      
      // Calcular luminância
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      return luminance <= 0.85; // Não muito clara
    }, {      message: "Cor muito clara pode dificultar a leitura. Use cores mais escuras"
    })
});

export type UpdateCategoryDTO = z.infer<typeof updateCategorySchema>;
