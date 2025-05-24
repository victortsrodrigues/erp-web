import { injectable, inject } from "tsyringe";
import { IPeopleService } from "../interfaces/IPeopleService";
import { IPeopleRepository } from "../interfaces/IPeopleRepository";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";
import { TOKENS } from "../../../common/tokens";
import { CreatePeopleDTO } from "../dtos/createPeopleDTO";
import { UpdatePeopleDTO } from "../dtos/updatePeopleDTO";
import { AppError } from "../../../common/errors/appError";

@injectable()
export class PeopleService implements IPeopleService {
  constructor(
    @inject(TOKENS.PeopleRepository)
    private readonly peopleRepository: IPeopleRepository,
    @inject(TOKENS.CategoryRepository)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  createPeople = async (body: CreatePeopleDTO): Promise<void> => {
    if (body.categorias && body.categorias.length > 0) {
      const existingCategories = await this.categoryRepository.findAllCategory();
      const existingCategoryIds = existingCategories.map(category => category.id);
      
      const invalidCategories = body.categorias.filter(categoryId => !existingCategoryIds.includes(categoryId));

      if (invalidCategories.length > 0) {
        throw new AppError(`Categories not found: ${invalidCategories.join(', ')}`, 404);
      }
    }
    
    await this.peopleRepository.createPeople(body);
  }

  findAllPeople = async (): Promise<any[]> => {
    return await this.peopleRepository.findAllPeople();
  }

  findPeopleById = async (id: string): Promise<any> => {
    const person = await this.peopleRepository.findPeopleById(id);
    
    if (!person) {
      console.log("Passou aqui no findPeopleById");
      throw new AppError(`Person not found`, 404);
    }

    return person;
  }

  updatePeople = async (id: string, body: UpdatePeopleDTO): Promise<void> => {
    await this.peopleRepository.updatePeople(id, body);
  }

  deletePeople = async (id: string): Promise<void> => {
    const person = await this.peopleRepository.findPeopleById(id);
    
    if (!person) {
      throw new AppError(`Person not found`, 404);
    }
    
    await this.peopleRepository.deletePeople(id);
  }
}
