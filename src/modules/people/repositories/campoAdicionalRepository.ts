import { injectable, inject } from "tsyringe";
import { ICampoAdicionalRepository } from "../interfaces/ICampoAdicionalRepository";
import { ICampoAdicionalModel } from "../interfaces/ICampoAdicionalModel";
import { CampoAdicionalModel } from "../models/CampoAdicionalModel";
import { CreateCampoAdicionalDTO } from "../dtos/createCampoAdicionalDTO";
import { UpdateCampoAdicionalDTO } from "../dtos/updateCampoAdicionalDTO";
import prismaClient from "../../../database/client";
import { TOKENS } from "../../../common/tokens";

@injectable()
export class CampoAdicionalRepository implements ICampoAdicionalRepository {
  constructor(
    @inject(TOKENS.PrismaClient)
    private readonly prisma: typeof prismaClient
  ) {}

  createCampoAdicional = async (data: CreateCampoAdicionalDTO): Promise<ICampoAdicionalModel> => {
    const created = await this.prisma.campoAdicional.create({
      data: {
        nome: data.nome,
        tipo: data.tipo,
        obrigatorio: data.obrigatorio ?? false,
        opcoes: data.opcoes ?? undefined,
      },
    });

    return this.mapToCampoAdicionalModel(created);
  };

  findAllCampoAdicional = async (): Promise<ICampoAdicionalModel[]> => {
    const campos = await this.prisma.campoAdicional.findMany({
      orderBy: { nome: 'asc' }
    });

    return campos.map(
      (campo) =>
        this.mapToCampoAdicionalModel(campo)
    );
  };

  findCampoAdicionalById = async (id: string): Promise<ICampoAdicionalModel | null> => {
    const campo = await this.prisma.campoAdicional.findUnique({
      where: { id },
    });

    if (!campo) return null;

    return this.mapToCampoAdicionalModel(campo);
  };

  updateCampoAdicional = async (id: string, data: UpdateCampoAdicionalDTO): Promise<ICampoAdicionalModel> => {
    const updated = await this.prisma.campoAdicional.update({
      where: { id },
      data: {
        nome: data.nome,
        tipo: data.tipo,
        obrigatorio: data.obrigatorio,
        opcoes: data.opcoes ?? undefined,
      },
    });

    return this.mapToCampoAdicionalModel(updated);
  };

  deleteCampoAdicional = async (id: string): Promise<void> => {
    await this.prisma.campoAdicional.delete({ where: { id } });
  };

  findCampoAdicionalByName = async (nome: string): Promise<ICampoAdicionalModel | null> => {
    const campo = await this.prisma.campoAdicional.findUnique({
      where: { nome },
    });

    if (!campo) return null;
    return this.mapToCampoAdicionalModel(campo);
  };

  countAllCampoAdicional = async (): Promise<number> => {
    return await this.prisma.campoAdicional.count();
  };

  hasExistingValues = async (campoId: string): Promise<boolean> => {
    const count = await this.prisma.campoAdicionalValor.count({
      where: { campoAdicionalId: campoId }
    });

    return count > 0;
  };

  hasValuesWithOptions = async (campoId: string, opcoes: string[]): Promise<boolean> => {
    const count = await this.prisma.campoAdicionalValor.count({
      where: {
        campoAdicionalId: campoId,
        valor: {
          in: opcoes
        }
      }
    });

    return count > 0;
  };

  private readonly mapToCampoAdicionalModel = (campo: any): CampoAdicionalModel => {
    return new CampoAdicionalModel({
      id: campo.id,
      nome: campo.nome,
      tipo: campo.tipo,
      obrigatorio: campo.obrigatorio,
      opcoes: campo.opcoes ?? undefined,
      createdAt: campo.createdAt,
      updatedAt: campo.updatedAt,
    });
  };
}
