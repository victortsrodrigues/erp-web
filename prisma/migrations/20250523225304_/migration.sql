/*
  Warnings:

  - A unique constraint covering the columns `[celular]` on the table `people` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rg]` on the table `people` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "people_celular_key" ON "people"("celular");

-- CreateIndex
CREATE UNIQUE INDEX "people_rg_key" ON "people"("rg");
