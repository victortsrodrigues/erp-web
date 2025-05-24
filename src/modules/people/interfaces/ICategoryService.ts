import { CreateCategoryDTO } from "../dtos/createCategoryDTO";
import { UpdateCategoryDTO } from "../dtos/updateCategoryDTO";
import { ICategoryModel } from "./ICategoryModel";

export interface ICategoryService {
  createCategory(body: CreateCategoryDTO): Promise<ICategoryModel>;
  findAllCategory(): Promise<ICategoryModel[]>;
  findCategoryById(id: string): Promise<ICategoryModel>;
  updateCategory(id: string, body: UpdateCategoryDTO): Promise<ICategoryModel>;
  deleteCategory(id: string): Promise<void>;
}
