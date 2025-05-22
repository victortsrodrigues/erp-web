import { IPeopleModel } from "../interfaces/IPeopleModel";

export class PeopleModel implements IPeopleModel {
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
  }>;

  camposAdicionais?: Array<{
    id: string;
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

  constructor(data: IPeopleModel) {
    this.id = data.id;
    this.nome = data.nome;
    this.email = data.email;
    this.telefone = data.telefone;
    this.celular = data.celular;
    this.dataNascimento = data.dataNascimento;
    this.cpf = data.cpf;
    this.rg = data.rg;
    this.endereco = data.endereco;
    this.bairro = data.bairro;
    this.cidade = data.cidade;
    this.estado = data.estado;
    this.cep = data.cep;
    this.observacoes = data.observacoes;
    this.foto = data.foto;
    this.ativo = data.ativo ?? true;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;

    this.categorias = data.categorias;
    this.cargos = data.cargos;
    this.camposAdicionais = data.camposAdicionais;
  }
}