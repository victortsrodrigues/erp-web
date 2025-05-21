import { injectable, inject } from 'tsyringe';
import { PeopleRepository } from '../repositories/peopleRepository';

@injectable()
export class PeopleService {
  constructor(
    @inject(PeopleRepository)
    private readonly peopleRepository: PeopleRepository
  ) {}

  log = (name: string): void => {
    this.peopleRepository.log(name);
  }
}