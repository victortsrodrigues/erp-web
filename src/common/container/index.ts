import { container, Lifecycle } from "tsyringe";

// Importações das interfaces e implementações
import { PeopleRepository } from "../../modules/people/repositories/peopleRepository";
import { PeopleService } from "../../modules/people/services/peopleService";
import { PeopleController } from "../../modules/people/controllers/peopleController";
import { IPeopleRepository } from "../../modules/people/interfaces/IPeopleRepository";
import { IPeopleService } from "../../modules/people/interfaces/IPeopleService";
import { TOKENS } from "../tokens";

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

// Você registrará outras dependências à medida que cria novos módulos
