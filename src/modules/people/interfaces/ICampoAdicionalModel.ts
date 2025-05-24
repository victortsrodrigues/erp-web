export interface ICampoAdicionalModel {
  id?: string;
  nome: string;
  tipo: string;
  obrigatorio: boolean;
  opcoes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
