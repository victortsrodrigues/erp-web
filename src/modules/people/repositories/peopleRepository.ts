import { injectable, inject } from "tsyringe";
import { IPeopleRepository } from "../interfaces/IPeopleRepository";
import { IPeopleModel } from "../interfaces/IPeopleModel";
import { PeopleModel } from "../models/PeopleModel";
import { CreatePeopleDTO } from "../dtos/createPeopleDTO";
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

  createPeople = async (data: CreatePeopleDTO): Promise<void> => {
    const createdPeople = await this.prisma.people.create({
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
    });
    console.log(createdPeople);
  };

  findAllPeople = async (): Promise<IPeopleModel[]> => {
    const all = await this.prisma.people.findMany();
    return all.map((p) => {
      const {
        id,
        nome,
        email,
        telefone,
        celular,
        dataNascimento,
        cpf,
        rg,
        endereco,
        bairro,
        cidade,
        estado,
        cep,
        observacoes,
        foto,
        ativo,
        createdAt,
        updatedAt,
      } = p;
      return new PeopleModel({
        id,
        nome,
        email: email ?? undefined,
        telefone: telefone ?? undefined,
        celular: celular ?? undefined,
        dataNascimento: dataNascimento ?? undefined,
        cpf: cpf ?? undefined,
        rg: rg ?? undefined,
        endereco: endereco ?? undefined,
        bairro: bairro ?? undefined,
        cidade: cidade ?? undefined,
        estado: estado ?? undefined,
        cep: cep ?? undefined,
        observacoes: observacoes ?? undefined,
        foto: foto ?? undefined,
        ativo,
        createdAt,
        updatedAt,
      });
    });
  };
}
