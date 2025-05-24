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

    return new CampoAdicionalModel({
      id: created.id,
      nome: created.nome,
      tipo: created.tipo,
      obrigatorio: created.obrigatorio,
      opcoes: created.opcoes ?? undefined,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    });
  };

  findAllCampoAdicional = async (): Promise<ICampoAdicionalModel[]> => {
    const campos = await this.prisma.campoAdicional.findMany({
      orderBy: { nome: 'asc' }
    });

    return campos.map(
      (campo) =>
        new CampoAdicionalModel({
          id: campo.id,
          nome: campo.nome,
          tipo: campo.tipo,
          obrigatorio: campo.obrigatorio,
          opcoes: campo.opcoes ?? undefined,
          createdAt: campo.createdAt,
          updatedAt: campo.updatedAt,
        })
    );
  };

  findCampoAdicionalById = async (id: string): Promise<ICampoAdicionalModel | null> => {
    const campo = await this.prisma.campoAdicional.findUnique({
      where: { id },
    });

    if (!campo) return null;

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

    return new CampoAdicionalModel({
      id: updated.id,
      nome: updated.nome,
      tipo: updated.tipo,
      obrigatorio: updated.obrigatorio,
      opcoes: updated.opcoes ?? undefined,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    });
  };

  deleteCampoAdicional = async (id: string): Promise<void> => {
    await this.prisma.campoAdicional.delete({ where: { id } });
  };
}
