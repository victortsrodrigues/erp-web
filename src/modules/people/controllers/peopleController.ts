import { injectable, inject } from "tsyringe";
import { Request, Response } from "express";
import { IPeopleService } from "../interfaces/IPeopleService";
import { TOKENS } from "../../../common/tokens";

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
}
