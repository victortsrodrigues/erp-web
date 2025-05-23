import { Router } from "express";
import { container } from 'tsyringe';
import { PeopleController } from "../controllers/peopleController";
import { createPeopleSchema } from "../dtos/createPeopleDTO";
import { updatePeopleSchema } from "../dtos/updatePeopleDTO";
import { validateSchema } from "../../../common/middlewares/validateSchemaMiddleware";

const peopleRouter = Router();

// Resolver o controller do container
const peopleController = container.resolve(PeopleController);

peopleRouter.post('/', validateSchema(createPeopleSchema), peopleController.create);
peopleRouter.put('/:id', validateSchema(updatePeopleSchema), peopleController.update);
peopleRouter.delete('/:id', peopleController.delete);
peopleRouter.get('/', peopleController.findAll);
peopleRouter.get('/:id', peopleController.findById);

export default peopleRouter;