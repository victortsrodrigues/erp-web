/*
  Warnings:

  - A unique constraint covering the columns `[telefone]` on the table `people` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "people_telefone_key" ON "people"("telefone");
