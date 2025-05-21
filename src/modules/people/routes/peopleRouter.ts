import '../../../common/container';
import { Router } from "express";
import { container } from 'tsyringe';
import { PeopleController } from "../controllers/peopleController";

const peopleRouter = Router();

// Resolver o controller do container
const peopleController = container.resolve(PeopleController);

peopleRouter.get('/', peopleController.log);

export default peopleRouter;