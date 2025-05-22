import { CreatePeopleDTO } from "../dtos/createPeopleDTO"

export interface IPeopleService {
  log(name: string): void;
  createPeople(body: CreatePeopleDTO): Promise<void>;
}