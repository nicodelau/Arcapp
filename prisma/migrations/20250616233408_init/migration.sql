/*
  Warnings:

  - Added the required column `cae` to the `Comprobante` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comprobante" ADD COLUMN     "cae" INTEGER NOT NULL;
