import { CreateCategoryDTO } from "../dtos/createCategoryDTO";
import { UpdateCategoryDTO } from "../dtos/updateCategoryDTO";
import { ICategoryModel } from "./ICategoryModel";

export interface ICategoryRepository {
  createCategory(data: CreateCategoryDTO): Promise<ICategoryModel>;
  findAllCategory(): Promise<ICategoryModel[]>;
  findCategoryById(id: string): Promise<ICategoryModel | null>;
  updateCategory(id: string, data: UpdateCategoryDTO): Promise<ICategoryModel>;
  deleteCategory(id: string): Promise<void>;
}
