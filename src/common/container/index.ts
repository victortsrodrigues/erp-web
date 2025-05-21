import { container, Lifecycle } from 'tsyringe';

// Importações das interfaces e implementações
import { PeopleRepository } from '../../modules/people/repositories/peopleRepository';
import { PeopleService } from '../../modules/people/services/peopleService';
import { PeopleController } from '../../modules/people/controllers/peopleController';

// Registrando na ordem correta (de baixo para cima na árvore de dependências)
container.register(
  PeopleRepository,
  { useClass: PeopleRepository },
  { lifecycle: Lifecycle.Singleton }
);
container.register(
  PeopleService,
  { useClass: PeopleService },
  { lifecycle: Lifecycle.Singleton }
);
container.register(
  PeopleController,
  { useClass: PeopleController },
  { lifecycle: Lifecycle.Singleton }
);

// Você registrará outras dependências à medida que cria novos módulos