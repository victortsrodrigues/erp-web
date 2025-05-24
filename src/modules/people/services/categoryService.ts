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
    return await this.categoryRepository.createCategory(body);
  };

  findAllCategory = async (): Promise<ICategoryModel[]> => {
    return await this.categoryRepository.findAllCategory();
  };

  findCategoryById = async (id: string): Promise<ICategoryModel> => {
    const category = await this.categoryRepository.findCategoryById(id);
    
    if (!category) {
      throw new AppError(`Category not found`, 404);
    }

    return category;
  };

  updateCategory = async (id: string, body: UpdateCategoryDTO): Promise<ICategoryModel> => {
    const category = await this.categoryRepository.findCategoryById(id);
    
    if (!category) {
      throw new AppError(`Category not found`, 404);
    }

    return await this.categoryRepository.updateCategory(id, body);
  };

  deleteCategory = async (id: string): Promise<void> => {
    const category = await this.categoryRepository.findCategoryById(id);
    
    if (!category) {
      throw new AppError(`Category not found`, 404);
    }
    
    await this.categoryRepository.deleteCategory(id);
  };
}
