/*
  Warnings:

  - You are about to drop the column `fecha` on the `Comprobante` table. All the data in the column will be lost.
  - You are about to drop the column `iva` on the `Comprobante` table. All the data in the column will be lost.
  - You are about to drop the column `neto` on the `Comprobante` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Comprobante` table. All the data in the column will be lost.
  - Added the required column `cantReg` to the `Comprobante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cbteDesde` to the `Comprobante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cbteFch` to the `Comprobante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cbteHasta` to the `Comprobante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `impIVA` to the `Comprobante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `impNeto` to the `Comprobante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `impOpEx` to the `Comprobante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `impTotConc` to the `Comprobante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `impTotal` to the `Comprobante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `impTrib` to the `Comprobante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monCotiz` to the `Comprobante` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monId` to the `Comprobante` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comprobante" DROP COLUMN "fecha",
DROP COLUMN "iva",
DROP COLUMN "neto",
DROP COLUMN "total",
ADD COLUMN     "cantReg" INTEGER NOT NULL,
ADD COLUMN     "cbteDesde" INTEGER NOT NULL,
ADD COLUMN     "cbteFch" TEXT NOT NULL,
ADD COLUMN     "cbteHasta" INTEGER NOT NULL,
ADD COLUMN     "impIVA" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "impNeto" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "impOpEx" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "impTotConc" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "impTotal" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "impTrib" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "monCotiz" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "monId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "IvaItem" (
    "id" SERIAL NOT NULL,
    "comprobanteId" INTEGER NOT NULL,
    "tipoId" INTEGER NOT NULL,
    "baseImp" DOUBLE PRECISION NOT NULL,
    "importe" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "IvaItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductoFacturado" (
    "id" SERIAL NOT NULL,
    "comprobanteId" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad" DOUBLE PRECISION NOT NULL,
    "precioUnitario" DOUBLE PRECISION NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ProductoFacturado_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IvaItem" ADD CONSTRAINT "IvaItem_comprobanteId_fkey" FOREIGN KEY ("comprobanteId") REFERENCES "Comprobante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductoFacturado" ADD CONSTRAINT "ProductoFacturado_comprobanteId_fkey" FOREIGN KEY ("comprobanteId") REFERENCES "Comprobante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
