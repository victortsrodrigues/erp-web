import { CreatePeopleDTO } from "../dtos/createPeopleDTO";
import { UpdatePeopleDTO } from "../dtos/updatePeopleDTO";
import { IPeopleModel } from "./IPeopleModel";

export interface IPeopleRepository {
  log(name: string): void;
  createPeople(data: CreatePeopleDTO): Promise<IPeopleModel>;
  findAllPeople(): Promise<IPeopleModel[]>;
  findPeopleById(id: string): Promise<IPeopleModel | null>;
  updatePeople(id: string, data: UpdatePeopleDTO): Promise<IPeopleModel>;
  deletePeople(id: string): Promise<void>;
}