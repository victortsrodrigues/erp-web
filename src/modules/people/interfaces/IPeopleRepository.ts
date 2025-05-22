import { CreatePeopleDTO } from "../dtos/createPeopleDTO";
// import { IPeopleModel } from "./IPeopleModel";

export interface IPeopleRepository {
  log(name: string): void;
  createPeople(data: CreatePeopleDTO): Promise<void>;
}