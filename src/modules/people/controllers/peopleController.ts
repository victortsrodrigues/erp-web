import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { IPeopleService } from "../interfaces/IPeopleService";
import { TOKENS } from "../../../common/tokens";
import { CreatePeopleDTO } from "../dtos/createPeopleDTO";

@injectable()
export class PeopleController {
  constructor(
    @inject(TOKENS.PeopleService)
    private readonly peopleService: IPeopleService
  ) {}

  log = (req: Request, res: Response): void => {
    const { name } = req.query;
    this.peopleService.log(name as string);
    res.status(200).send("Larissa linda");
  };

  create = async (req: Request, res: Response, next: Function) => {
    try {
      const body: CreatePeopleDTO = req.body.data;
      await this.peopleService.createPeople(body);
      res.status(201).json(`Created with body: ${JSON.stringify(body)}`);
    } catch (error) {
      next(error); // Encaminha o erro para o middleware global
    }
  };

  findAll = async (_req: Request, res: Response, next: Function) => {
    try {
      const people = await this.peopleService.findAllPeople();
      res.status(200).json(people);
    } catch (error) {
      next(error); // Encaminha o erro para o middleware global
    }
  }
}
