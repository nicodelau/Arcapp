/*
  Warnings:

  - Added the required column `id_arca` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Producto" ADD COLUMN     "id_arca" INTEGER NOT NULL;
