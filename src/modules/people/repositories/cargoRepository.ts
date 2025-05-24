import { injectable, inject } from "tsyringe";
import { ICargoRepository } from "../interfaces/ICargoRepository";
import { ICargoModel } from "../interfaces/ICargoModel";
import { CargoModel } from "../models/CargoModel";
import { CreateCargoDTO } from "../dtos/createCargoDTO";
import { UpdateCargoDTO } from "../dtos/updateCargoDTO";
import prismaClient from "../../../database/client";
import { TOKENS } from "../../../common/tokens";

@injectable()
export class CargoRepository implements ICargoRepository {
  constructor(
    @inject(TOKENS.PrismaClient)
    private readonly prisma: typeof prismaClient
  ) {}

  createCargo = async (data: CreateCargoDTO): Promise<ICargoModel> => {
    const created = await this.prisma.cargo.create({
      data: {
        nome: data.nome,
        descricao: data.descricao ?? undefined,
      },
    });

    return new CargoModel({
      id: created.id,
      nome: created.nome,
      descricao: created.descricao ?? undefined,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  };

  findAllCargo = async (): Promise<ICargoModel[]> => {
    const cargos = await this.prisma.cargo.findMany({
      orderBy: { nome: 'asc' }
    });

    return cargos.map(
      (cargo) =>
        new CargoModel({
          id: cargo.id,
          nome: cargo.nome,
          descricao: cargo.descricao ?? undefined,
          createdAt: cargo.createdAt,
          updatedAt: cargo.updatedAt,
        })
    );
  };

  findCargoById = async (id: string): Promise<ICargoModel | null> => {
    const cargo = await this.prisma.cargo.findUnique({
      where: { id },
    });

    if (!cargo) return null;

    return new CargoModel({
      id: cargo.id,
      nome: cargo.nome,
      descricao: cargo.descricao ?? undefined,
      createdAt: cargo.createdAt,
      updatedAt: cargo.updatedAt,
    });
  };

  updateCargo = async (id: string, data: UpdateCargoDTO): Promise<ICargoModel> => {
    const updated = await this.prisma.cargo.update({
      where: { id },
      data: {
        nome: data.nome,
        descricao: data.descricao ?? undefined,
      },
    });

    return new CargoModel({
      id: updated.id,
      nome: updated.nome,
      descricao: updated.descricao ?? undefined,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  };

  deleteCargo = async (id: string): Promise<void> => {
    await this.prisma.cargo.delete({ where: { id } });
  };
}
