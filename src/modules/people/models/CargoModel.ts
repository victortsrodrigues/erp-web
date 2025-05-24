import { ICargoModel } from "../interfaces/ICargoModel";

export class CargoModel implements ICargoModel {
  id?: string;
  nome: string;
  descricao?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: ICargoModel) {
    this.id = data.id;
    this.nome = data.nome;
    this.descricao = data.descricao;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
