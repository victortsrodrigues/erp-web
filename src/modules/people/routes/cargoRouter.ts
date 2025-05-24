import { Router } from "express";
import { container } from 'tsyringe';
import { CargoController } from "../controllers/cargoController";
import { createCargoSchema } from "../dtos/createCargoDTO";
import { updateCargoSchema } from "../dtos/updateCargoDTO";
import { validateSchema } from "../../../common/middlewares/validateSchemaMiddleware";

const cargoRouter = Router();

const cargoController = container.resolve(CargoController);

cargoRouter.post('/', validateSchema(createCargoSchema), cargoController.create);
cargoRouter.put('/:id', validateSchema(updateCargoSchema), cargoController.update);
cargoRouter.delete('/:id', cargoController.delete);
cargoRouter.get('/', cargoController.findAll);
cargoRouter.get('/:id', cargoController.findById);

export default cargoRouter;
