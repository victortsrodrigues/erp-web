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
    // 1. VALIDAÇÃO DE DUPLICATAS - Email
    if (body.email) {
      const existingPersonByEmail = await this.peopleRepository.findPeopleByEmail(body.email);
      if (existingPersonByEmail) {
        throw new AppError("Já existe uma pessoa cadastrada com este email", 409);
      }
    }

    // 2. VALIDAÇÃO DE DUPLICATAS - CPF
    if (body.cpf) {
      const existingPersonByCPF = await this.peopleRepository.findPeopleByCPF(body.cpf);
      if (existingPersonByCPF) {
        throw new AppError("Já existe uma pessoa cadastrada com este CPF", 409);
      }
    }

    // 3. VALIDAÇÃO DE DUPLICATAS - Telefone
    if (body.telefone) {
      const existingPersonByTelefone = await this.peopleRepository.findPeopleByTelefone(body.telefone);
      if (existingPersonByTelefone) {
        throw new AppError("Já existe uma pessoa cadastrada com este telefone", 409);
      }
    }

    // 4. VALIDAÇÃO DE DUPLICATAS - Celular
    if (body.celular) {
      const existingPersonByCelular = await this.peopleRepository.findPeopleByCelular(body.celular);
      if (existingPersonByCelular) {
        throw new AppError("Já existe uma pessoa cadastrada com este celular", 409);
      }
    }

    // 5. VALIDAÇÃO DE DUPLICATAS - RG
    if (body.rg) {
      const existingPersonByRG = await this.peopleRepository.findPeopleByRG(body.rg);
      if (existingPersonByRG) {
        throw new AppError("Já existe uma pessoa cadastrada com este RG", 409);
      }
    }
    
    // Verifica se as categorias fornecidas existem
    if (body.categorias && body.categorias.length > 0) {
      const existingCategories = await this.categoryRepository.findAllCategory();
      const existingCategoryIds = existingCategories.map((category) => category.id);

      const invalidCategories = body.categorias.filter(
        (categoryId) => !existingCategoryIds.includes(categoryId)
      );

      if (invalidCategories.length > 0) {
        throw new AppError(
          `Categories not found: ${invalidCategories.join(", ")}`,
          404
        );
      }
    }

    // Verifica se os cargos fornecidos existem
    if (body.cargos && body.cargos.length > 0) {
      const existingCargos = await this.cargoRepository.findAllCargo();
      const existingCargoIds = existingCargos.map((cargo) => cargo.id);

      const invalidCargos = body.cargos.filter(
        (cargoId) => !existingCargoIds.includes(cargoId)
      );

      if (invalidCargos.length > 0) {
        throw new AppError(
          `Cargos not found: ${invalidCargos.join(", ")}`,
          404
        );
      }
    }

    // Verifica se os campos adicionais fornecidos existem
    if (body.camposAdicionais && Object.keys(body.camposAdicionais).length > 0) {
      const campoIds = Object.keys(body.camposAdicionais);
      
      // Verificar se todos os campos existem
      const existingCampos = await this.campoAdicionalRepository.findAllCampoAdicional();
      const existingCampoIds = existingCampos.map(campo => campo.id);
      
      const invalidCampos = campoIds.filter(campoId => 
        !existingCampoIds.includes(campoId)
      );

      if (invalidCampos.length > 0) {
        throw new AppError(`Campos adicionais não encontrados: ${invalidCampos.join(', ')}`, 404);
      }

      // Validar campos obrigatórios
      const camposObrigatorios = existingCampos.filter(campo => campo.obrigatorio);
      const camposObrigatoriosIds = camposObrigatorios.map(campo => campo.id);
      
      const camposFaltando = camposObrigatoriosIds.filter(campoId => 
        !campoIds.includes(campoId!)
      );

      if (camposFaltando.length > 0) {
        const nomesCamposFaltando = camposObrigatorios
          .filter(campo => camposFaltando.includes(campo.id))
          .map(campo => campo.nome);
        
        throw new AppError(`Campos obrigatórios não preenchidos: ${nomesCamposFaltando.join(', ')}`, 400);
      }

      // Validar valores dos campos do tipo 'select'
      for (const [campoId, valor] of Object.entries(body.camposAdicionais)) {
        const campo = existingCampos.find(c => c.id === campoId);
        
        if (campo && campo.tipo === 'select' && campo.opcoes) {
          try {
            const opcoes = JSON.parse(campo.opcoes);
            if (!opcoes.includes(valor)) {
              throw new AppError(`Valor '${valor}' não é válido para o campo '${campo.nome}'. Opções válidas: ${opcoes.join(', ')}`, 400);
            }
          } catch (error) {
            throw new AppError(`Erro ao validar opções do campo '${campo.nome}': ${error}`, 400);
          }
        }

        // Validar campos do tipo 'number'
        if (campo && campo.tipo === 'number') {
          if (isNaN(Number(valor))) {
            throw new AppError(`O campo '${campo.nome}' deve ser um número válido`, 400);
          }
        }

        // Validar campos do tipo 'date'
        if (campo && campo.tipo === 'date') {
          const date = new Date(valor);
          if (isNaN(date.getTime())) {
            throw new AppError(`O campo '${campo.nome}' deve ser uma data válida`, 400);
          }
        }

        // Validar campos do tipo 'checkbox'
        if (campo && campo.tipo === 'checkbox') {
          if (!['true', 'false', '1', '0'].includes(valor.toLowerCase())) {
            throw new AppError(`O campo '${campo.nome}' deve ser um valor booleano (true/false)`, 400);
          }
        }
      }
    }

    await this.peopleRepository.createPeople(body);
  };

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
    
    await this.peopleRepository.updatePeople(id, body);
  };

  deletePeople = async (id: string): Promise<void> => {
    const person = await this.peopleRepository.findPeopleById(id);

    if (!person) {
      throw new AppError(`Person not found`, 404);
    }

    await this.peopleRepository.deletePeople(id);
  };
}

