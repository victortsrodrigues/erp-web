import { z } from "zod";

const tiposPermitidos = ["text", "number", "date", "select", "checkbox"] as const;

export const createCampoAdicionalSchema = z.object({
  nome: z.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres")
    .trim()
    .refine((nome) => {
      // Adicionar validação de caracteres (nova)
      return /^[a-zA-ZÀ-ÿ0-9\s\-_]+$/.test(nome);
    }, {
      message: "Nome contém caracteres inválidos. Use apenas letras, números, espaços, hífens e underscores"
    }),
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
      const opcoesParsed = JSON.parse(data.opcoes);
           
      // Deve ser um array
      if (!Array.isArray(opcoesParsed)) {
        return false;
      }
      
      // Não pode estar vazio para select
      if (data.tipo === 'select' && opcoesParsed.length === 0) {
        return false;
      }
      
      // Todas as opções devem ser strings não vazias
      const opcoesInvalidas = opcoesParsed.filter(opcao => 
        typeof opcao !== 'string' || opcao.trim().length === 0
      );
      if (opcoesInvalidas.length > 0) {
        return false;
      }
      
      // Não pode ter duplicatas
      const opcoesUnicas = [...new Set(opcoesParsed.map(opcao => opcao.trim().toLowerCase()))];
      if (opcoesUnicas.length !== opcoesParsed.length) {
        return false;
      }
      
      // Limite máximo de opções
      if (opcoesParsed.length > 50) {
        return false;
      }
      
      // Tamanho máximo de cada opção
      const opcaoMuitoLonga = opcoesParsed.find(opcao => opcao.length > 100);
      if (opcaoMuitoLonga) {
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }
  
  // Para outros tipos, opções não devem ser fornecidas
  if (data.tipo !== 'select' && data.opcoes) {
    return false;
  }
  
  return true;
}, {
  message: "Para campos do tipo 'select', opções são obrigatórias e devem estar em formato JSON válido. Opções devem ser um array de strings únicas, com máximo 50 itens e 100 caracteres cada",
  path: ["opcoes"]
});

export type CreateCampoAdicionalDTO = z.infer<typeof createCampoAdicionalSchema>;
