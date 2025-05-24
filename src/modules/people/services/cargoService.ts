import { injectable, inject } from "tsyringe";
import { ICargoService } from "../interfaces/ICargoService";
import { ICargoRepository } from "../interfaces/ICargoRepository";
import { ICargoModel } from "../interfaces/ICargoModel";
import { TOKENS } from "../../../common/tokens";
import { CreateCargoDTO } from "../dtos/createCargoDTO";
import { UpdateCargoDTO } from "../dtos/updateCargoDTO";
import { AppError } from "../../../common/errors/appError";

@injectable()
export class CargoService implements ICargoService {
  constructor(
    @inject(TOKENS.CargoRepository)
    private readonly cargoRepository: ICargoRepository
  ) {}

  createCargo = async (body: CreateCargoDTO): Promise<ICargoModel> => {
    return await this.cargoRepository.createCargo(body);
  };

  findAllCargo = async (): Promise<ICargoModel[]> => {
    return await this.cargoRepository.findAllCargo();
  };

  findCargoById = async (id: string): Promise<ICargoModel> => {
    const cargo = await this.cargoRepository.findCargoById(id);
    
    if (!cargo) {
      throw new AppError(`Cargo not found`, 404);
    }

    return cargo;
  };

  updateCargo = async (id: string, body: UpdateCargoDTO): Promise<ICargoModel> => {
    const cargo = await this.cargoRepository.findCargoById(id);
    
    if (!cargo) {
      throw new AppError(`Cargo not found`, 404);
    }

    return await this.cargoRepository.updateCargo(id, body);
  };

  deleteCargo = async (id: string): Promise<void> => {
    const cargo = await this.cargoRepository.findCargoById(id);
    
    if (!cargo) {
      throw new AppError(`Cargo not found`, 404);
    }
    
    await this.cargoRepository.deleteCargo(id);
  };
}
