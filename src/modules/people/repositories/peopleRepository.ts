import { injectable, inject } from "tsyringe";
import { IPeopleRepository } from "../interfaces/IPeopleRepository";
import { IPeopleModel } from "../interfaces/IPeopleModel";
import { PeopleModel } from "../models/PeopleModel";
import { CreatePeopleDTO } from "../dtos/createPeopleDTO";
import { UpdatePeopleDTO } from "../dtos/updatePeopleDTO";
import prismaClient from "../../../database/client";
import { TOKENS } from "../../../common/tokens";

@injectable()
export class PeopleRepository implements IPeopleRepository {
  constructor(
    @inject(TOKENS.PrismaClient)
    private readonly prisma: typeof prismaClient
  ) {}

  log(name: string): void {
    console.log(`Hello from people repository ${name}`);
  }

  createPeople = async (data: CreatePeopleDTO): Promise<IPeopleModel> => {
    const created = await this.prisma.people.create({
      data: {
        nome: data.nome,
        email: data.email ?? undefined, // Usa ?? undefined para campos opcionais
        telefone: data.telefone ?? undefined,
        celular: data.celular ?? undefined,
        dataNascimento: data.dataNascimento ?? undefined,
        cpf: data.cpf ?? undefined,
        rg: data.rg ?? undefined,
        endereco: data.endereco ?? undefined,
        bairro: data.bairro ?? undefined,
        cidade: data.cidade ?? undefined,
        estado: data.estado ?? undefined,
        cep: data.cep ?? undefined,
        observacoes: data.observacoes ?? undefined,
        foto: data.foto ?? undefined,
        ativo: data.ativo ?? true,
        // Conecta categorias existentes (se houver)
        categorias: data.categorias
          ? {
              connect: data.categorias.map((id) => ({ id })),
            }
          : undefined,
        // Conecta cargos existentes (se houver)
        cargos: data.cargos
          ? {
              connect: data.cargos.map((id) => ({ id })),
            }
          : undefined,
        // Cria valores para campos adicionais (se houver)
        camposAdicionais: data.camposAdicionais
          ? {
              create: Object.entries(data.camposAdicionais).map(
                ([campoId, valor]) => ({
                  valor: valor,
                  campoAdicional: { connect: { id: campoId } },
                })
              ),
            }
          : undefined,
      },
      include: {
        categorias: true,
        cargos: true,
        camposAdicionais: {
          include: {
            campoAdicional: true,
          },
        },
      },
    });
    console.log(created);
    return new PeopleModel({
      id: created.id,
      nome: created.nome,
      email: created.email ?? undefined,
      telefone: created.telefone ?? undefined,
      celular: created.celular ?? undefined,
      dataNascimento: created.dataNascimento ?? undefined,
      cpf: created.cpf ?? undefined,
      rg: created.rg ?? undefined,
      endereco: created.endereco ?? undefined,
      bairro: created.bairro ?? undefined,
      cidade: created.cidade ?? undefined,
      estado: created.estado ?? undefined,
      cep: created.cep ?? undefined,
      observacoes: created.observacoes ?? undefined,
      foto: created.foto ?? undefined,
      ativo: created.ativo,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,

      // Abaixo, as coleções vindas do include:
      categorias: created.categorias.map((c) => ({
        id: c.id,
        nome: c.nome,
        descricao: c.descricao ?? undefined,
        cor: c.cor ?? undefined,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
      cargos: created.cargos.map((c) => ({
        id: c.id,
        nome: c.nome,
        descricao: c.descricao ?? undefined,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
      camposAdicionais: created.camposAdicionais.map((v) => ({
        id: v.id,
        valor: v.valor,
        campoAdicional: {
          id: v.campoAdicional.id,
          nome: v.campoAdicional.nome,
          tipo: v.campoAdicional.tipo,
          obrigatorio: v.campoAdicional.obrigatorio,
          opcoes: v.campoAdicional.opcoes,
          createdAt: v.campoAdicional.createdAt,
          updatedAt: v.campoAdicional.updatedAt,
        },
      })),
    });
  };

  findAllPeople = async (): Promise<IPeopleModel[]> => {
    const all = await this.prisma.people.findMany({
      include: {
        categorias: true,
        cargos: true,
        camposAdicionais: { include: { campoAdicional: true } },
      },
    });

    return all.map(
      (p) =>
        new PeopleModel({
          id: p.id,
          nome: p.nome,
          email: p.email ?? undefined,
          telefone: p.telefone ?? undefined,
          celular: p.celular ?? undefined,
          dataNascimento: p.dataNascimento ?? undefined,
          cpf: p.cpf ?? undefined,
          rg: p.rg ?? undefined,
          endereco: p.endereco ?? undefined,
          bairro: p.bairro ?? undefined,
          cidade: p.cidade ?? undefined,
          estado: p.estado ?? undefined,
          cep: p.cep ?? undefined,
          observacoes: p.observacoes ?? undefined,
          foto: p.foto ?? undefined,
          ativo: p.ativo,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,

          categorias: p.categorias.map((c) => ({
            id: c.id,
            nome: c.nome,
            descricao: c.descricao ?? undefined,
            cor: c.cor ?? undefined,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
          })),
          cargos: p.cargos.map((c) => ({
            id: c.id,
            nome: c.nome,
            descricao: c.descricao ?? undefined,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
          })),
          camposAdicionais: p.camposAdicionais.map((v) => ({
            id: v.id,
            valor: v.valor,
            campoAdicional: {
              id: v.campoAdicional.id,
              nome: v.campoAdicional.nome,
              tipo: v.campoAdicional.tipo,
              obrigatorio: v.campoAdicional.obrigatorio,
              opcoes: v.campoAdicional.opcoes,
              createdAt: v.campoAdicional.createdAt,
              updatedAt: v.campoAdicional.updatedAt,
            },
          })),
        })
    );
  };

  findPeopleById = async (id: string): Promise<IPeopleModel | null> => {
    const p = await this.prisma.people.findUnique({
      where: { id },
      include: {
        categorias: true,
        cargos: true,
        camposAdicionais: { include: { campoAdicional: true } },
      },
    });

    if (!p) return null;

    return new PeopleModel({
      id: p.id,
      nome: p.nome,
      email: p.email ?? undefined,
      telefone: p.telefone ?? undefined,
      celular: p.celular ?? undefined,
      dataNascimento: p.dataNascimento ?? undefined,
      cpf: p.cpf ?? undefined,
      rg: p.rg ?? undefined,
      endereco: p.endereco ?? undefined,
      bairro: p.bairro ?? undefined,
      cidade: p.cidade ?? undefined,
      estado: p.estado ?? undefined,
      cep: p.cep ?? undefined,
      observacoes: p.observacoes ?? undefined,
      foto: p.foto ?? undefined,
      ativo: p.ativo,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,

      categorias: p.categorias.map((c) => ({
        id: c.id,
        nome: c.nome,
        descricao: c.descricao ?? undefined,
        cor: c.cor ?? undefined,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
      cargos: p.cargos.map((c) => ({
        id: c.id,
        nome: c.nome,
        descricao: c.descricao ?? undefined,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
      camposAdicionais: p.camposAdicionais.map((v) => ({
        id: v.id,
        valor: v.valor,
        campoAdicional: {
          id: v.campoAdicional.id,
          nome: v.campoAdicional.nome,
          tipo: v.campoAdicional.tipo,
          obrigatorio: v.campoAdicional.obrigatorio,
          opcoes: v.campoAdicional.opcoes,
          createdAt: v.campoAdicional.createdAt,
          updatedAt: v.campoAdicional.updatedAt,
        },
      })),
    });
  };

  updatePeople = async (
    id: string,
    data: UpdatePeopleDTO
  ): Promise<PeopleModel> => {
    const updated = await this.prisma.people.update({
      where: { id },
      data: {
        nome: data.nome,
        email: data.email ?? undefined,
        telefone: data.telefone ?? undefined,
        celular: data.celular ?? undefined,
        dataNascimento: data.dataNascimento ?? undefined,
        cpf: data.cpf ?? undefined,
        rg: data.rg ?? undefined,
        endereco: data.endereco ?? undefined,
        bairro: data.bairro ?? undefined,
        cidade: data.cidade ?? undefined,
        estado: data.estado ?? undefined,
        cep: data.cep ?? undefined,
        observacoes: data.observacoes ?? undefined,
        foto: data.foto ?? undefined,
        ativo: data.ativo,

        // RELACIONAMENTOS:

        // 1) Categorias (N-N): primeiro, desconecta tudo, depois conecta as novas:
        // “a lista final de categorias que a pessoa deve ter” - cuidado redobrado no front-end
        categorias: {
          set: data.categorias
            ? data.categorias.map((idCat) => ({ id: idCat }))
            : [],
        },

        // 2) Cargos (N-N): mesmo padrão de set
        // “a lista final de cargos que a pessoa deve ter” - cuidado redobrado no front-end
        cargos: {
          set: data.cargos
            ? data.cargos.map((idCargo) => ({ id: idCargo }))
            : [],
        },

        // 3) Campos Adicionais (1-N): para atualizar, talvez
        //    a) excluir todos os valores anteriores (se não vierem no DTO)
        //    b) criar os novos.
        // Uma estratégia simples: apagar os valores existentes e criar novamente:
        camposAdicionais: {
          deleteMany: {}, // remove todos os registros antigos ligados a esta pessoa
          create: data.camposAdicionais
            ? Object.entries(data.camposAdicionais).map(
                ([campoAdicionalId, valor]) => ({
                  campoAdicional: { connect: { id: campoAdicionalId } },
                  valor,
                })
              )
            : [],
        },
      },
      include: {
        categorias: true,
        cargos: true,
        camposAdicionais: { include: { campoAdicional: true } },
      },
    });

    // Mapear updated (semelhante ao findById / findAll) para PeopleModel
    return new PeopleModel({
      id: updated.id,
      nome: updated.nome,
      email: updated.email ?? undefined,
      telefone: updated.telefone ?? undefined,
      celular: updated.celular ?? undefined,
      dataNascimento: updated.dataNascimento ?? undefined,
      cpf: updated.cpf ?? undefined,
      rg: updated.rg ?? undefined,
      endereco: updated.endereco ?? undefined,
      bairro: updated.bairro ?? undefined,
      cidade: updated.cidade ?? undefined,
      estado: updated.estado ?? undefined,
      cep: updated.cep ?? undefined,
      observacoes: updated.observacoes ?? undefined,
      foto: updated.foto ?? undefined,
      ativo: updated.ativo,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,

      categorias: updated.categorias.map((c) => ({
        id: c.id,
        nome: c.nome,
        descricao: c.descricao ?? undefined,
        cor: c.cor ?? undefined,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
      cargos: updated.cargos.map((c) => ({
        id: c.id,
        nome: c.nome,
        descricao: c.descricao ?? undefined,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
      camposAdicionais: updated.camposAdicionais.map((v) => ({
        id: v.id,
        valor: v.valor,
        campoAdicional: {
          id: v.campoAdicional.id,
          nome: v.campoAdicional.nome,
          tipo: v.campoAdicional.tipo,
          obrigatorio: v.campoAdicional.obrigatorio,
          opcoes: v.campoAdicional.opcoes,
          createdAt: v.campoAdicional.createdAt,
          updatedAt: v.campoAdicional.updatedAt,
        },
      })),
    });
  };

  deletePeople = async (id: string): Promise<void> => {
    await this.prisma.people.delete({ where: { id } });
  };
}
