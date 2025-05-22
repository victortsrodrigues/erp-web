import { injectable, inject } from "tsyringe";
import { IPeopleService } from "../interfaces/IPeopleService";
import { IPeopleRepository } from "../interfaces/IPeopleRepository";
import { TOKENS } from "../../../common/tokens";
import { CreatePeopleDTO } from "../dtos/createPeopleDTO";

@injectable()
export class PeopleService implements IPeopleService {
  constructor(
    @inject(TOKENS.PeopleRepository)
    private readonly peopleRepository: IPeopleRepository
  ) {}

  log = (name: string): void => {
    this.peopleRepository.log(name);
  };

  createPeople = async (body: CreatePeopleDTO): Promise<void> => {
    await this.peopleRepository.createPeople(body);
  }
}
