import { injectable, inject } from "tsyringe";
import { ICategoryService } from "../interfaces/ICategoryService";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";
import { ICategoryModel } from "../interfaces/ICategoryModel";
import { TOKENS } from "../../../common/tokens";
import { CreateCategoryDTO } from "../dtos/createCategoryDTO";
import { UpdateCategoryDTO } from "../dtos/updateCategoryDTO";
import { AppError } from "../../../common/errors/appError";

@injectable()
export class CategoryService implements ICategoryService {
  constructor(
    @inject(TOKENS.CategoryRepository)
    private readonly categoryRepository: ICategoryRepository
  ) {}

  createCategory = async (body: CreateCategoryDTO): Promise<ICategoryModel> => {
    // 1. VALIDAÇÃO DE DUPLICATA - Nome único (constraint do Prisma)
    const existingCategoryByName = await this.categoryRepository.findCategoryByName(body.nome);
    if (existingCategoryByName) {
      throw new AppError("Já existe uma categoria com este nome", 409);
    }
    
    // 4. VALIDAÇÃO DE LIMITE DE CATEGORIAS NO SISTEMA
    const totalCategorias = await this.categoryRepository.countAllCategory();
    if (totalCategorias >= 50) {
      throw new AppError("Limite máximo de 50 categorias atingido no sistema", 400);
    }

    // 5. VALIDAÇÃO DE COR - Formato hexadecimal e cores válidas
    if (body.cor) {
      // Verificar se não é uma cor já em uso
      const existingCategoryByColor = await this.categoryRepository.findCategoryByColor(body.cor);
      if (existingCategoryByColor) {
        throw new AppError(`A cor ${body.cor} já está sendo usada pela categoria "${existingCategoryByColor.nome}"`, 409);
      }
    }

    return await this.categoryRepository.createCategory(body);
  };

  findAllCategory = async (): Promise<ICategoryModel[]> => {
    return await this.categoryRepository.findAllCategory();
  };

  findCategoryById = async (id: string): Promise<ICategoryModel> => {
    // Validar formato UUID
    if (!this.isValidUUID(id)) {
      throw new AppError("ID deve ser um UUID válido", 400);
    }
    
    const category = await this.categoryRepository.findCategoryById(id);
    
    if (!category) {
      throw new AppError(`Category not found`, 404);
    }

    return category;
  };

  updateCategory = async (id: string, body: UpdateCategoryDTO): Promise<ICategoryModel> => {
    // Validar formato UUID
    if (!this.isValidUUID(id)) {
      throw new AppError("ID deve ser um UUID válido", 400);
    }
    
    const category = await this.categoryRepository.findCategoryById(id);
    
    if (!category) {
      throw new AppError(`Category not found`, 404);
    }

    // 1. VALIDAÇÃO DE DUPLICATA - Nome único (excluindo a própria categoria)
    if (body.nome) {
      const existingCategoryByName = await this.categoryRepository.findCategoryByName(body.nome);
      if (existingCategoryByName && existingCategoryByName.id !== id) {
        throw new AppError("Já existe outra categoria com este nome", 409);
      }
    }

    // 2. VALIDAÇÃO DE COR
    if (body.cor && body.cor !== undefined) {
      // Verificar duplicata de cor (excluindo a própria categoria)
      const existingCategoryByColor = await this.categoryRepository.findCategoryByColor(body.cor);
      if (existingCategoryByColor && existingCategoryByColor.id !== id) {
        throw new AppError(`A cor ${body.cor} já está sendo usada pela categoria "${existingCategoryByColor.nome}"`, 409);
      }
    }

    // 4. VALIDAÇÃO DE IMPACTO - Verificar se há pessoas vinculadas
    if (body.nome && body.nome !== category.nome) {
      const pessoasVinculadas = await this.categoryRepository.countPeopleWithCategory(id);
      if (pessoasVinculadas > 0) {
        // Log para auditoria
        console.log(`Categoria "${category.nome}" sendo renomeada para "${body.nome}". ${pessoasVinculadas} pessoa(s) afetada(s).`);
      }
    }

    return await this.categoryRepository.updateCategory(id, body);
  };

  deleteCategory = async (id: string): Promise<void> => {
    // Validar formato UUID
    if (!this.isValidUUID(id)) {
      throw new AppError("ID deve ser um UUID válido", 400);
    }
    
    const category = await this.categoryRepository.findCategoryById(id);
    
    if (!category) {
      throw new AppError(`Category not found`, 404);
    }

    // 1. VALIDAÇÃO DE EXCLUSÃO - Verificar se há pessoas vinculadas
    const pessoasVinculadas = await this.categoryRepository.countPeopleWithCategory(id);
    if (pessoasVinculadas > 0) {
      throw new AppError(
        `Não é possível excluir a categoria "${category.nome}". ` +
        `Existem ${pessoasVinculadas} pessoa(s) vinculada(s) a esta categoria. ` +
        `Remova primeiro as vinculações antes de excluir.`, 
        400
      );
    }
    
    await this.categoryRepository.deleteCategory(id);
  };

  // MÉTODOS AUXILIARES
  private isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
