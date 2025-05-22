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
}
