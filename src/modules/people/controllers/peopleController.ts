import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { IPeopleService } from "../interfaces/IPeopleService";
import { TOKENS } from "../../../common/tokens";
import { CreatePeopleDTO } from "../dtos/createPeopleDTO";
import { UpdatePeopleDTO } from "../dtos/updatePeopleDTO";

@injectable()
export class PeopleController {
  constructor(
    @inject(TOKENS.PeopleService)
    private readonly peopleService: IPeopleService
  ) {}

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

  findById = async (req: Request, res: Response, next: Function) => {
    try {
      const { id } = req.params;
      const people = await this.peopleService.findPeopleById(id);
      res.status(200).json(people);
    } catch (error) {
      next(error); // Encaminha o erro para o middleware global
    }
  }

  update = async (req: Request, res: Response, next: Function) => {
    try {
      const { id } = req.params;
      const body: UpdatePeopleDTO = req.body.data;
      await this.peopleService.updatePeople(id, body);
      res.status(200).json(`Updated with body: ${JSON.stringify(body)}`);
    } catch (error) {
      next(error); // Encaminha o erro para o middleware global
    }
  }

  delete = async (req: Request, res: Response, next: Function) => {
    try {
      const { id } = req.params;
      await this.peopleService.deletePeople(id);
      res.status(200).json(`Deleted with id: ${id}`);
    } catch (error) {
      next(error); // Encaminha o erro para o middleware global
    }
  }
}
