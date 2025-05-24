import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { ICampoAdicionalService } from "../interfaces/ICampoAdicionalService";
import { TOKENS } from "../../../common/tokens";
import { CreateCampoAdicionalDTO } from "../dtos/createCampoAdicionalDTO";
import { UpdateCampoAdicionalDTO } from "../dtos/updateCampoAdicionalDTO";

@injectable()
export class CampoAdicionalController {
  constructor(
    @inject(TOKENS.CampoAdicionalService)
    private readonly campoAdicionalService: ICampoAdicionalService
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: CreateCampoAdicionalDTO = req.body.data ?? req.body;
      const campo = await this.campoAdicionalService.createCampoAdicional(body);
      res.status(201).json(campo);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const campos = await this.campoAdicionalService.findAllCampoAdicional();
      res.status(200).json(campos);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const campo = await this.campoAdicionalService.findCampoAdicionalById(id);
      res.status(200).json(campo);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const body: UpdateCampoAdicionalDTO = req.body.data ?? req.body;
      const campo = await this.campoAdicionalService.updateCampoAdicional(id, body);
      res.status(200).json(campo);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.campoAdicionalService.deleteCampoAdicional(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
