import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { ICargoService } from "../interfaces/ICargoService";
import { TOKENS } from "../../../common/tokens";
import { CreateCargoDTO } from "../dtos/createCargoDTO";
import { UpdateCargoDTO } from "../dtos/updateCargoDTO";

@injectable()
export class CargoController {
  constructor(
    @inject(TOKENS.CargoService)
    private readonly cargoService: ICargoService
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: CreateCargoDTO = req.body.data ?? req.body;
      const cargo = await this.cargoService.createCargo(body);
      res.status(201).json(cargo);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const cargos = await this.cargoService.findAllCargo();
      res.status(200).json(cargos);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const cargo = await this.cargoService.findCargoById(id);
      res.status(200).json(cargo);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const body: UpdateCargoDTO = req.body.data ?? req.body;
      const cargo = await this.cargoService.updateCargo(id, body);
      res.status(200).json(cargo);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.cargoService.deleteCargo(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
