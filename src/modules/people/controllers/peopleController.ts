import { injectable, inject } from 'tsyringe';
import { Request, Response } from 'express';
import { PeopleService } from '../services/peopleService';

@injectable()
export class PeopleController {
  constructor(
    @inject(PeopleService)
    private readonly peopleService: PeopleService
  ) {}

  log = (req: Request, res: Response): void => {
    const { name } = req.query;
    this.peopleService.log(name as string);
    res.status(200).send('Larissa linda');
  };
}