import { ICategoryModel } from "../interfaces/ICategoryModel";

export class CategoryModel implements ICategoryModel {
  id?: string;
  nome: string;
  descricao?: string;
  cor?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: ICategoryModel) {
    this.id = data.id;
    this.nome = data.nome;
    this.descricao = data.descricao;
    this.cor = data.cor;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
