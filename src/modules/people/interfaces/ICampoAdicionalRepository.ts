import { CreateCampoAdicionalDTO } from "../dtos/createCampoAdicionalDTO";
import { UpdateCampoAdicionalDTO } from "../dtos/updateCampoAdicionalDTO";
import { ICampoAdicionalModel } from "./ICampoAdicionalModel";

export interface ICampoAdicionalRepository {
  createCampoAdicional(data: CreateCampoAdicionalDTO): Promise<ICampoAdicionalModel>;
  findAllCampoAdicional(): Promise<ICampoAdicionalModel[]>;
  findCampoAdicionalById(id: string): Promise<ICampoAdicionalModel | null>;
  updateCampoAdicional(id: string, data: UpdateCampoAdicionalDTO): Promise<ICampoAdicionalModel>;
  deleteCampoAdicional(id: string): Promise<void>;
  findCampoAdicionalByName(nome: string): Promise<ICampoAdicionalModel | null>;
  countAllCampoAdicional(): Promise<number>;
  hasExistingValues(campoId: string): Promise<boolean>;
  hasValuesWithOptions(campoId: string, opcoes: string[]): Promise<boolean>;
}
