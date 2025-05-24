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

    return new CategoryModel({
      id: created.id,
      nome: created.nome,
      descricao: created.descricao ?? undefined,
      cor: created.cor ?? undefined,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  };

  findAllCategory = async (): Promise<ICategoryModel[]> => {
    const categories = await this.prisma.category.findMany({
      orderBy: { nome: 'asc' }
    });

    return categories.map(
      (category) =>
        new CategoryModel({
          id: category.id,
          nome: category.nome,
          descricao: category.descricao ?? undefined,
          cor: category.cor ?? undefined,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt,
        })
    );
  };

  findCategoryById = async (id: string): Promise<ICategoryModel | null> => {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) return null;

    return new CategoryModel({
      id: category.id,
      nome: category.nome,
      descricao: category.descricao ?? undefined,
      cor: category.cor ?? undefined,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    });
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

    return new CategoryModel({
      id: updated.id,
      nome: updated.nome,
      descricao: updated.descricao ?? undefined,
      cor: updated.cor ?? undefined,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  };

  deleteCategory = async (id: string): Promise<void> => {
    await this.prisma.category.delete({ where: { id } });
  };
}
