import { Router } from 'express';
import peopleRouter from './modules/people/routes/peopleRouter';
import authRouter from './modules/auth/routes/authRouter';
import categoryRouter from './modules/people/routes/categoryRouter';

const routes = Router();

// People module routes
routes.use('/people/category', categoryRouter);
routes.use('/people', peopleRouter);
// Auth module routes
routes.use('/auth', authRouter);

export default routes;