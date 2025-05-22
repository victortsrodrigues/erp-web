import { CreatePeopleDTO } from "../dtos/createPeopleDTO"

export interface IPeopleService {
  log(name: string): void;
  create(body: CreatePeopleDTO): CreatePeopleDTO;
}