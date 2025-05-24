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
    // 1. VALIDAÇÃO DE DUPLICATA - Nome único
    const existingCampoByName = await this.campoAdicionalRepository.findCampoAdicionalByName(body.nome);
    if (existingCampoByName) {
      throw new AppError("Já existe um campo adicional com este nome", 409);
    }

    const totalCampos = await this.campoAdicionalRepository.countAllCampoAdicional();
    if (totalCampos >= 50) {
      throw new AppError("Limite máximo de 50 campos adicionais atingido", 400);
    }

    return await this.campoAdicionalRepository.createCampoAdicional(body);
  };

  findAllCampoAdicional = async (): Promise<ICampoAdicionalModel[]> => {
    return await this.campoAdicionalRepository.findAllCampoAdicional();
  };

  findCampoAdicionalById = async (id: string): Promise<ICampoAdicionalModel> => {
    if (!this.isValidUUID(id)) {
      throw new AppError("ID deve ser um UUID válido", 400);
    }
    
    const campo = await this.campoAdicionalRepository.findCampoAdicionalById(id);
    
    if (!campo) {
      throw new AppError(`Campo adicional not found`, 404);
    }

    return campo;
  };

  updateCampoAdicional = async (id: string, body: UpdateCampoAdicionalDTO): Promise<ICampoAdicionalModel> => {
    if (!this.isValidUUID(id)) {
      throw new AppError("ID deve ser um UUID válido", 400);
    }
    
    const campo = await this.campoAdicionalRepository.findCampoAdicionalById(id);
    
    if (!campo) {
      throw new AppError(`Campo adicional not found`, 404);
    }

    // 1. VALIDAÇÃO DE DUPLICATA - Nome único (excluindo o próprio campo)
    if (body.nome) {
      const existingCampoByName = await this.campoAdicionalRepository.findCampoAdicionalByName(body.nome);
      if (existingCampoByName && existingCampoByName.id !== id) {
        throw new AppError("Já existe outro campo adicional com este nome", 409);
      }
    }

    // 2. VALIDAÇÃO DE MUDANÇA DE TIPO - Verificar se há valores existentes
    if (body.tipo && body.tipo !== campo.tipo) {
      const hasExistingValues = await this.campoAdicionalRepository.hasExistingValues(id);
      if (hasExistingValues) {
        throw new AppError("Não é possível alterar o tipo de um campo que já possui valores cadastrados", 400);
      }
    }

    // 3. VALIDAÇÃO DE REMOÇÃO DE OPÇÕES - Verificar se há valores que serão invalidados
    const tipoFinal = body.tipo ?? campo.tipo;
    if (tipoFinal === 'select' && body.opcoes && campo.opcoes) {
      const opcoesAtuais = JSON.parse(campo.opcoes);
      const opcoesNovas = JSON.parse(body.opcoes);
      
      const opcoesRemovidas = opcoesAtuais.filter((opcao: string) => 
        !opcoesNovas.includes(opcao)
      );

      if (opcoesRemovidas.length > 0) {
        const hasValuesWithRemovedOptions = await this.campoAdicionalRepository.hasValuesWithOptions(id, opcoesRemovidas);
        if (hasValuesWithRemovedOptions) {
          throw new AppError(`Não é possível remover as opções: ${opcoesRemovidas.join(', ')}. Existem registros usando essas opções.`, 400);
        }
      }
    }

    // 4. VALIDAÇÃO ESPECIAL: Se está mudando para 'select' mas não forneceu opções
    if (body.tipo === 'select' && campo.tipo !== 'select' && !body.opcoes) {
      throw new AppError("Ao alterar para tipo 'select', é obrigatório fornecer as opções", 400);
    }

    // 5. VALIDAÇÃO ESPECIAL: Se está mudando de 'select' para outro tipo, limpar opções
    if (body.tipo && body.tipo !== 'select' && campo.tipo === 'select') {
      // Forçar opções como null quando mudando de select para outro tipo
      body.opcoes = null;
    }

    return await this.campoAdicionalRepository.updateCampoAdicional(id, body);
  };

  deleteCampoAdicional = async (id: string): Promise<void> => {
    if (!this.isValidUUID(id)) {
      throw new AppError("ID deve ser um UUID válido", 400);
    }
    
    const campo = await this.campoAdicionalRepository.findCampoAdicionalById(id);
    
    if (!campo) {
      throw new AppError(`Campo adicional not found`, 404);
    }

    // 1. VALIDAÇÃO DE EXCLUSÃO - Verificar se há valores existentes
    const hasExistingValues = await this.campoAdicionalRepository.hasExistingValues(id);
    if (hasExistingValues) {
      throw new AppError("Não é possível excluir um campo que possui valores cadastrados. Remova primeiro todos os valores associados.", 400);
    }
    
    await this.campoAdicionalRepository.deleteCampoAdicional(id);
  };

  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
