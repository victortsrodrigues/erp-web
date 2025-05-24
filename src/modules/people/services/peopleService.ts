import { injectable, inject } from "tsyringe";
import { IPeopleService } from "../interfaces/IPeopleService";
import { IPeopleRepository } from "../interfaces/IPeopleRepository";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";
import { ICargoRepository } from "../interfaces/ICargoRepository";
import { ICampoAdicionalRepository } from "../interfaces/ICampoAdicionalRepository";
import { TOKENS } from "../../../common/tokens";
import { CreatePeopleDTO } from "../dtos/createPeopleDTO";
import { UpdatePeopleDTO } from "../dtos/updatePeopleDTO";
import { AppError } from "../../../common/errors/appError";

@injectable()
export class PeopleService implements IPeopleService {
  constructor(
    @inject(TOKENS.PeopleRepository)
    private readonly peopleRepository: IPeopleRepository,
    @inject(TOKENS.CategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
    @inject(TOKENS.CargoRepository)
    private readonly cargoRepository: ICargoRepository,
    @inject(TOKENS.CampoAdicionalRepository)
    private readonly campoAdicionalRepository: ICampoAdicionalRepository
  ) {}

  createPeople = async (body: CreatePeopleDTO): Promise<void> => {
    await this.validateDuplicateFieldsToCreate(body);
    
    // Verifica se as categorias fornecidas existem
    await this.validateCategories(body.categorias);

    // Verifica se os cargos fornecidos existem
    await this.validateCargos(body.cargos);

    // Verifica se os campos adicionais fornecidos existem
    await this.validateCamposAdicionais(body.camposAdicionais);

    await this.peopleRepository.createPeople(body);
  };

  private async validateDuplicateFieldsToCreate(body: CreatePeopleDTO): Promise<void> {
    if (body.email) {
      const existingPersonByEmail = await this.peopleRepository.findPeopleByEmail(body.email);
      if (existingPersonByEmail) {
        throw new AppError("Já existe uma pessoa cadastrada com este email", 409);
      }
    }
    if (body.cpf) {
      const existingPersonByCPF = await this.peopleRepository.findPeopleByCPF(body.cpf);
      if (existingPersonByCPF) {
        throw new AppError("Já existe uma pessoa cadastrada com este CPF", 409);
      }
    }
    if (body.telefone) {
      const existingPersonByTelefone = await this.peopleRepository.findPeopleByTelefone(body.telefone);
      if (existingPersonByTelefone) {
        throw new AppError("Já existe uma pessoa cadastrada com este telefone", 409);
      }
    }
    if (body.celular) {
      const existingPersonByCelular = await this.peopleRepository.findPeopleByCelular(body.celular);
      if (existingPersonByCelular) {
        throw new AppError("Já existe uma pessoa cadastrada com este celular", 409);
      }
    }
    if (body.rg) {
      const existingPersonByRG = await this.peopleRepository.findPeopleByRG(body.rg);
      if (existingPersonByRG) {
        throw new AppError("Já existe uma pessoa cadastrada com este RG", 409);
      }
    }
  }

  private async validateCategories(categorias?: string[]): Promise<void> {
    if (categorias && categorias.length > 0) {
      const existingCategories = await this.categoryRepository.findAllCategory();
      const existingCategoryIds = existingCategories.map((category) => category.id);
      const invalidCategories = categorias.filter(
        (categoryId) => !existingCategoryIds.includes(categoryId)
      );
      if (invalidCategories.length > 0) {
        throw new AppError(
          `Categories not found: ${invalidCategories.join(", ")}`,
          404
        );
      }
    }
  }

  private async validateCargos(cargos?: string[]): Promise<void> {
    if (cargos && cargos.length > 0) {
      const existingCargos = await this.cargoRepository.findAllCargo();
      const existingCargoIds = existingCargos.map((cargo) => cargo.id);
      const invalidCargos = cargos.filter(
        (cargoId) => !existingCargoIds.includes(cargoId)
      );
      if (invalidCargos.length > 0) {
        throw new AppError(
          `Cargos not found: ${invalidCargos.join(", ")}`,
          404
        );
      }
    }
  }
  
  private async validateCamposAdicionais(camposAdicionais?: Record<string, any>): Promise<void> {
    if (!camposAdicionais || Object.keys(camposAdicionais).length === 0) return;

    const campoIds = Object.keys(camposAdicionais);
    const existingCampos = await this.campoAdicionalRepository.findAllCampoAdicional();
    const existingCampoIds = existingCampos.map(campo => campo.id);

    const invalidCampos = campoIds.filter(campoId =>
      !existingCampoIds.includes(campoId)
    );
    if (invalidCampos.length > 0) {
      throw new AppError(`Campos adicionais não encontrados: ${invalidCampos.join(', ')}`, 404);
    }

    this.validateCamposObrigatorios(camposAdicionais, existingCampos);
    this.validateCamposValores(camposAdicionais, existingCampos);
  }

  private validateCamposObrigatorios(camposAdicionais: Record<string, any>, existingCampos: any[]): void {
    const campoIds = Object.keys(camposAdicionais);
    const camposObrigatorios = existingCampos.filter(campo => campo.obrigatorio);
    const camposObrigatoriosIds = camposObrigatorios.map(campo => campo.id);
    const camposFaltando = camposObrigatoriosIds.filter(campoId =>
      !campoIds.includes(campoId)
    );
    if (camposFaltando.length > 0) {
      const nomesCamposFaltando = camposObrigatorios
        .filter(campo => camposFaltando.includes(campo.id))
        .map(campo => campo.nome);
      throw new AppError(`Campos obrigatórios não preenchidos: ${nomesCamposFaltando.join(', ')}`, 400);
    }
  }

  private validateCamposValores(camposAdicionais: Record<string, any>, existingCampos: any[]): void {
    for (const [campoId, valor] of Object.entries(camposAdicionais)) {
      const campo = existingCampos.find(c => c.id === campoId);
      if (!campo) continue;

      if (campo.tipo === 'select' && campo.opcoes) {
        try {
          const opcoes = JSON.parse(campo.opcoes);
          if (!opcoes.includes(valor)) {
            throw new AppError(`Valor '${valor}' não é válido para o campo '${campo.nome}'. Opções válidas: ${opcoes.join(', ')}`, 400);
          }
        } catch (error) {
          throw new AppError(`Erro ao validar opções do campo '${campo.nome}': ${error}`, 400);
        }
      }
      if (campo.tipo === 'number') {
        if (isNaN(Number(valor))) {
          throw new AppError(`O campo '${campo.nome}' deve ser um número válido`, 400);
        }
      }
      if (campo.tipo === 'date') {
        const date = new Date(valor);
        if (isNaN(date.getTime())) {
          throw new AppError(`O campo '${campo.nome}' deve ser uma data válida`, 400);
        }
      }
      if (campo.tipo === 'checkbox') {
        if (!['true', 'false', '1', '0'].includes(String(valor).toLowerCase())) {
          throw new AppError(`O campo '${campo.nome}' deve ser um valor booleano (true/false)`, 400);
        }
      }
    }
  }

  findAllPeople = async (): Promise<any[]> => {
    return await this.peopleRepository.findAllPeople();
  };

  findPeopleById = async (id: string): Promise<any> => {
    const person = await this.peopleRepository.findPeopleById(id);

    if (!person) {
      throw new AppError(`Person not found`, 404);
    }

    return person;
  };

  updatePeople = async (id: string, body: UpdatePeopleDTO): Promise<void> => {
    const existingPerson = await this.peopleRepository.findPeopleById(id);
    if (!existingPerson) {
      throw new AppError("Pessoa não encontrada", 404);
    }

    await this.validateDuplicateFieldsToUpdate(id, body);

    // Verifica se as categorias fornecidas existem
    await this.validateCategories(body.categorias);

    // Verifica se os cargos fornecidos existem
    await this.validateCargos(body.cargos);

    // Verifica se os campos adicionais fornecidos existem
    await this.validateCamposAdicionais(body.camposAdicionais);
    
    await this.peopleRepository.updatePeople(id, body);
  };

  private async validateDuplicateFieldsToUpdate(id: string, body: UpdatePeopleDTO): Promise<void> {
    if (body.email) {
      const existingPersonByEmail = await this.peopleRepository.findPeopleByEmail(body.email);
      if (existingPersonByEmail && existingPersonByEmail.id !== id) {
        throw new AppError("Já existe uma pessoa cadastrada com este email", 409);
      }
    }
    if (body.cpf) {
      const existingPersonByCPF = await this.peopleRepository.findPeopleByCPF(body.cpf);
      if (existingPersonByCPF && existingPersonByCPF.id !== id) {
        throw new AppError("Já existe uma pessoa cadastrada com este CPF", 409);
      }
    }
    if (body.telefone) {
      const existingPersonByTelefone = await this.peopleRepository.findPeopleByTelefone(body.telefone);
      if (existingPersonByTelefone && existingPersonByTelefone.id !== id) {
        throw new AppError("Já existe uma pessoa cadastrada com este telefone", 409);
      }
    }
    if (body.celular) {
      const existingPersonByCelular = await this.peopleRepository.findPeopleByCelular(body.celular);
      if (existingPersonByCelular && existingPersonByCelular.id !== id) {
        throw new AppError("Já existe uma pessoa cadastrada com este celular", 409);
      }
    }
    if (body.rg) {
      const existingPersonByRG = await this.peopleRepository.findPeopleByRG(body.rg);
      if (existingPersonByRG && existingPersonByRG.id !== id) {
        throw new AppError("Já existe uma pessoa cadastrada com este RG", 409);
      }
    }
  }

  deletePeople = async (id: string): Promise<void> => {
    const person = await this.peopleRepository.findPeopleById(id);

    if (!person) {
      throw new AppError(`Person not found`, 404);
    }

    await this.peopleRepository.deletePeople(id);
  };
}

