import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "tsyringe";
import { ICategoryService } from "../interfaces/ICategoryService";
import { TOKENS } from "../../../common/tokens";
import { CreateCategoryDTO } from "../dtos/createCategoryDTO";
import { UpdateCategoryDTO } from "../dtos/updateCategoryDTO";

@injectable()
export class CategoryController {
  constructor(
    @inject(TOKENS.CategoryService)
    private readonly categoryService: ICategoryService
  ) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body: CreateCategoryDTO = req.body.data ?? req.body;
      console.log(body);
      const category = await this.categoryService.createCategory(body);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  };

  findAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("findAll");
      const categories = await this.categoryService.findAllCategory();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const category = await this.categoryService.findCategoryById(id);
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const body: UpdateCategoryDTO = req.body.data ?? req.body;
      const category = await this.categoryService.updateCategory(id, body);
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.categoryService.deleteCategory(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
