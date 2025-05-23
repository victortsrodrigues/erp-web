import { CreatePeopleDTO } from "../dtos/createPeopleDTO"
import { UpdatePeopleDTO } from "../dtos/updatePeopleDTO"

export interface IPeopleService {
  createPeople(body: CreatePeopleDTO): Promise<void>;
  findAllPeople(): Promise<any[]>;
  findPeopleById(id: string): Promise<any>;
  updatePeople(id: string, body: UpdatePeopleDTO): Promise<void>;
  deletePeople(id: string): Promise<void>;
}