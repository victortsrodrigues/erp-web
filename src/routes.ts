import { Router } from 'express';
import peopleRouter from './modules/people/routes/peopleRouter';
import authRouter from './modules/auth/routes/authRouter';
import categoryRouter from './modules/people/routes/categoryRouter';
import cargoRouter from './modules/people/routes/cargoRouter';
import campoAdicionalRouter from './modules/people/routes/campoAdicionalRouter';

const routes = Router();

// People module routes
routes.use('/people/campo-adicional', campoAdicionalRouter);
routes.use('/people/category', categoryRouter);
routes.use('/people/cargo', cargoRouter);
routes.use('/people', peopleRouter);
// Auth module routes
routes.use('/auth', authRouter);

export default routes;