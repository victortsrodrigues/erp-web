import { CreatePeopleDTO } from "../dtos/createPeopleDTO";
import { UpdatePeopleDTO } from "../dtos/updatePeopleDTO";
import { IPeopleModel } from "./IPeopleModel";

export interface IPeopleRepository {
  createPeople(data: CreatePeopleDTO): Promise<IPeopleModel>;
  findAllPeople(): Promise<IPeopleModel[]>;
  findPeopleById(id: string): Promise<IPeopleModel | null>;
  updatePeople(id: string, data: UpdatePeopleDTO): Promise<IPeopleModel>;
  deletePeople(id: string): Promise<void>;
  findPeopleByEmail(email: string): Promise<IPeopleModel | null>;
  findPeopleByCPF(cpf: string): Promise<IPeopleModel | null>;
  findPeopleByTelefone(telefone: string): Promise<IPeopleModel | null>;
  findPeopleByCelular(celular: string): Promise<IPeopleModel | null>;
  findPeopleByRG(rg: string): Promise<IPeopleModel | null>;
}