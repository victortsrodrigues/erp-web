import { Router } from "express";
import { container } from 'tsyringe';
import { CategoryController } from "../controllers/categoryController";
import { createCategorySchema } from "../dtos/createCategoryDTO";
import { updateCategorySchema } from "../dtos/updateCategoryDTO";
import { validateSchema } from "../../../common/middlewares/validateSchemaMiddleware";

const categoryRouter = Router();

const categoryController = container.resolve(CategoryController);

categoryRouter.post('/', validateSchema(createCategorySchema), categoryController.create);
categoryRouter.put('/:id', validateSchema(updateCategorySchema), categoryController.update);
categoryRouter.delete('/:id', categoryController.delete);
categoryRouter.get('/', categoryController.findAll);
categoryRouter.get('/:id', categoryController.findById);

export default categoryRouter;
