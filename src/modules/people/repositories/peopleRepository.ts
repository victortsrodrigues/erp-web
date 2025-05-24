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

    return this.mapPersonToPeopleModel(created);
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
      (p) => this.mapPersonToPeopleModel(p)
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

    return this.mapPersonToPeopleModel(p);
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

    return this.mapPersonToPeopleModel(updated);
  };

  deletePeople = async (id: string): Promise<void> => {
    await this.prisma.people.delete({ where: { id } });
  };

  findPeopleByEmail = async (email: string): Promise<IPeopleModel | null> => {
  const person = await this.prisma.people.findUnique({
    where: { email },
    include: {
      categorias: true,
      cargos: true,
      camposAdicionais: { include: { campoAdicional: true } },
    },
  });

  if (!person) return null;

  return this.mapPersonToPeopleModel(person);
};

findPeopleByCPF = async (cpf: string): Promise<IPeopleModel | null> => {
  const person = await this.prisma.people.findUnique({
    where: { cpf },
    include: {
      categorias: true,
      cargos: true,
      camposAdicionais: { include: { campoAdicional: true } },
    },
  });

  if (!person) return null;

  return this.mapPersonToPeopleModel(person);
};

findPeopleByTelefone = async (telefone: string): Promise<IPeopleModel | null> => {
  const person = await this.prisma.people.findUnique({
    where: { telefone },
    include: {
      categorias: true,
      cargos: true,
      camposAdicionais: { include: { campoAdicional: true } },
    },
  });

  if (!person) return null;
  return this.mapPersonToPeopleModel(person);
};

findPeopleByCelular = async (celular: string): Promise<IPeopleModel | null> => {
  const person = await this.prisma.people.findUnique({
    where: { celular },
    include: {
      categorias: true,
      cargos: true,
      camposAdicionais: { include: { campoAdicional: true } },
    },
  });

  if (!person) return null;
  return this.mapPersonToPeopleModel(person);
};

findPeopleByRG = async (rg: string): Promise<IPeopleModel | null> => {
  const person = await this.prisma.people.findUnique({
    where: { rg },
    include: {
      categorias: true,
      cargos: true,
      camposAdicionais: { include: { campoAdicional: true } },
    },
  });

  if (!person) return null;
  return this.mapPersonToPeopleModel(person);
};

// Método auxiliar para evitar repetição de código
private readonly mapPersonToPeopleModel = (person: any): PeopleModel => {
  return new PeopleModel({
    id: person.id,
    nome: person.nome,
    email: person.email ?? undefined,
    telefone: person.telefone ?? undefined,
    celular: person.celular ?? undefined,
    dataNascimento: person.dataNascimento ?? undefined,
    cpf: person.cpf ?? undefined,
    rg: person.rg ?? undefined,
    endereco: person.endereco ?? undefined,
    bairro: person.bairro ?? undefined,
    cidade: person.cidade ?? undefined,
    estado: person.estado ?? undefined,
    cep: person.cep ?? undefined,
    observacoes: person.observacoes ?? undefined,
    foto: person.foto ?? undefined,
    ativo: person.ativo,
    createdAt: person.createdAt,
    updatedAt: person.updatedAt,
    categorias: person.categorias.map((c: any) => ({
      id: c.id,
      nome: c.nome,
      descricao: c.descricao ?? undefined,
      cor: c.cor ?? undefined,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    })),
    cargos: person.cargos.map((c: any) => ({
      id: c.id,
      nome: c.nome,
      descricao: c.descricao ?? undefined,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    })),
    camposAdicionais: person.camposAdicionais.map((v: any) => ({
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
}
