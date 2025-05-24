import { CreateCampoAdicionalDTO } from "../dtos/createCampoAdicionalDTO";
import { UpdateCampoAdicionalDTO } from "../dtos/updateCampoAdicionalDTO";
import { ICampoAdicionalModel } from "./ICampoAdicionalModel";

export interface ICampoAdicionalService {
  createCampoAdicional(body: CreateCampoAdicionalDTO): Promise<ICampoAdicionalModel>;
  findAllCampoAdicional(): Promise<ICampoAdicionalModel[]>;
  findCampoAdicionalById(id: string): Promise<ICampoAdicionalModel>;
  updateCampoAdicional(id: string, body: UpdateCampoAdicionalDTO): Promise<ICampoAdicionalModel>;
  deleteCampoAdicional(id: string): Promise<void>;
}
