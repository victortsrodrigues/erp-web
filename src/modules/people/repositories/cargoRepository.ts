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

    return this.mapToCargoModel(created);
  };

  findAllCargo = async (): Promise<ICargoModel[]> => {
    const cargos = await this.prisma.cargo.findMany({
      orderBy: { nome: 'asc' }
    });

    return cargos.map(
      (cargo) =>
        this.mapToCargoModel(cargo)
    );
  };

  findCargoById = async (id: string): Promise<ICargoModel | null> => {
    const cargo = await this.prisma.cargo.findUnique({
      where: { id },
    });

    if (!cargo) return null;

    return this.mapToCargoModel(cargo);
  };

  updateCargo = async (id: string, data: UpdateCargoDTO): Promise<ICargoModel> => {
    const updated = await this.prisma.cargo.update({
      where: { id },
      data: {
        nome: data.nome,
        descricao: data.descricao ?? undefined,
      },
    });

    return this.mapToCargoModel(updated);
  };

  deleteCargo = async (id: string): Promise<void> => {
    await this.prisma.cargo.delete({ where: { id } });
  };

  findCargoByName = async (nome: string): Promise<ICargoModel | null> => {
    const cargo = await this.prisma.cargo.findUnique({
      where: { nome },
    });

    if (!cargo) return null;
    return this.mapToCargoModel(cargo);
  };

  countAllCargo = async (): Promise<number> => {
    return await this.prisma.cargo.count();
  };

  countPeopleWithCargo = async (cargoId: string): Promise<number> => {
    return await this.prisma.people.count({
      where: {
        cargos: {
          some: { id: cargoId }
        }
      }
    });
  };

  private readonly mapToCargoModel = (cargo: any): CargoModel => {
  return new CargoModel({
    id: cargo.id,
    nome: cargo.nome,
    descricao: cargo.descricao ?? undefined,
    createdAt: cargo.createdAt,
    updatedAt: cargo.updatedAt,
  });
};
}
