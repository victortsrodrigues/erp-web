import { Router } from 'express';
import peopleRouter from './modules/people/routes/peopleRouter';

const routes = Router();

// People module routes
routes.use('/people', peopleRouter);

export default routes;