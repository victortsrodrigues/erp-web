import { Router } from "express";
import { container } from 'tsyringe';
import { CampoAdicionalController } from "../controllers/campoAdicionalController";
import { createCampoAdicionalSchema } from "../dtos/createCampoAdicionalDTO";
import { updateCampoAdicionalSchema } from "../dtos/updateCampoAdicionalDTO";
import { validateSchema } from "../../../common/middlewares/validateSchemaMiddleware";

const campoAdicionalRouter = Router();

const campoAdicionalController = container.resolve(CampoAdicionalController);

campoAdicionalRouter.post('/', validateSchema(createCampoAdicionalSchema), campoAdicionalController.create);
campoAdicionalRouter.put('/:id', validateSchema(updateCampoAdicionalSchema), campoAdicionalController.update);
campoAdicionalRouter.delete('/:id', campoAdicionalController.delete);
campoAdicionalRouter.get('/', campoAdicionalController.findAll);
campoAdicionalRouter.get('/:id', campoAdicionalController.findById);

export default campoAdicionalRouter;