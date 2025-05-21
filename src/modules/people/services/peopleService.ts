import { injectable, inject } from "tsyringe";
import { IPeopleService } from "../interfaces/IPeopleService";
import { IPeopleRepository } from "../interfaces/IPeopleRepository";
import { TOKENS } from "../../../common/tokens";

@injectable()
export class PeopleService implements IPeopleService {
  constructor(
    @inject(TOKENS.PeopleRepository)
    private readonly peopleRepository: IPeopleRepository
  ) {}

  log = (name: string): void => {
    this.peopleRepository.log(name);
  };
}
