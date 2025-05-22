import { CreatePeopleDTO } from "../dtos/createPeopleDTO"

export interface IPeopleService {
  log(name: string): void;
  createPeople(body: CreatePeopleDTO): Promise<void>;
  findAllPeople(): Promise<any[]>;
  findPeopleById(id: string): Promise<any>;
}