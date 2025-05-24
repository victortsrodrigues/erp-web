import { CreateCargoDTO } from "../dtos/createCargoDTO";
import { UpdateCargoDTO } from "../dtos/updateCargoDTO";
import { ICargoModel } from "./ICargoModel";

export interface ICargoRepository {
  createCargo(data: CreateCargoDTO): Promise<ICargoModel>;
  findAllCargo(): Promise<ICargoModel[]>;
  findCargoById(id: string): Promise<ICargoModel | null>;
  updateCargo(id: string, data: UpdateCargoDTO): Promise<ICargoModel>;
  deleteCargo(id: string): Promise<void>;
}
