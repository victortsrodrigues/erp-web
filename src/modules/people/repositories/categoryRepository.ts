import { injectable, inject } from "tsyringe";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";
import { ICategoryModel } from "../interfaces/ICategoryModel";
import { CategoryModel } from "../models/CategoryModel";
import { CreateCategoryDTO } from "../dtos/createCategoryDTO";
import { UpdateCategoryDTO } from "../dtos/updateCategoryDTO";
import prismaClient from "../../../database/client";
import { TOKENS } from "../../../common/tokens";

@injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(
    @inject(TOKENS.PrismaClient)
    private readonly prisma: typeof prismaClient
  ) {}

  createCategory = async (data: CreateCategoryDTO): Promise<ICategoryModel> => {
    const created = await this.prisma.category.create({
      data: {
        nome: data.nome,
        descricao: data.descricao ?? undefined,
        cor: data.cor ?? undefined,
      },
    });

    return this.mapToCategoryModel(created);
  };

  findAllCategory = async (): Promise<ICategoryModel[]> => {
    const categories = await this.prisma.category.findMany({
      orderBy: { nome: 'asc' }
    });

    return categories.map(
      (category) =>
        this.mapToCategoryModel(category)
    );
  };

  findCategoryById = async (id: string): Promise<ICategoryModel | null> => {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) return null;

    return this.mapToCategoryModel(category);
  };

  updateCategory = async (id: string, data: UpdateCategoryDTO): Promise<ICategoryModel> => {
    const updated = await this.prisma.category.update({
      where: { id },
      data: {
        nome: data.nome,
        descricao: data.descricao ?? undefined,
        cor: data.cor ?? undefined,
      },
    });

    return this.mapToCategoryModel(updated);
  };

  deleteCategory = async (id: string): Promise<void> => {
    await this.prisma.category.delete({ where: { id } });
  };

  findCategoryByName = async (nome: string): Promise<ICategoryModel | null> => {
    const category = await this.prisma.category.findUnique({
      where: { nome },
    });

    if (!category) return null;
    return this.mapToCategoryModel(category);
  };

  findCategoryByColor = async (cor: string): Promise<ICategoryModel | null> => {
    const category = await this.prisma.category.findFirst({
      where: { cor },
    });

    if (!category) return null;
    return this.mapToCategoryModel(category);
  };

  countAllCategory = async (): Promise<number> => {
    return await this.prisma.category.count();
  };

  countPeopleWithCategory = async (categoryId: string): Promise<number> => {
    return await this.prisma.people.count({
      where: {
        categorias: {
          some: { id: categoryId }
        }
      }
    });
  };

  // Método auxiliar para evitar repetição de código
  private readonly mapToCategoryModel = (category: any): CategoryModel => {
    return new CategoryModel({
      id: category.id,
      nome: category.nome,
      descricao: category.descricao ?? undefined,
      cor: category.cor ?? undefined,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });
  };
}
