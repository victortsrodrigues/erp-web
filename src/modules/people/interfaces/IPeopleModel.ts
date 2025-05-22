export interface IPeopleModel {
  id?: string;
  nome: string;
  email?: string;
  telefone?: string;
  celular?: string;
  dataNascimento?: Date;
  cpf?: string;
  rg?: string;
  endereco?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacoes?: string;
  foto?: string;
  ativo: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  categorias?: Array<{
    id: string;
    nome: string;
    descricao?: string;
    cor?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }>;

  cargos?: Array<{
    id: string;
    nome: string;
    descricao?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }>

  camposAdicionais?: Array<{
    id: string;   // id do registro em CampoAdicionalValor
    valor: string;
    campoAdicional: {
      id: string;
      nome: string;
      tipo: string;
      obrigatorio: boolean;
      opcoes?: string | null;
      createdAt: Date;
      updatedAt: Date;
    };
  }>;
}
