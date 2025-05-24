import { ICampoAdicionalModel } from "../interfaces/ICampoAdicionalModel";

export class CampoAdicionalModel implements ICampoAdicionalModel {
  id?: string;
  nome: string;
  tipo: string;
  obrigatorio: boolean;
  opcoes?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: ICampoAdicionalModel) {
    this.id = data.id;
    this.nome = data.nome;
    this.tipo = data.tipo;
    this.obrigatorio = data.obrigatorio;
    this.opcoes = data.opcoes;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Método utilitário para parsear opções JSON
  public getOpcoesArray(): string[] | null {
    if (!this.opcoes) return null;
    try {
      return JSON.parse(this.opcoes);
    } catch {
      return null;
    }
  }

  // Método utilitário para validar se o tipo permite opções
  public isSelectType(): boolean {
    return this.tipo === 'select';
  }
}
