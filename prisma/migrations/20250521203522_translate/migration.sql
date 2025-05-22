/*
  Warnings:

  - You are about to drop the `categorias` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pessoas` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PessoaCargos" DROP CONSTRAINT "_PessoaCargos_B_fkey";

-- DropForeignKey
ALTER TABLE "_PessoaCategorias" DROP CONSTRAINT "_PessoaCategorias_A_fkey";

-- DropForeignKey
ALTER TABLE "_PessoaCategorias" DROP CONSTRAINT "_PessoaCategorias_B_fkey";

-- DropForeignKey
ALTER TABLE "campo_adicional_valores" DROP CONSTRAINT "campo_adicional_valores_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_pessoaId_fkey";

-- DropTable
DROP TABLE "categorias";

-- DropTable
DROP TABLE "pessoas";

-- CreateTable
CREATE TABLE "people" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "celular" TEXT,
    "dataNascimento" TIMESTAMP(3),
    "cpf" TEXT,
    "rg" TEXT,
    "endereco" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "cep" TEXT,
    "observacoes" TEXT,
    "foto" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "people_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "cor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "people_email_key" ON "people"("email");

-- CreateIndex
CREATE UNIQUE INDEX "people_cpf_key" ON "people"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "category_nome_key" ON "category"("nome");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "people"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campo_adicional_valores" ADD CONSTRAINT "campo_adicional_valores_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PessoaCategorias" ADD CONSTRAINT "_PessoaCategorias_A_fkey" FOREIGN KEY ("A") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PessoaCategorias" ADD CONSTRAINT "_PessoaCategorias_B_fkey" FOREIGN KEY ("B") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PessoaCargos" ADD CONSTRAINT "_PessoaCargos_B_fkey" FOREIGN KEY ("B") REFERENCES "people"("id") ON DELETE CASCADE ON UPDATE CASCADE;
