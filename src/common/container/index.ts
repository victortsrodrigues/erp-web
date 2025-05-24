import { container, Lifecycle } from "tsyringe";

// Importações das interfaces e implementações
import { PeopleRepository } from "../../modules/people/repositories/peopleRepository";
import { PeopleService } from "../../modules/people/services/peopleService";
import { PeopleController } from "../../modules/people/controllers/peopleController";
import { IPeopleRepository } from "../../modules/people/interfaces/IPeopleRepository";
import { IPeopleService } from "../../modules/people/interfaces/IPeopleService";

//Category
import { CategoryRepository } from "../../modules/people/repositories/categoryRepository";
import { CategoryService } from "../../modules/people/services/categoryService";
import { ICategoryRepository } from "../../modules/people/interfaces/ICategoryRepository";
import { ICategoryService } from "../../modules/people/interfaces/ICategoryService";
import { CategoryController } from "../../modules/people/controllers/categoryController";

// Cargo
import { CargoRepository } from "../../modules/people/repositories/cargoRepository";
import { CargoService } from "../../modules/people/services/cargoService";
import { CargoController } from "../../modules/people/controllers/cargoController";
import { ICargoRepository } from "../../modules/people/interfaces/ICargoRepository";
import { ICargoService } from "../../modules/people/interfaces/ICargoService";

import { TOKENS } from "../tokens";

// Database
import prismaClient from "../../database/client";

// Registrar PrismaClient como singleton
container.registerInstance(TOKENS.PrismaClient, prismaClient);
// Registrando na ordem correta (de baixo para cima na árvore de dependências)
container.register<IPeopleRepository>(
  TOKENS.PeopleRepository,
  { useClass: PeopleRepository },
  { lifecycle: Lifecycle.Singleton }
);
container.register<IPeopleService>(
  TOKENS.PeopleService,
  { useClass: PeopleService },
  { lifecycle: Lifecycle.Singleton }
);
container.register(
  PeopleController,
  { useClass: PeopleController },
  { lifecycle: Lifecycle.Singleton }
);

// Category
container.register<ICategoryRepository>(
  TOKENS.CategoryRepository,
  { useClass: CategoryRepository },
  { lifecycle: Lifecycle.Singleton }
);
container.register<ICategoryService>(
  TOKENS.CategoryService,
  { useClass: CategoryService },
  { lifecycle: Lifecycle.Singleton }
);
container.register(
  CategoryController,
  { useClass: CategoryController },
  { lifecycle: Lifecycle.Singleton }
);
// Cargo
container.register<ICargoRepository>(
  TOKENS.CargoRepository,
  { useClass: CargoRepository },
  { lifecycle: Lifecycle.Singleton }
);
container.register<ICargoService>(
  TOKENS.CargoService,
  { useClass: CargoService },
  { lifecycle: Lifecycle.Singleton }
);
container.register(
  CargoController,
  { useClass: CargoController },
  { lifecycle: Lifecycle.Singleton }
);