import { CreateCargoDTO } from "../dtos/createCargoDTO";
import { UpdateCargoDTO } from "../dtos/updateCargoDTO";
import { ICargoModel } from "./ICargoModel";

export interface ICargoService {
  createCargo(body: CreateCargoDTO): Promise<ICargoModel>;
  findAllCargo(): Promise<ICargoModel[]>;
  findCargoById(id: string): Promise<ICargoModel>;
  updateCargo(id: string, body: UpdateCargoDTO): Promise<ICargoModel>;
  deleteCargo(id: string): Promise<void>;
}
