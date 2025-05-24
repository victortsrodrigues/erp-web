import { injectable, inject } from "tsyringe";
import { ICampoAdicionalService } from "../interfaces/ICampoAdicionalService";
import { ICampoAdicionalRepository } from "../interfaces/ICampoAdicionalRepository";
import { ICampoAdicionalModel } from "../interfaces/ICampoAdicionalModel";
import { TOKENS } from "../../../common/tokens";
import { CreateCampoAdicionalDTO } from "../dtos/createCampoAdicionalDTO";
import { UpdateCampoAdicionalDTO } from "../dtos/updateCampoAdicionalDTO";
import { AppError } from "../../../common/errors/appError";

@injectable()
export class CampoAdicionalService implements ICampoAdicionalService {
  constructor(
    @inject(TOKENS.CampoAdicionalRepository)
    private readonly campoAdicionalRepository: ICampoAdicionalRepository
  ) {}

  createCampoAdicional = async (body: CreateCampoAdicionalDTO): Promise<ICampoAdicionalModel> => {
    // Validação adicional para campos do tipo 'select'
    if (body.tipo === 'select' && !body.opcoes) {
      throw new AppError("Opções são obrigatórias para campos do tipo 'select'", 400);
    }

    // Validação do formato JSON para opções
    if (body.opcoes) {
      try {
        JSON.parse(body.opcoes);
      } catch {
        throw new AppError("Opções devem estar em formato JSON válido", 400);
      }
    }

    return await this.campoAdicionalRepository.createCampoAdicional(body);
  };

  findAllCampoAdicional = async (): Promise<ICampoAdicionalModel[]> => {
    return await this.campoAdicionalRepository.findAllCampoAdicional();
  };

  findCampoAdicionalById = async (id: string): Promise<ICampoAdicionalModel> => {
    const campo = await this.campoAdicionalRepository.findCampoAdicionalById(id);
    
    if (!campo) {
      throw new AppError(`Campo adicional not found`, 404);
    }

    return campo;
  };

  updateCampoAdicional = async (id: string, body: UpdateCampoAdicionalDTO): Promise<ICampoAdicionalModel> => {
    const campo = await this.campoAdicionalRepository.findCampoAdicionalById(id);
    
    if (!campo) {
      throw new AppError(`Campo adicional not found`, 404);
    }

    // Validação adicional para campos do tipo 'select'
    if (body.tipo === 'select' && !body.opcoes) {
      throw new AppError("Opções são obrigatórias para campos do tipo 'select'", 400);
    }

    // Validação do formato JSON para opções
    if (body.opcoes) {
      try {
        JSON.parse(body.opcoes);
      } catch {
        throw new AppError("Opções devem estar em formato JSON válido", 400);
      }
    }

    return await this.campoAdicionalRepository.updateCampoAdicional(id, body);
  };

  deleteCampoAdicional = async (id: string): Promise<void> => {
    const campo = await this.campoAdicionalRepository.findCampoAdicionalById(id);
    
    if (!campo) {
      throw new AppError(`Campo adicional not found`, 404);
    }
    
    await this.campoAdicionalRepository.deleteCampoAdicional(id);
  };
}
