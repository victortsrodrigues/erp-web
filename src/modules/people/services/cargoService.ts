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
    // 1. VALIDAÇÃO DE DUPLICATA - Nome único (constraint do Prisma)
    const existingCargoByName = await this.cargoRepository.findCargoByName(body.nome);
    if (existingCargoByName) {
      throw new AppError("Já existe um cargo com este nome", 409);
    }

    // 4. VALIDAÇÃO DE LIMITE DE CARGOS NO SISTEMA
    const totalCargos = await this.cargoRepository.countAllCargo();
    if (totalCargos >= 100) {
      throw new AppError("Limite máximo de 100 cargos atingido no sistema", 400);
    }
    
    return await this.cargoRepository.createCargo(body);
  };

  findAllCargo = async (): Promise<ICargoModel[]> => {
    return await this.cargoRepository.findAllCargo();
  };

  findCargoById = async (id: string): Promise<ICargoModel> => {
    if (!this.isValidUUID(id)) {
      throw new AppError("ID deve ser um UUID válido", 400);
    }
    
    const cargo = await this.cargoRepository.findCargoById(id);
    
    if (!cargo) {
      throw new AppError(`Cargo not found`, 404);
    }

    return cargo;
  };

  updateCargo = async (id: string, body: UpdateCargoDTO): Promise<ICargoModel> => {
    if (!this.isValidUUID(id)) {
      throw new AppError("ID deve ser um UUID válido", 400);
    }
    
    const cargo = await this.cargoRepository.findCargoById(id);
    
    if (!cargo) {
      throw new AppError(`Cargo not found`, 404);
    }

    if (body.nome) {
      const existingCargoByName = await this.cargoRepository.findCargoByName(body.nome);
      if (existingCargoByName && existingCargoByName.id !== id) {
        throw new AppError("Já existe outro cargo com este nome", 409);
      }
    }

    // 3. VALIDAÇÃO DE IMPACTO - Verificar se há pessoas vinculadas
    if (body.nome && body.nome !== cargo.nome) {
      const pessoasVinculadas = await this.cargoRepository.countPeopleWithCargo(id);
      if (pessoasVinculadas > 0) {
        // Log para auditoria
        console.log(`Cargo "${cargo.nome}" sendo renomeado para "${body.nome}". ${pessoasVinculadas} pessoa(s) afetada(s).`);
      }
    }

    return await this.cargoRepository.updateCargo(id, body);
  };

  deleteCargo = async (id: string): Promise<void> => {
    if (!this.isValidUUID(id)) {
      throw new AppError("ID deve ser um UUID válido", 400);
    }
    
    const cargo = await this.cargoRepository.findCargoById(id);
    
    if (!cargo) {
      throw new AppError(`Cargo not found`, 404);
    }

    // 1. VALIDAÇÃO DE EXCLUSÃO - Verificar se há pessoas vinculadas
    const pessoasVinculadas = await this.cargoRepository.countPeopleWithCargo(id);
    if (pessoasVinculadas > 0) {
      throw new AppError(
        `Não é possível excluir o cargo "${cargo.nome}". ` +
        `Existem ${pessoasVinculadas} pessoa(s) vinculada(s) a este cargo. ` +
        `Remova primeiro as vinculações antes de excluir.`, 
        400
      );
    }
    
    await this.cargoRepository.deleteCargo(id);
  };

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
